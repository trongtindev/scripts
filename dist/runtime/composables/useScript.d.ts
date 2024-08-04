import type { UseScriptInput, VueScriptInstance } from '@unhead/vue';
import type { NuxtUseScriptOptions } from '#nuxt-scripts';
export declare function useScript<T extends Record<string | symbol, any>>(input: UseScriptInput, options?: NuxtUseScriptOptions): T & {
    $script: Promise<T> & VueScriptInstance<T>;
};
