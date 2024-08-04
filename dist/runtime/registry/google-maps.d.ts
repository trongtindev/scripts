import type { RegistryScriptInput } from '#nuxt-scripts';
declare namespace google {
    namespace maps {
        /**
         * @internal
         */
        function __ib__(): void;
    }
}
export declare const GoogleMapsOptions: import("valibot").ObjectSchema<{
    readonly apiKey: import("valibot").StringSchema<undefined>;
    readonly libraries: import("valibot").OptionalSchema<import("valibot").ArraySchema<import("valibot").StringSchema<undefined>, undefined>, never>;
    readonly v: import("valibot").OptionalSchema<import("valibot").UnionSchema<[import("valibot").LiteralSchema<"weekly", undefined>, import("valibot").LiteralSchema<"beta", undefined>, import("valibot").LiteralSchema<"alpha", undefined>], undefined>, never>;
}, undefined>;
export type GoogleMapsInput = RegistryScriptInput<typeof GoogleMapsOptions>;
type MapsNamespace = typeof google.maps;
export interface GoogleMapsApi {
    maps: MapsNamespace | Promise<MapsNamespace>;
}
declare global {
    interface Window {
        google: {
            maps: MapsNamespace;
        };
    }
}
export declare function useScriptGoogleMaps<T extends GoogleMapsApi>(_options?: GoogleMapsInput): T & {
    $script: Promise<T> & import("@unhead/vue").VueScriptInstance<T>;
};
export {};
