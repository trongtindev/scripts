import type { GoogleTagManagerApi, DataLayer } from 'third-party-capital';
import type { RegistryScriptInput } from '#nuxt-scripts';
declare global {
    interface Window extends GoogleTagManagerApi {
    }
}
export declare const GoogleTagManagerOptions: import("valibot").ObjectSchema<{
    readonly id: import("valibot").StringSchema<undefined>;
    readonly l: import("valibot").OptionalSchema<import("valibot").StringSchema<undefined>, never>;
}, undefined>;
export type GoogleTagManagerInput = RegistryScriptInput<typeof GoogleTagManagerOptions>;
export declare function useScriptGoogleTagManager(_options?: GoogleTagManagerInput): {
    dataLayer: DataLayer;
    google_tag_manager: import("third-party-capital").GoogleTagManagerInstance;
} & {
    $script: Promise<{
        dataLayer: DataLayer;
        google_tag_manager: import("third-party-capital").GoogleTagManagerInstance;
    }> & import("@unhead/vue").VueScriptInstance<{
        dataLayer: DataLayer;
        google_tag_manager: import("third-party-capital").GoogleTagManagerInstance;
    }>;
};
