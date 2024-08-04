import type { RegistryScriptInput } from '#nuxt-scripts';
export interface YouTubePlayerApi {
    YT: typeof YT & {
        ready: (fn: () => void) => void;
    };
}
declare global {
    interface Window extends YouTubePlayerApi {
        onYouTubeIframeAPIReady: () => void;
    }
}
export type YouTubePlayerInput = RegistryScriptInput;
export declare function useScriptYouTubePlayer<T extends YouTubePlayerApi>(_options: YouTubePlayerInput): T & {
    $script: Promise<T> & import("@unhead/vue").VueScriptInstance<T>;
};
