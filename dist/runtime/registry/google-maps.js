import { withQuery } from "ufo";
import { useRegistryScript } from "../utils.js";
import { array, literal, object, optional, string, union } from "#nuxt-scripts-validator";
export const GoogleMapsOptions = object({
  apiKey: string(),
  libraries: optional(array(string())),
  v: optional(union([literal("weekly"), literal("beta"), literal("alpha")]))
});
export function useScriptGoogleMaps(_options) {
  let readyPromise = Promise.resolve();
  return useRegistryScript("googleMaps", (options) => {
    const libraries = options?.libraries || ["places"];
    return {
      scriptInput: {
        src: withQuery(`https://maps.googleapis.com/maps/api/js`, {
          libraries: libraries.join(","),
          key: options?.apiKey,
          loading: "async",
          callback: "google.maps.__ib__"
        })
      },
      clientInit: import.meta.server ? void 0 : () => {
        window.google = window.google || {};
        window.google.maps = window.google.maps || {};
        readyPromise = new Promise((resolve) => {
          window.google.maps.__ib__ = resolve;
        });
      },
      schema: import.meta.dev ? GoogleMapsOptions : void 0,
      scriptOptions: {
        use() {
          return {
            maps: readyPromise.then(() => {
              return window.google.maps;
            })
          };
        }
      }
    };
  }, _options);
}
