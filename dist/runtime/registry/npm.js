import { withBase } from "ufo";
import { useRegistryScript } from "../utils.js";
import { object, optional, string } from "#nuxt-scripts-validator";
export const NpmOptions = object({
  packageName: string(),
  file: optional(string()),
  version: optional(string()),
  type: optional(string())
});
export function useScriptNpm(_options) {
  return useRegistryScript(`${_options.packageName}-npm`, (options) => ({
    scriptInput: {
      src: withBase(options.file || "", `https://unpkg.com/${options?.packageName}@${options.version || "latest"}`)
    },
    schema: import.meta.dev ? NpmOptions : void 0
  }), _options);
}
