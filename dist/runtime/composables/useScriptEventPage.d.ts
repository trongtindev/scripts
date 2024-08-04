import type { TrackedPage } from '#nuxt-scripts';
export declare function useScriptEventPage(onChange?: (payload: TrackedPage) => void): import("vue").Ref<{
    title?: string;
    path: string;
}>;
