import * as _nuxt_schema from '@nuxt/schema';
import { N as NuxtConfigScriptRegistry, a as NuxtUseScriptOptionsSerializable, b as NuxtUseScriptInput, R as RegistryScripts } from './shared/scripts.cb83ebb8.js';
import '@unhead/schema';
import '@unhead/vue';
import 'unimport';
import 'valibot';
import '#nuxt-scripts';
import '#nuxt-scripts-validator';
import '@vimeo/player';
import 'third-party-capital';

interface ModuleOptions {
    /**
     * The registry of supported third-party scripts. Loads the scripts in globally using the default script options.
     */
    registry?: NuxtConfigScriptRegistry;
    /**
     * Default options for scripts.
     */
    defaultScriptOptions?: NuxtUseScriptOptionsSerializable;
    /**
     * Register scripts that should be loaded globally on all pages.
     */
    globals?: Record<string, NuxtUseScriptInput | [NuxtUseScriptInput, NuxtUseScriptOptionsSerializable]>;
    /** Configure the way scripts assets are exposed */
    assets?: {
        /**
         * The baseURL where scripts files are served.
         * @default '/_scripts/'
         */
        prefix?: string;
        /**
         * Scripts assets are exposed as public assets as part of the build.
         *
         * TODO Make configurable in future.
         */
        strategy?: 'public';
    };
    /**
     * Whether the module is enabled.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Enables debug mode.
     *
     * @false false
     */
    debug: boolean;
}
interface ModuleHooks {
    /**
     * Transform a script before it's registered.
     */
    'scripts:registry': (registry: RegistryScripts) => void | Promise<void>;
}
declare module '@nuxt/schema' {
    interface NuxtHooks {
        'scripts:registry': ModuleHooks['scripts:registry'];
    }
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { type ModuleHooks, type ModuleOptions, _default as default };
