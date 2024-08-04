import { withBase, withHttps } from "ufo";
import { useRegistryScript } from "../utils.js";
import { boolean, object, optional, string } from "#nuxt-scripts-validator";
export const MatomoAnalyticsOptions = object({
  matomoUrl: string(),
  // site is required
  siteId: string(),
  trackPageView: optional(boolean()),
  enableLinkTracking: optional(boolean())
});
export function useScriptMatomoAnalytics(_options) {
  return useRegistryScript("matomoAnalytics", (options) => ({
    scriptInput: {
      src: withBase(`/matomo.js`, withHttps(options?.matomoUrl)),
      crossorigin: false
    },
    schema: import.meta.dev ? MatomoAnalyticsOptions : void 0,
    scriptOptions: {
      use() {
        return { _paq: window._paq };
      },
      // allow _paq to be accessed on the server
      stub: import.meta.client ? void 0 : ({ fn }) => {
        return fn === "_paq" ? [] : void 0;
      }
    },
    clientInit: import.meta.server ? void 0 : () => {
      const _paq = window._paq = window._paq || [];
      options?.trackPageView !== false && _paq.push(["trackPageView"]);
      options?.enableLinkTracking !== false && _paq.push(["enableLinkTracking"]);
      _paq.push(["setTrackerUrl", withBase(`/matomo.php`, withHttps(options?.matomoUrl))]);
      _paq.push(["setSiteId", options?.siteId || "1"]);
    }
  }), _options);
}
