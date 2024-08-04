import type { RegistryScriptInput } from '#nuxt-scripts';
type StandardEvents = 'AddPaymentInfo' | 'AddToCart' | 'AddToWishlist' | 'CompleteRegistration' | 'Contact' | 'CustomizeProduct' | 'Donate' | 'FindLocation' | 'InitiateCheckout' | 'Lead' | 'Purchase' | 'Schedule' | 'Search' | 'StartTrial' | 'SubmitApplication' | 'Subscribe' | 'ViewContent';
interface EventObjectProperties {
    content_category?: string;
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
    contents: {
        id: string;
        quantity: number;
    }[];
    currency?: string;
    delivery_category?: 'in_store' | 'curbside' | 'home_delivery';
    num_items?: number;
    predicted_ltv?: number;
    search_string?: string;
    status?: 'completed' | 'updated' | 'viewed' | 'added_to_cart' | 'removed_from_cart' | string;
    value?: number;
    [key: string]: any;
}
type FbqFns = ((event: 'track', eventName: StandardEvents, data?: EventObjectProperties) => void) & ((event: 'trackCustom', eventName: string, data?: EventObjectProperties) => void) & ((event: 'init', id: number, data?: Record<string, any>) => void) & ((event: 'init', id: string) => void) & ((event: string, ...params: any[]) => void);
export interface MetaPixelApi {
    fbq: FbqFns & {
        push: FbqFns;
        loaded: boolean;
        version: string;
        queue: any[];
    };
    _fbq: MetaPixelApi['fbq'];
}
declare global {
    interface Window extends MetaPixelApi {
    }
}
export declare const MetaPixelOptions: import("valibot").ObjectSchema<{
    readonly id: import("valibot").UnionSchema<[import("valibot").StringSchema<undefined>, import("valibot").NumberSchema<undefined>], undefined>;
}, undefined>;
export type MetaPixelInput = RegistryScriptInput<typeof MetaPixelOptions, true, false, false>;
export declare function useScriptMetaPixel<T extends MetaPixelApi>(_options?: MetaPixelInput): T & {
    $script: Promise<T> & import("@unhead/vue").VueScriptInstance<T>;
};
export {};
