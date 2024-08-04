import type { RegistryScriptInput } from '#nuxt-scripts';
export declare const MatomoAnalyticsOptions: import("valibot").ObjectSchema<{
    readonly matomoUrl: import("valibot").StringSchema<undefined>;
    readonly siteId: import("valibot").StringSchema<undefined>;
    readonly trackPageView: import("valibot").OptionalSchema<import("valibot").BooleanSchema<undefined>, never>;
    readonly enableLinkTracking: import("valibot").OptionalSchema<import("valibot").BooleanSchema<undefined>, never>;
}, undefined>;
export type MatomoAnalyticsInput = RegistryScriptInput<typeof MatomoAnalyticsOptions, false, false, false>;
interface MatomoAnalyticsApi {
    _paq: unknown[];
}
declare global {
    interface Window extends MatomoAnalyticsApi {
    }
}
export declare function useScriptMatomoAnalytics<T extends MatomoAnalyticsApi>(_options?: MatomoAnalyticsInput): T & {
    $script: Promise<T> & import("@unhead/vue").VueScriptInstance<T>;
};
export {};
