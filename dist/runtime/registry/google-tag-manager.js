import { withQuery } from "ufo";
import { useRegistryScript } from "#nuxt-scripts-utils";
import { object, string, optional } from "#nuxt-scripts-validator";
export const GoogleTagManagerOptions = object({
  id: string(),
  l: optional(string())
});
function use(options) {
  return { dataLayer: window[options.l ?? "dataLayer"], google_tag_manager: window.google_tag_manager };
}
export function useScriptGoogleTagManager(_options) {
  return useRegistryScript(_options?.key || "googleTagManager", (options) => ({
    scriptInput: {
      src: withQuery("https://www.googletagmanager.com/gtm.js", { id: options?.id, l: options?.l })
    },
    schema: import.meta.dev ? GoogleTagManagerOptions : void 0,
    scriptOptions: {
      use: () => use(options),
      stub: import.meta.client ? void 0 : ({ fn }) => {
        return fn === "dataLayer" ? [] : void 0;
      },
      performanceMarkFeature: "nuxt-third-parties-gtm",
      ...{ tagPriority: 1 }
    },
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    clientInit: import.meta.server ? void 0 : () => {
      window[options?.l ?? "dataLayer"] = window[options?.l ?? "dataLayer"] || [];
      window[options?.l ?? "dataLayer"].push({ "gtm.start": (/* @__PURE__ */ new Date()).getTime(), event: "gtm.js" });
    }
  }), _options);
}
