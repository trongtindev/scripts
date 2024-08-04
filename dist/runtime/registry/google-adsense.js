import { optional } from "valibot";
import { useRegistryScript } from "../utils.js";
import { object, string } from "#nuxt-scripts-validator";
import { useHead } from "#imports";
export const GoogleAdsenseOptions = object({
  /**
   * The Google Adsense ID.
   */
  client: optional(string())
});
export function useScriptGoogleAdsense(_options) {
  return useRegistryScript("googleAdsense", (options) => ({
    scriptInput: {
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    },
    schema: import.meta.dev ? GoogleAdsenseOptions : void 0,
    scriptOptions: {
      use() {
        return { adsbygoogle: window.adsbygoogle };
      },
      // allow dataLayer to be accessed on the server
      stub: import.meta.client ? void 0 : ({ fn }) => {
        return fn === "adsbygoogle" ? [] : void 0;
      },
      beforeInit() {
        useHead({
          meta: [
            {
              name: "google-adsense-account",
              content: options?.client
            }
          ]
        });
      }
    }
  }), _options);
}
