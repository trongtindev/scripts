import type { DataLayer, GTag } from 'third-party-capital';
import type { RegistryScriptInput } from '#nuxt-scripts';
export declare const GoogleAnalyticsOptions: import("valibot").ObjectSchema<{
    readonly id: import("valibot").StringSchema<undefined>;
    readonly l: import("valibot").OptionalSchema<import("valibot").StringSchema<undefined>, never>;
}, undefined>;
export type GoogleAnalyticsInput = RegistryScriptInput<typeof GoogleAnalyticsOptions>;
export declare function useScriptGoogleAnalytics(_options?: GoogleAnalyticsInput): {
    dataLayer: DataLayer;
    gtag: GTag;
} & {
    $script: Promise<{
        dataLayer: DataLayer;
        gtag: GTag;
    }> & import("@unhead/vue").VueScriptInstance<{
        dataLayer: DataLayer;
        gtag: GTag;
    }>;
};
