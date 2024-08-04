import { R as RegistryScripts } from './shared/scripts.cb83ebb8.js';
import '@unhead/schema';
import '@unhead/vue';
import 'unimport';
import 'valibot';
import '#nuxt-scripts';
import '#nuxt-scripts-validator';
import '@vimeo/player';
import 'third-party-capital';

declare const registry: (resolve?: (s: string) => string) => RegistryScripts;

export { registry };
