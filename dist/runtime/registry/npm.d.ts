import type { RegistryScriptInput } from '#nuxt-scripts';
export declare const NpmOptions: import("valibot").ObjectSchema<{
    readonly packageName: import("valibot").StringSchema<undefined>;
    readonly file: import("valibot").OptionalSchema<import("valibot").StringSchema<undefined>, never>;
    readonly version: import("valibot").OptionalSchema<import("valibot").StringSchema<undefined>, never>;
    readonly type: import("valibot").OptionalSchema<import("valibot").StringSchema<undefined>, never>;
}, undefined>;
export type NpmInput = RegistryScriptInput<typeof NpmOptions, true, true, false>;
export declare function useScriptNpm<T extends Record<string | symbol, any>>(_options: NpmInput): T & {
    $script: Promise<T> & import("@unhead/vue").VueScriptInstance<T>;
};
