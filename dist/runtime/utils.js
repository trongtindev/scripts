import { defu } from "defu";
import { useScript } from "./composables/useScript.js";
import { parse } from "#nuxt-scripts-validator";
import { useRuntimeConfig } from "#imports";
function validateScriptInputSchema(key, schema, options) {
  if (import.meta.dev) {
    try {
      parse(schema, options);
    } catch (_e) {
      const e = _e;
      console.error(e.issues.map((i) => `${key}.${i.path?.map((i2) => i2.key).join(",")}: ${i.message}`).join("\n"));
    }
  }
}
export function scriptRuntimeConfig(key) {
  return (useRuntimeConfig().public.scripts || {})[key];
}
export function useRegistryScript(registryKey, optionsFn, _userOptions) {
  const scriptConfig = scriptRuntimeConfig(registryKey);
  const userOptions = Object.assign(_userOptions || {}, typeof scriptConfig === "object" ? scriptConfig : {});
  const options = optionsFn(userOptions);
  const scriptInput = defu(userOptions.scriptInput, options.scriptInput, { key: registryKey });
  const scriptOptions = Object.assign(userOptions?.scriptOptions || {}, options.scriptOptions || {});
  if (import.meta.dev) {
    scriptOptions.devtools = defu(scriptOptions.devtools, { registryKey });
    if (options.schema) {
      const registryMeta = {};
      for (const k in options.schema.entries) {
        if (options.schema.entries[k].type !== "optional") {
          registryMeta[k] = String(userOptions[k]);
        }
      }
      scriptOptions.devtools.registryMeta = registryMeta;
    }
  }
  const init = scriptOptions.beforeInit;
  scriptOptions.beforeInit = () => {
    if (import.meta.dev && !scriptOptions.skipValidation && options.schema) {
      if (!userOptions.scriptInput?.src) {
        validateScriptInputSchema(registryKey, options.schema, userOptions);
      }
    }
    init?.();
    if (import.meta.client) {
      options.clientInit?.();
    }
  };
  return useScript(scriptInput, scriptOptions);
}
