import { withQuery } from "ufo";
import { useRegistryScript } from "#nuxt-scripts-utils";
import { object, string, optional } from "#nuxt-scripts-validator";
export const GoogleAnalyticsOptions = object({
  id: string(),
  l: optional(string())
});
function use(options) {
  const gtag = function(...args) {
    window["gtag-" + (options.l ?? "dataLayer")](...args);
  };
  return {
    dataLayer: window[options.l ?? "dataLayer"],
    gtag
  };
}
export function useScriptGoogleAnalytics(_options) {
  return useRegistryScript(_options?.key || "googleAnalytics", (options) => ({
    scriptInput: {
      src: withQuery("https://www.googletagmanager.com/gtag/js", { id: options?.id, l: options?.l })
    },
    schema: import.meta.dev ? GoogleAnalyticsOptions : void 0,
    scriptOptions: {
      use: () => use(options),
      stub: import.meta.client ? void 0 : ({ fn }) => {
        return fn === "dataLayer" ? [] : void 0;
      },
      performanceMarkFeature: "nuxt-third-parties-ga",
      ...{ tagPriority: 1 }
    },
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line
    clientInit: import.meta.server ? void 0 : () => {
      window[options?.l ?? "dataLayer"] = window[options?.l ?? "dataLayer"] || [];
      window["gtag-" + (options?.l ?? "dataLayer")] = function() {
        window[options?.l ?? "dataLayer"].push(arguments);
      };
      window["gtag-" + (options?.l ?? "dataLayer")]("js", /* @__PURE__ */ new Date());
      window["gtag-" + (options?.l ?? "dataLayer")]("config", options?.id);
    }
  }), _options);
}
