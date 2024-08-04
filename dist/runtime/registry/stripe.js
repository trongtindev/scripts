import { withQuery } from "ufo";
import { useRegistryScript } from "../utils.js";
import { boolean, object, optional } from "#nuxt-scripts-validator";
export const StripeOptions = object({
  advancedFraudSignals: optional(boolean())
});
export function useScriptStripe(_options) {
  return useRegistryScript("stripe", (options) => ({
    scriptInput: {
      src: withQuery(
        `https://js.stripe.com/v3/`,
        typeof options?.advancedFraudSignals === "boolean" && !options?.advancedFraudSignals ? { advancedFraudSignals: false } : {}
      ),
      // opt-out of privacy defaults
      crossorigin: false,
      referrerpolicy: false
    },
    schema: import.meta.dev ? StripeOptions : void 0,
    scriptOptions: {
      use() {
        return { Stripe: window.Stripe };
      }
    }
  }), _options);
}
