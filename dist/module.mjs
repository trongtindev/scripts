import { useNuxt, useLogger, addDevServerHandler, createResolver, addTemplate, tryUseNuxt, logger as logger$1, defineNuxtModule, addImportsDir, addComponentsDir, addImports, addPluginTemplate, addBuildPlugin, hasNuxtModule } from '@nuxt/kit';
import { resolvePackageJSON, readPackageJSON } from 'pkg-types';
import { lt } from 'semver';
import { resolvePath } from 'mlly';
import { join, relative } from 'pathe';
import { existsSync } from 'node:fs';
import { createUnplugin } from 'unplugin';
import MagicString from 'magic-string';
import { walk } from 'estree-walker';
import { pathToFileURL } from 'node:url';
import { parseURL, parseQuery, joinURL, hasProtocol } from 'ufo';
import fsp from 'node:fs/promises';
import { lazyEventHandler, eventHandler, createError } from 'h3';
import { fetch } from 'ofetch';
import { colors } from 'consola/utils';
import { defu } from 'defu';
import { hash } from 'ohash';
import { createStorage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs-lite';
import { isCI, provider } from 'std-env';
import { registry } from './registry.mjs';
import 'third-party-capital';

const DEVTOOLS_UI_ROUTE = "/__nuxt-scripts";
const DEVTOOLS_UI_LOCAL_PORT = 3300;

function setupDevToolsUI(options, resolve, nuxt = useNuxt()) {
  const clientPath = resolve("./client");
  const isProductionBuild = existsSync(clientPath);
  if (isProductionBuild) {
    nuxt.hook("vite:serverCreated", async (server) => {
      const sirv = await import('sirv').then((r) => r.default || r);
      server.middlewares.use(
        DEVTOOLS_UI_ROUTE,
        sirv(clientPath, { dev: true, single: true })
      );
    });
  } else {
    nuxt.hook("vite:extendConfig", (config) => {
      config.server = config.server || {};
      config.server.proxy = config.server.proxy || {};
      config.server.proxy[DEVTOOLS_UI_ROUTE] = {
        target: `http://localhost:${DEVTOOLS_UI_LOCAL_PORT}${DEVTOOLS_UI_ROUTE}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(DEVTOOLS_UI_ROUTE, "")
      };
    });
  }
  nuxt.hook("devtools:customTabs", (tabs) => {
    tabs.push({
      // unique identifier
      name: "nuxt-scripts",
      // title to display in the tab
      title: "Scripts",
      // any icon from Iconify, or a URL to an image
      icon: "carbon:script",
      // iframe view
      view: {
        type: "iframe",
        src: DEVTOOLS_UI_ROUTE
      }
    });
  });
}

function isVue(id, opts = {}) {
  const { search } = parseURL(decodeURIComponent(pathToFileURL(id).href));
  if (id.endsWith(".vue") && !search) {
    return true;
  }
  if (!search) {
    return false;
  }
  const query = parseQuery(search);
  if (query.nuxt_component) {
    return false;
  }
  if (query.macro && (search === "?macro=true" || !opts.type || opts.type.includes("script"))) {
    return true;
  }
  const type = "setup" in query ? "script" : query.type;
  if (!("vue" in query) || opts.type && !opts.type.includes(type)) {
    return false;
  }
  return true;
}
const JS_RE = /\.(?:[cm]?j|t)sx?$/;
function isJS(id) {
  const { pathname } = parseURL(decodeURIComponent(pathToFileURL(id).href));
  return JS_RE.test(pathname);
}

function NuxtScriptBundleTransformer(options) {
  return createUnplugin(() => {
    return {
      name: "nuxt:scripts:bundler-transformer",
      transformInclude(id) {
        return isVue(id, { type: ["template", "script"] }) || isJS(id);
      },
      async transform(code, id) {
        if (!code.includes("useScript"))
          return;
        const ast = this.parse(code);
        const s = new MagicString(code);
        walk(ast, {
          enter(_node) {
            const calleeName = _node.callee?.name;
            if (!calleeName)
              return;
            const isValidCallee = calleeName === "useScript" || calleeName?.startsWith("useScript") && /^[A-Z]$/.test(calleeName?.charAt(9)) && !calleeName.startsWith("useScriptTrigger") && !calleeName.startsWith("useScriptEvent");
            if (_node.type === "CallExpression" && _node.callee.type === "Identifier" && isValidCallee) {
              const fnName = _node.callee?.name;
              const node = _node;
              let scriptSrcNode;
              let src;
              if (fnName === "useScript") {
                if (node.arguments[0].type === "Literal") {
                  scriptSrcNode = node.arguments[0];
                } else if (node.arguments[0].type === "ObjectExpression") {
                  const srcProperty = node.arguments[0].properties.find(
                    (p) => (p.key?.name === "src" || p.key?.value === "src") && p?.value.type === "Literal"
                  );
                  scriptSrcNode = srcProperty?.value;
                }
              } else {
                const registryNode = options.scripts?.find((i) => i.import.name === fnName);
                if (!registryNode) {
                  return;
                }
                if (!registryNode.scriptBundling && !registryNode.src)
                  return;
                if (node.arguments[0]?.type === "ObjectExpression") {
                  const optionsNode = node.arguments[0];
                  const fnArg0 = {};
                  for (const prop of optionsNode.properties) {
                    if (prop.type === "Property" && prop.value.type === "Literal")
                      fnArg0[prop.key.name] = prop.value.value;
                  }
                  const srcProperty = node.arguments[0].properties.find(
                    (p) => (p.key?.name === "src" || p.key?.value === "src") && p?.value.type === "Literal" && p.type === "Property"
                  );
                  if (srcProperty?.value?.value) {
                    scriptSrcNode = srcProperty?.value;
                  } else {
                    src = registryNode.scriptBundling && registryNode.scriptBundling(fnArg0);
                    if (src === false)
                      return;
                  }
                }
              }
              if (scriptSrcNode || src) {
                src = src || (typeof scriptSrcNode?.value === "string" ? scriptSrcNode?.value : false);
                if (src) {
                  let canBundle = options.defaultBundle;
                  if (node.arguments[1]?.type === "ObjectExpression") {
                    const scriptOptionsArg = node.arguments[1];
                    const bundleProperty = scriptOptionsArg.properties.find(
                      (p) => (p.key?.name === "bundle" || p.key?.value === "bundle") && p.type === "Property"
                    );
                    if (bundleProperty && bundleProperty.value.type === "Literal") {
                      const value = bundleProperty.value;
                      if (String(value.value) !== "true") {
                        canBundle = false;
                        return;
                      }
                      if (scriptOptionsArg.properties.length === 1) {
                        s.remove(scriptOptionsArg.start, scriptOptionsArg.end);
                      } else {
                        const nextProperty = scriptOptionsArg.properties.find(
                          (p) => p.start > bundleProperty.end && p.type === "Property"
                        );
                        s.remove(bundleProperty.start, nextProperty ? nextProperty.start : bundleProperty.end);
                      }
                      canBundle = true;
                    }
                  }
                  if (canBundle) {
                    const newSrc = options.resolveScript(src);
                    if (src === newSrc) {
                      if (src.startsWith("/"))
                        console.warn(`[Nuxt Scripts: Bundle Transformer] Relative scripts are already bundled. Skipping bundling for \`${src}\`.`);
                      else
                        console.warn(`[Nuxt Scripts: Bundle Transformer] Failed to bundle ${src}.`);
                    }
                    if (scriptSrcNode) {
                      s.overwrite(scriptSrcNode.start, scriptSrcNode.end, `'${newSrc}'`);
                    } else {
                      const optionsNode = node.arguments[0];
                      const scriptInputProperty = optionsNode.properties.find(
                        (p) => p.key?.name === "scriptInput" || p.key?.value === "scriptInput"
                      );
                      if (scriptInputProperty) {
                        const scriptInput = scriptInputProperty.value;
                        if (scriptInput.type === "ObjectExpression") {
                          const srcProperty = scriptInput.properties.find(
                            (p) => p.key?.name === "src" || p.key?.value === "src"
                          );
                          if (srcProperty)
                            s.overwrite(srcProperty.value.start, srcProperty.value.end, `'${newSrc}'`);
                          else
                            s.appendRight(scriptInput.end, `, src: '${newSrc}'`);
                        }
                      } else {
                        s.appendRight(node.arguments[0].start + 1, ` scriptInput: { src: '${newSrc}' }, `);
                      }
                    }
                  }
                }
              }
            }
          }
        });
        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ includeContent: true, source: id })
          };
        }
      }
    };
  });
}

