import type { RegistryScriptInput } from '#nuxt-scripts';
export declare const StripeOptions: import("valibot").ObjectSchema<{
    readonly advancedFraudSignals: import("valibot").OptionalSchema<import("valibot").BooleanSchema<undefined>, never>;
}, undefined>;
export type StripeInput = RegistryScriptInput<typeof StripeOptions, false>;
export interface StripeApi {
    Stripe: stripe.StripeStatic;
}
declare global {
    interface Window extends StripeApi {
    }
}
export declare function useScriptStripe<T extends StripeApi>(_options?: StripeInput): T & {
    $script: Promise<T> & import("@unhead/vue").VueScriptInstance<T>;
};
