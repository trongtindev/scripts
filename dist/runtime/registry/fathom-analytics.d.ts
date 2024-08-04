import type { RegistryScriptInput } from '#nuxt-scripts';
export declare const FathomAnalyticsOptions: import("valibot").ObjectSchema<{
    /**
     * The Fathom Analytics site ID.
     */
    readonly site: import("valibot").StringSchema<undefined>;
    /**
     * The Fathom Analytics tracking mode.
     */
    readonly spa: import("valibot").OptionalSchema<import("valibot").UnionSchema<[import("valibot").LiteralSchema<"auto", undefined>, import("valibot").LiteralSchema<"history", undefined>, import("valibot").LiteralSchema<"hash", undefined>], undefined>, never>;
    /**
     * Automatically track page views.
     */
    readonly auto: import("valibot").OptionalSchema<import("valibot").BooleanSchema<undefined>, never>;
    /**
     * Enable canonical URL tracking.
     */
    readonly canonical: import("valibot").OptionalSchema<import("valibot").BooleanSchema<undefined>, never>;
    /**
     * Honor Do Not Track requests.
     */
    readonly honorDnt: import("valibot").OptionalSchema<import("valibot").BooleanSchema<undefined>, never>;
}, undefined>;
export type FathomAnalyticsInput = RegistryScriptInput<typeof FathomAnalyticsOptions, false, false, false>;
export interface FathomAnalyticsApi {
    beacon: (ctx: {
        url: string;
        referrer?: string;
    }) => void;
    blockTrackingForMe: () => void;
    enableTrackingForMe: () => void;
    isTrackingEnabled: () => boolean;
    send: (type: string, data: unknown) => void;
    setSite: (siteId: string) => void;
    sideId: string;
    trackPageview: (ctx?: {
        url: string;
        referrer?: string;
    }) => void;
    trackGoal: (goalId: string, cents: number) => void;
    trackEvent: (eventName: string, value: {
        _value: number;
    }) => void;
}
declare global {
    interface Window {
        fathom: FathomAnalyticsApi;
    }
}
export declare function useScriptFathomAnalytics<T extends FathomAnalyticsApi>(_options?: FathomAnalyticsInput): T & {
    $script: Promise<T> & import("@unhead/vue").VueScriptInstance<T>;
};