const logger = useLogger("@nuxt/scripts");

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
function setupPublicAssetStrategy(options = {}) {
  const assetsBaseURL = options.prefix || "/_scripts";
  const nuxt = useNuxt();
  const renderedScriptSrc = /* @__PURE__ */ new Map();
  const storage = createStorage(fsDriver({
    base: "node_modules/.cache/nuxt/scripts"
  }));
  function normalizeScriptData(src) {
    if (hasProtocol(src, { acceptRelative: true })) {
      src = src.replace(/^\/\//, "https://");
      const url = parseURL(src);
      const file = [
        `${hash(url)}.js`
        // force an extension
      ].filter(Boolean).join("-");
      renderedScriptSrc.set(file, src);
      return joinURL(assetsBaseURL, file);
    }
    return src;
  }
  addDevServerHandler({
    route: assetsBaseURL,
    handler: lazyEventHandler(async () => {
      return eventHandler(async (event) => {
        const filename = event.path.slice(1);
        const url = renderedScriptSrc.get(event.path.slice(1));
        if (!url)
          throw createError({ statusCode: 404 });
        const key = `data:scripts:${filename}`;
        let res = await storage.getItemRaw(key);
        if (!res) {
          res = await fetch(url).then((r) => r.arrayBuffer()).then((r) => Buffer.from(r));
          await storage.setItemRaw(key, res);
        }
        return res;
      });
    })
  });
  if (nuxt.options.dev) {
    nuxt.options.routeRules ||= {};
    nuxt.options.routeRules[joinURL(assetsBaseURL, "**")] = {
      cache: {
        maxAge: ONE_YEAR_IN_SECONDS
      }
    };
  }
  nuxt.options.nitro.publicAssets ||= [];
  const cacheDir = join(nuxt.options.buildDir, "cache", "scripts");
  nuxt.options.nitro.publicAssets.push();
  nuxt.options.nitro = defu(nuxt.options.nitro, {
    publicAssets: [{
      dir: cacheDir,
      maxAge: ONE_YEAR_IN_SECONDS,
      baseURL: assetsBaseURL
    }],
    prerender: {
      ignore: [assetsBaseURL]
    }
  });
  nuxt.hook("nitro:init", async (nitro) => {
    if (nuxt.options.dev)
      return;
    nitro.hooks.hook("rollup:before", async () => {
      await fsp.rm(cacheDir, { recursive: true, force: true });
      await fsp.mkdir(cacheDir, { recursive: true });
      let banner = false;
      for (const [filename, url] of renderedScriptSrc) {
        const key = `data:scripts:${filename}`;
        let res = await storage.getItemRaw(key);
        if (!res) {
          if (!banner) {
            banner = true;
            logger.info("Downloading scripts...");
          }
          let encoding;
          let size = 0;
          res = await fetch(url).then((r) => {
            encoding = r.headers.get("content-encoding");
            const contentLength = r.headers.get("content-length");
            size = contentLength ? Number(contentLength) / 1024 : 0;
            return r.arrayBuffer();
          }).then((r) => Buffer.from(r));
          logger.log(colors.gray(`  \u251C\u2500 ${url} \u2192 ${joinURL(assetsBaseURL, filename)} (${size.toFixed(2)} kB ${encoding})`));
          await storage.setItemRaw(key, res);
        }
        await fsp.writeFile(join(cacheDir, filename), res);
      }
      if (banner)
        logger.success("Scripts downloaded and cached.");
    });
  });
  return { normalizeScriptData };
}

function extendTypes(module, template) {
  const nuxt = useNuxt();
  const { resolve } = createResolver(import.meta.url);
  const fileName = `${module.replace("/", "-")}.d.ts`;
  addTemplate({
    filename: `modules/${fileName}`,
    getContents: async () => {
      const typesPath = relative(resolve(nuxt.options.rootDir, nuxt.options.buildDir, "module"), resolve("runtime/types"));
      const s = await template({ typesPath });
      return `// Generated by ${module}
${s}
export {}
`;
    }
  });
  nuxt.hooks.hook("prepare:types", ({ references }) => {
    references.push({ path: resolve(nuxt.options.buildDir, `modules/${fileName}`) });
  });
}
const isStackblitz = provider === "stackblitz";
async function promptToInstall(name, installCommand, options) {
  if (await resolvePackageJSON(name, { url: options.searchPaths }).catch(() => null))
    return true;
  logger$1.info(`Package ${name} is missing`);
  if (isCI)
    return false;
  if (options.prompt === true || options.prompt !== false && !isStackblitz) {
    const confirm = await logger$1.prompt(`Do you want to install ${name} package?`, {
      type: "confirm",
      name: "confirm",
      initial: true
    });
    if (!confirm)
      return false;
  }
  logger$1.info(`Installing ${name}...`);
  try {
    await installCommand();
    logger$1.success(`Installed ${name}`);
    return true;
  } catch (err) {
    logger$1.error(err);
    return false;
  }
}
const installPrompts = /* @__PURE__ */ new Set();
function installNuxtModule(name, options) {
  if (installPrompts.has(name))
    return;
  installPrompts.add(name);
  const nuxt = tryUseNuxt();
  if (!nuxt)
    return;
  return promptToInstall(name, async () => {
    const { runCommand } = await import(String("nuxi"));
    await runCommand("module", ["add", name, "--cwd", nuxt.options.rootDir]);
  }, { rootDir: nuxt.options.rootDir, searchPaths: nuxt.options.modulesDir, ...options });
}

function NuxtScriptsCheckScripts() {
  return createUnplugin(() => {
    return {
      name: "nuxt-scripts:check-scripts",
      transformInclude(id) {
        return isVue(id, { type: ["script"] });
      },
      async transform(code) {
        if (!code.includes("useScript"))
          return;
        const ast = this.parse(code);
        let nameNode;
        let errorNode;
        walk(ast, {
          enter(_node) {
            if (_node.type === "VariableDeclaration" && _node.declarations?.[0]?.id?.type === "ObjectPattern") {
              const objPattern = _node.declarations[0]?.id;
              for (const property of objPattern.properties) {
                if (property.type === "Property" && property.key.type === "Identifier" && property.key.name === "$script" && property.value.type === "Identifier") {
                  nameNode = _node;
                }
              }
            }
            if (nameNode) {
              let sequence = _node.type === "SequenceExpression" ? _node : null;
              let assignmentExpression;
              if (_node.type === "VariableDeclaration") {
                if (_node.declarations[0]?.init?.type === "SequenceExpression") {
                  sequence = _node.declarations[0]?.init;
                  assignmentExpression = _node.declarations[0]?.init?.expressions?.[0];
                }
              }
              if (sequence && !assignmentExpression) {
                assignmentExpression = sequence.expressions[0]?.type === "AssignmentExpression" ? sequence.expressions[0] : null;
              }
              if (assignmentExpression) {
                const right = assignmentExpression?.right;
                if (right.callee?.name === "_withAsyncContext") {
                  if (right.arguments[0]?.body?.name === "$script" || right.arguments[0]?.body?.callee?.object?.name === "$script") {
                    errorNode = nameNode;
                  }
                }
              }
            }
          }
        });
        if (errorNode) {
          return this.error(new Error("You can't use a top-level await on $script as it will never resolve."));
        }
      }
    };
  });
}

function templatePlugin(config, registry) {
  if (Array.isArray(config.globals)) {
    config.globals = Object.fromEntries(config.globals.map((i) => [hash(i), i]));
    logger.warn("The `globals` array option is deprecated, please convert to an object.");
  }
  const imports = ["useScript", "defineNuxtPlugin"];
  const inits = [];
  for (const [k, c] of Object.entries(config.registry || {})) {
    const importDefinition = registry.find((i) => i.import.name === `useScript${k.substring(0, 1).toUpperCase() + k.substring(1)}`);
    if (importDefinition) {
      imports.unshift(importDefinition.import.name);
      const args = (typeof c !== "object" ? {} : c) || {};
      if (c === "mock")
        args.scriptOptions = { trigger: "manual", skipValidation: true };
      inits.push(`const ${k} = ${importDefinition.import.name}(${JSON.stringify(args)})`);
    }
  }
  for (const [k, c] of Object.entries(config.globals || {})) {
    if (typeof c === "string") {
      inits.push(`const ${k} = useScript(${JSON.stringify({ src: c, key: k })}, { use: () => ({ ${k}: window.${k} }) })`);
    } else if (Array.isArray(c) && c.length === 2) {
      inits.push(`const ${k} = useScript(${JSON.stringify({ key: k, ...typeof c[0] === "string" ? { src: c[0] } : c[0] })}, { ...${JSON.stringify(c[1])}, use: () => ({ ${k}: window.${k} }) })`);
    } else {
      inits.push(`const ${k} = useScript(${JSON.stringify({ key: k, ...c })}, { use: () => ({ ${k}: window.${k} }) })`);
    }
  }
  return [
    `import { ${imports.join(", ")} } from '#imports'`,
    "",
    `export default defineNuxtPlugin({`,
    `  name: "scripts:init",`,
    `  env: { islands: false },`,
    `  parallel: true,`,
    `  setup() {`,
    ...inits.map((i) => `    ${i}`),
    `    return { provide: { $scripts: { ${[...Object.keys(config.globals || {}), ...Object.keys(config.registry || {})].join(", ")} } } }`,
    `  }`,
    `})`
  ].join("\n");
}

const module = defineNuxtModule({
  meta: {
    name: "@nuxt/scripts",
    configKey: "scripts",
    compatibility: {
      nuxt: ">=3",
      bridge: false
    }
  },
  defaults: {
    defaultScriptOptions: {
      trigger: "onNuxtReady"
    },
    enabled: true,
    debug: false
  },
  async setup(config, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const { version, name } = await readPackageJSON(resolve("../package.json"));
    if (!config.enabled) {
      logger.debug("The module is disabled, skipping setup.");
      return;
    }
    const unheadPath = await resolvePath("@unhead/vue").catch(() => void 0);
    if (unheadPath) {
      const { version: unheadVersion } = await readPackageJSON(join(unheadPath, "package.json"));
      if (!unheadVersion || lt(unheadVersion, "1.9.0")) {
        logger.warn("@nuxt/scripts requires @unhead/vue >= 1.9.0, please upgrade to use the module.");
        return;
      }
    }
    nuxt.options.alias["#nuxt-scripts-validator"] = resolve(`./runtime/validation/${nuxt.options.dev || nuxt.options._prepare ? "valibot" : "mock"}`);
    nuxt.options.alias["#nuxt-scripts"] = resolve("./runtime/types");
    nuxt.options.alias["#nuxt-scripts-utils"] = resolve("./runtime/utils");
    nuxt.options.runtimeConfig["nuxt-scripts"] = { version };
    nuxt.options.runtimeConfig.public["nuxt-scripts"] = {
      // expose for devtools
      version: nuxt.options.dev ? version : void 0,
      defaultScriptOptions: config.defaultScriptOptions
    };
    addImportsDir([
      resolve("./runtime/composables"),
      // auto-imports aren't working without this for some reason
      // TODO find solution as we're double-registering
      resolve("./runtime/registry")
    ]);
    addComponentsDir({
      path: resolve("./runtime/components")
    });
    const scripts = registry(resolve);
    nuxt.hooks.hook("modules:done", async () => {
      const registryScripts = [...scripts];
      await nuxt.hooks.callHook("scripts:registry", registryScripts);
      const registryScriptsWithImport = registryScripts.filter((i) => !!i.import?.name);
      addImports(registryScriptsWithImport.map((i) => {
        return {
          priority: -1,
          ...i.import
        };
      }));
      const newScripts = registryScriptsWithImport.filter((i) => !scripts.some((r) => r.import?.name === i.import.name));
      extendTypes(name, async ({ typesPath }) => {
        let types = `
declare module '#app' {
  interface NuxtApp {
    $scripts: Record<${[...Object.keys(config.globals || {}), ...Object.keys(config.registry || {})].map((k) => `'${k}'`).concat(["string"]).join(" | ")}, Pick<(import('#nuxt-scripts').NuxtAppScript), '$script'> & Record<string, any>>
    _scripts: Record<string, (import('#nuxt-scripts').NuxtAppScript)>
  }
  interface RuntimeNuxtHooks {
    'scripts:updated': (ctx: { scripts: Record<string, (import('#nuxt-scripts').NuxtAppScript)> }) => void | Promise<void>
  }
}
`;
        if (newScripts.length) {
          types = `${types}
declare module '#nuxt-scripts' {
    type NuxtUseScriptOptions = Omit<import('${typesPath}').NuxtUseScriptOptions, 'use' | 'beforeInit'>
    interface ScriptRegistry {
${newScripts.map((i) => {
            const key = i.import?.name.replace("useScript", "");
            const keyLcFirst = key.substring(0, 1).toLowerCase() + key.substring(1);
            return `        ${keyLcFirst}?: import('${i.import?.from}').${key}Input | [import('${i.import?.from}').${key}Input, NuxtUseScriptOptions]`;
          }).join("\n")}
    }
}`;
          return types;
        }
        return types;
      });
      if (Object.keys(config.globals || {}).length || Object.keys(config.registry || {}).length) {
        addPluginTemplate({
          filename: `modules/${name.replace("/", "-")}.mjs`,
          getContents() {
            return templatePlugin(config, registryScriptsWithImport);
          }
        });
      }
      const scriptMap = /* @__PURE__ */ new Map();
      const { normalizeScriptData } = setupPublicAssetStrategy(config.assets);
      const moduleInstallPromises = /* @__PURE__ */ new Map();
      addBuildPlugin(NuxtScriptsCheckScripts(), {
        dev: true
      });
      addBuildPlugin(NuxtScriptBundleTransformer({
        scripts: registryScriptsWithImport,
        defaultBundle: config.defaultScriptOptions?.bundle,
        moduleDetected(module) {
          if (nuxt.options.dev && module !== "@nuxt/scripts" && !moduleInstallPromises.has(module) && !hasNuxtModule(module))
            moduleInstallPromises.set(module, () => installNuxtModule(module));
        },
        resolveScript(src) {
          if (scriptMap.has(src))
            return scriptMap.get(src);
          const url = normalizeScriptData(src);
          scriptMap.set(src, url);
          return url;
        }
      }));
      nuxt.hooks.hook("build:done", async () => {
        const initPromise = Array.from(moduleInstallPromises.values());
        for (const p of initPromise)
          await p?.();
      });
    });
    if (nuxt.options.dev)
      setupDevToolsUI(config, resolve);
  }
});

export { module as default };
