import type { InferInput, ObjectSchema } from 'valibot';
import type { UseScriptInput, VueScriptInstance } from '@unhead/vue';
import type { EmptyOptionsSchema, NuxtUseScriptOptions, RegistryScriptInput, ScriptRegistry } from '#nuxt-scripts';
type OptionsFn<O extends ObjectSchema<any, any>> = (options: InferInput<O>) => ({
    scriptInput?: UseScriptInput;
    scriptOptions?: NuxtUseScriptOptions;
    schema?: O;
    clientInit?: () => void;
});
export declare function scriptRuntimeConfig<T extends keyof ScriptRegistry>(key: T): ScriptRegistry[T];
export declare function useRegistryScript<T extends Record<string | symbol, any>, O extends ObjectSchema<any, any> = EmptyOptionsSchema>(registryKey: keyof ScriptRegistry | string, optionsFn: OptionsFn<O>, _userOptions?: RegistryScriptInput<O>): T & {
    $script: Promise<T> & VueScriptInstance<T>;
};
export {};
