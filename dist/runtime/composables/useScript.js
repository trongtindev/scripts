import { hashCode } from "@unhead/shared";
import { defu } from "defu";
import { useScript as _useScript } from "@unhead/vue";
import { injectHead, onNuxtReady, useNuxtApp, useRuntimeConfig, reactive } from "#imports";
function useNuxtScriptRuntimeConfig() {
  return useRuntimeConfig().public["nuxt-scripts"];
}
export function useScript(input, options) {
  input = typeof input === "string" ? { src: input } : input;
  options = defu(options, useNuxtScriptRuntimeConfig()?.defaultScriptOptions);
  if (options.trigger === "onNuxtReady")
    options.trigger = onNuxtReady;
  const nuxtApp = useNuxtApp();
  const id = input.key || input.src || hashCode(typeof input.innerHTML === "string" ? input.innerHTML : "");
  nuxtApp.$scripts = nuxtApp.$scripts || reactive({});
  if (nuxtApp.$scripts[id]) {
    return nuxtApp.$scripts[id];
  }
  if (import.meta.client) {
    if (!nuxtApp._scripts?.[id]) {
      performance?.mark?.("mark_feature_usage", {
        detail: {
          feature: options.performanceMarkFeature ?? `nuxt-scripts:${id}`
        }
      });
    }
  }
  const instance = _useScript(input, options);
  nuxtApp.$scripts[id] = instance;
  if (import.meta.dev && import.meta.client) {
    let syncScripts = function() {
      nuxtApp._scripts[instance.$script.id] = payload;
      nuxtApp.hooks.callHook("scripts:updated", { scripts: nuxtApp._scripts });
    };
    const payload = {
      ...options.devtools,
      src: input.src,
      $script: null,
      events: []
    };
    nuxtApp._scripts = nuxtApp._scripts || {};
    if (!nuxtApp._scripts[instance.$script.id]) {
      const head = injectHead();
      head.hooks.hook("script:updated", (ctx) => {
        if (ctx.script.id !== instance.$script.id)
          return;
        payload.events.push({
          type: "status",
          status: ctx.script.status,
          at: Date.now()
        });
        payload.$script = instance.$script;
        syncScripts();
      });
      head.hooks.hook("script:instance-fn", (ctx) => {
        if (ctx.script.id !== instance.$script.id || String(ctx.fn).startsWith("__v_"))
          return;
        payload.events.push({
          type: "fn-call",
          fn: ctx.fn,
          at: Date.now()
        });
        syncScripts();
      });
      payload.$script = instance.$script;
      payload.events.push({
        type: "status",
        status: "awaitingLoad",
        trigger: options?.trigger,
        at: Date.now()
      });
      syncScripts();
    }
  }
  return instance;
}
