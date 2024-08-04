import { UseScriptOptions } from '@unhead/schema';
import { UseScriptInput } from '@unhead/vue';
import { Import } from 'unimport';
import * as valibot from 'valibot';
import { RegistryScriptInput } from '#nuxt-scripts';
import { InferInput } from '#nuxt-scripts-validator';
import Vimeo from '@vimeo/player';
import { GoogleTagManagerApi } from 'third-party-capital';

declare const SegmentOptions: valibot.ObjectSchema<{
    readonly writeKey: valibot.StringSchema<undefined>;
    readonly analyticsKey: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
}, undefined>;
type SegmentInput = RegistryScriptInput<typeof SegmentOptions>;
interface AnalyticsApi {
    track: (event: string, properties?: Record<string, any>) => void;
    page: (name?: string, properties?: Record<string, any>) => void;
    identify: (userId: string, traits?: Record<string, any>, options?: Record<string, any>) => void;
    group: (groupId: string, traits?: Record<string, any>, options?: Record<string, any>) => void;
    alias: (userId: string, previousId: string, options?: Record<string, any>) => void;
    reset: () => void;
    /**
     * @internal
     */
    methods: string[];
    /**
     * @internal
     */
    factory: (method: string) => (...args: any[]) => AnalyticsApi;
    /**
     * @internal
     */
    push: (args: any[]) => void;
}
interface SegmentApi extends Pick<AnalyticsApi, 'track' | 'page' | 'identify' | 'group' | 'alias' | 'reset'> {
}
declare global {
    interface Window extends SegmentApi {
    }
}

/**
 * Sample:
 * <!-- Cloudflare Web Analytics -->
 * <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "12ee46bf598b45c2868bbc07a3073f58"}'></script>
 * <!-- End Cloudflare Web Analytics -->
 */
interface CloudflareWebAnalyticsApi {
    __cfBeacon: {
        load: 'single';
        spa: boolean;
        token: string;
    };
}
declare global {
    interface Window extends CloudflareWebAnalyticsApi {
    }
}
declare const CloudflareWebAnalyticsOptions: valibot.ObjectSchema<{
    /**
     * The Cloudflare Web Analytics token.
     */
    readonly token: valibot.SchemaWithPipe<[valibot.StringSchema<undefined>, valibot.MinLengthAction<string, 32, undefined>]>;
    /**
     * Cloudflare Web Analytics enables measuring SPAs automatically by overriding the History API’s pushState function
     * and listening to the onpopstate. Hash-based router is not supported.
     *
     * @default true
     */
    readonly spa: valibot.OptionalSchema<valibot.BooleanSchema<undefined>, never>;
}, undefined>;
type CloudflareWebAnalyticsInput = RegistryScriptInput<typeof CloudflareWebAnalyticsOptions>;

type StandardEvents = 'AddPaymentInfo' | 'AddToCart' | 'AddToWishlist' | 'CompleteRegistration' | 'Contact' | 'CustomizeProduct' | 'Donate' | 'FindLocation' | 'InitiateCheckout' | 'Lead' | 'Purchase' | 'Schedule' | 'Search' | 'StartTrial' | 'SubmitApplication' | 'Subscribe' | 'ViewContent';
interface EventObjectProperties$1 {
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
type FbqFns = ((event: 'track', eventName: StandardEvents, data?: EventObjectProperties$1) => void) & ((event: 'trackCustom', eventName: string, data?: EventObjectProperties$1) => void) & ((event: 'init', id: number, data?: Record<string, any>) => void) & ((event: 'init', id: string) => void) & ((event: string, ...params: any[]) => void);
interface MetaPixelApi {
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
declare const MetaPixelOptions: valibot.ObjectSchema<{
    readonly id: valibot.UnionSchema<[valibot.StringSchema<undefined>, valibot.NumberSchema<undefined>], undefined>;
}, undefined>;
type MetaPixelInput = RegistryScriptInput<typeof MetaPixelOptions, true, false, false>;

declare const FathomAnalyticsOptions: valibot.ObjectSchema<{
    /**
     * The Fathom Analytics site ID.
     */
    readonly site: valibot.StringSchema<undefined>;
    /**
     * The Fathom Analytics tracking mode.
     */
    readonly spa: valibot.OptionalSchema<valibot.UnionSchema<[valibot.LiteralSchema<"auto", undefined>, valibot.LiteralSchema<"history", undefined>, valibot.LiteralSchema<"hash", undefined>], undefined>, never>;
    /**
     * Automatically track page views.
     */
    readonly auto: valibot.OptionalSchema<valibot.BooleanSchema<undefined>, never>;
    /**
     * Enable canonical URL tracking.
     */
    readonly canonical: valibot.OptionalSchema<valibot.BooleanSchema<undefined>, never>;
    /**
     * Honor Do Not Track requests.
     */
    readonly honorDnt: valibot.OptionalSchema<valibot.BooleanSchema<undefined>, never>;
}, undefined>;
type FathomAnalyticsInput = RegistryScriptInput<typeof FathomAnalyticsOptions, false, false, false>;
interface FathomAnalyticsApi {
    beacon: (ctx: {
        url: string;
        referrer?: string;
    }) => void;
    blockTrackingForMe: () => void;
    enableTrackingForMe: () => void;
    isTrackingEnabled: () => boolean;
    send: (type: string, data: unknown) => void;
    setSite: (siteId: string) => void;
    sideId: string;
    trackPageview: (ctx?: {
        url: string;
        referrer?: string;
    }) => void;
    trackGoal: (goalId: string, cents: number) => void;
    trackEvent: (eventName: string, value: {
        _value: number;
    }) => void;
}
declare global {
    interface Window {
        fathom: FathomAnalyticsApi;
    }
}

interface HotjarApi {
    hj: ((event: 'identify', userId: string, attributes?: Record<string, any>) => void) & ((event: 'stateChange', path: string) => void) & ((event: 'event', eventName: string) => void) & ((event: string, arg?: string) => void) & ((...params: any[]) => void) & {
        q: any[];
    };
}
declare global {
    interface Window extends HotjarApi {
        _hjSettings: {
            hjid: number;
            hjsv?: number;
        };
    }
}
declare const HotjarOptions: valibot.ObjectSchema<{
    readonly id: valibot.NumberSchema<undefined>;
    readonly sv: valibot.OptionalSchema<valibot.NumberSchema<undefined>, never>;
}, undefined>;
type HotjarInput = RegistryScriptInput<typeof HotjarOptions, true, false, false>;

declare const IntercomOptions: valibot.ObjectSchema<{
    readonly app_id: valibot.StringSchema<undefined>;
    readonly api_base: valibot.OptionalSchema<valibot.UnionSchema<[valibot.LiteralSchema<"https://api-iam.intercom.io", undefined>, valibot.LiteralSchema<"https://api-iam.eu.intercom.io", undefined>, valibot.LiteralSchema<"https://api-iam.au.intercom.io", undefined>], undefined>, never>;
    readonly name: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
    readonly email: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
    readonly user_id: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
    readonly alignment: valibot.OptionalSchema<valibot.UnionSchema<[valibot.LiteralSchema<"left", undefined>, valibot.LiteralSchema<"right", undefined>], undefined>, never>;
    readonly horizontal_padding: valibot.OptionalSchema<valibot.NumberSchema<undefined>, never>;
    readonly vertical_padding: valibot.OptionalSchema<valibot.NumberSchema<undefined>, never>;
}, undefined>;
type IntercomInput = RegistryScriptInput<typeof IntercomOptions, true, false, false>;
interface IntercomApi {
    Intercom: ((event: 'boot', data?: InferInput<typeof IntercomOptions>) => void) & ((event: 'shutdown') => void) & ((event: 'update', options?: InferInput<typeof IntercomOptions>) => void) & ((event: 'hide') => void) & ((event: 'show') => void) & ((event: 'showSpace', spaceName: 'home' | 'messages' | 'help' | 'news' | 'tasks' | 'tickets' | string) => void) & ((event: 'showMessages') => void) & ((event: 'showNewMessage', content?: string) => void) & ((event: 'onHide', fn: () => void) => void) & ((event: 'onShow', fn: () => void) => void) & ((event: 'onUnreadCountChange', fn: () => void) => void) & ((event: 'trackEvent', eventName: string, metadata?: Record<string, any>) => void) & ((event: 'getVisitorId') => Promise<string>) & ((event: 'startTour', tourId: string | number) => void) & ((event: 'showArticle', articleId: string | number) => void) & ((event: 'showNews', newsItemId: string | number) => void) & ((event: 'startSurvey', surveyId: string | number) => void) & ((event: 'startChecklist', checklistId: string | number) => void) & ((event: 'showTicket', ticketId: string | number) => void) & ((event: 'showConversation', conversationId: string | number) => void) & ((event: 'onUserEmailSupplied', fn: () => void) => void) & ((event: string, ...params: any[]) => void);
}
declare global {
    interface Window extends IntercomApi {
        intercomSettings?: any;
    }
}

declare namespace google {
    namespace maps {
        /**
         * @internal
         */
        function __ib__(): void;
    }
}
declare const GoogleMapsOptions: valibot.ObjectSchema<{
    readonly apiKey: valibot.StringSchema<undefined>;
    readonly libraries: valibot.OptionalSchema<valibot.ArraySchema<valibot.StringSchema<undefined>, undefined>, never>;
    readonly v: valibot.OptionalSchema<valibot.UnionSchema<[valibot.LiteralSchema<"weekly", undefined>, valibot.LiteralSchema<"beta", undefined>, valibot.LiteralSchema<"alpha", undefined>], undefined>, never>;
}, undefined>;
type GoogleMapsInput = RegistryScriptInput<typeof GoogleMapsOptions>;
type MapsNamespace = typeof google.maps;
declare global {
    interface Window {
        google: {
            maps: MapsNamespace;
        };
    }
}

declare const MatomoAnalyticsOptions: valibot.ObjectSchema<{
    readonly matomoUrl: valibot.StringSchema<undefined>;
    readonly siteId: valibot.StringSchema<undefined>;
    readonly trackPageView: valibot.OptionalSchema<valibot.BooleanSchema<undefined>, never>;
    readonly enableLinkTracking: valibot.OptionalSchema<valibot.BooleanSchema<undefined>, never>;
}, undefined>;
type MatomoAnalyticsInput = RegistryScriptInput<typeof MatomoAnalyticsOptions, false, false, false>;
interface MatomoAnalyticsApi {
    _paq: unknown[];
}
declare global {
    interface Window extends MatomoAnalyticsApi {
    }
}

declare const StripeOptions: valibot.ObjectSchema<{
    readonly advancedFraudSignals: valibot.OptionalSchema<valibot.BooleanSchema<undefined>, never>;
}, undefined>;
type StripeInput = RegistryScriptInput<typeof StripeOptions, false>;
interface StripeApi {
    Stripe: stripe.StripeStatic;
}
declare global {
    interface Window extends StripeApi {
    }
}

type Constructor<T extends new (...args: any) => any> = T extends new (...args: infer A) => infer R ? new (...args: A) => R : never;
interface VimeoPlayerApi {
    Vimeo: {
        Player: Constructor<typeof Vimeo>;
    };
}
type VimeoPlayerInput = RegistryScriptInput;
declare global {
    interface Window extends VimeoPlayerApi {
    }
}

interface ContentProperties {
    content_type?: string | null;
    content_id?: string | number | null;
    content_name?: string | null;
    content_price?: string | number | null;
    num_items?: string | number | null;
    content_group_id?: string | number | null;
}
interface EventObjectProperties {
    value?: string | number | null;
    currency?: string | null;
    conversion_id?: string | number | null;
    email_address?: string | null;
    phone_number?: string | null;
    contents: ContentProperties[];
}
type TwqFns = ((event: 'event', eventId: string, data?: EventObjectProperties) => void) & ((event: 'config', id: string) => void) & ((event: string, ...params: any[]) => void);
interface XPixelApi {
    twq: TwqFns & {
        loaded: boolean;
        version: string;
        queue: any[];
    };
}
declare global {
    interface Window extends XPixelApi {
    }
}
declare const XPixelOptions: valibot.ObjectSchema<{
    readonly id: valibot.StringSchema<undefined>;
    readonly version: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
}, undefined>;
type XPixelInput = RegistryScriptInput<typeof XPixelOptions, true, false, false>;

interface YouTubePlayerApi {
    YT: typeof YT & {
        ready: (fn: () => void) => void;
    };
}
declare global {
    interface Window extends YouTubePlayerApi {
        onYouTubeIframeAPIReady: () => void;
    }
}
type YouTubePlayerInput = RegistryScriptInput;

declare const PlausibleAnalyticsOptions: valibot.ObjectSchema<{
    readonly domain: valibot.StringSchema<undefined>;
    readonly extension: valibot.OptionalSchema<valibot.UnionSchema<[valibot.UnionSchema<(valibot.LiteralSchema<"hash", undefined> | valibot.LiteralSchema<"outbound-links", undefined> | valibot.LiteralSchema<"file-downloads", undefined> | valibot.LiteralSchema<"tagged-events", undefined> | valibot.LiteralSchema<"revenue", undefined> | valibot.LiteralSchema<"pageview-props", undefined> | valibot.LiteralSchema<"compat", undefined> | valibot.LiteralSchema<"local", undefined> | valibot.LiteralSchema<"manual", undefined>)[], undefined>, valibot.ArraySchema<valibot.UnionSchema<(valibot.LiteralSchema<"hash", undefined> | valibot.LiteralSchema<"outbound-links", undefined> | valibot.LiteralSchema<"file-downloads", undefined> | valibot.LiteralSchema<"tagged-events", undefined> | valibot.LiteralSchema<"revenue", undefined> | valibot.LiteralSchema<"pageview-props", undefined> | valibot.LiteralSchema<"compat", undefined> | valibot.LiteralSchema<"local", undefined> | valibot.LiteralSchema<"manual", undefined>)[], undefined>, undefined>], undefined>, never>;
}, undefined>;
type PlausibleAnalyticsInput = RegistryScriptInput<typeof PlausibleAnalyticsOptions, false>;
interface PlausibleAnalyticsApi {
    plausible: ((event: '404', options: Record<string, any>) => void) & ((event: 'event', options: Record<string, any>) => void) & ((...params: any[]) => void) & {
        q: any[];
    };
}
declare global {
    interface Window {
        plausible: PlausibleAnalyticsApi;
    }
}

declare const NpmOptions: valibot.ObjectSchema<{
    readonly packageName: valibot.StringSchema<undefined>;
    readonly file: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
    readonly version: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
    readonly type: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
}, undefined>;
type NpmInput = RegistryScriptInput<typeof NpmOptions, true, true, false>;

type LemonSqueezyInput = RegistryScriptInput;
type LemonSqueezyEventPayload = {
    event: 'Checkout.Success';
    data: Record<string, any>;
} & {
    event: 'Checkout.ViewCart';
    data: Record<string, any>;
} & {
    event: 'GA.ViewCart';
    data: Record<string, any>;
} & {
    event: 'PaymentMethodUpdate.Mounted';
} & {
    event: 'PaymentMethodUpdate.Closed';
} & {
    event: 'PaymentMethodUpdate.Updated';
} & {
    event: string;
};
interface LemonSqueezyApi {
    /**
     * Initialises Lemon.js on your page.
     * @param options - An object with a single property, eventHandler, which is a function that will be called when Lemon.js emits an event.
     */
    Setup: (options: {
        eventHandler: (event: LemonSqueezyEventPayload) => void;
    }) => void;
    /**
     * Refreshes `lemonsqueezy-button` listeners on the page.
     */
    Refresh: () => void;
    Url: {
        /**
         * Opens a given Lemon Squeezy URL, typically these are Checkout or Payment Details Update overlays.
         * @param url - The URL to open.
         */
        Open: (url: string) => void;
        /**
         * Closes the current opened Lemon Squeezy overlay checkout window.
         */
        Close: () => void;
    };
    Affiliate: {
        /**
         * Retrieve the affiliate tracking ID
         */
        GetID: () => string;
        /**
         * Append the affiliate tracking parameter to the given URL
         * @param url - The URL to append the affiliate tracking parameter to.
         */
        Build: (url: string) => string;
    };
    Loader: {
        /**
         * Show the Lemon.js loader.
         */
        Show: () => void;
        /**
         * Hide the Lemon.js loader.
         */
        Hide: () => void;
    };
}
declare global {
    interface Window {
        createLemonSqueezy: () => void;
        LemonSqueezy: LemonSqueezyApi;
    }
}

declare const GoogleAdsenseOptions: valibot.ObjectSchema<{
    /**
     * The Google Adsense ID.
     */
    readonly client: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
}, undefined>;
type GoogleAdsenseInput = RegistryScriptInput<typeof GoogleAdsenseOptions, true, false, false>;
interface GoogleAdsenseApi {
    /**
     * The Google Adsense API.
     */
    adsbygoogle: any[] & {
        loaded?: boolean;
    };
}
declare global {
    interface Window extends GoogleAdsenseApi {
    }
}

/**
 * <script type="text/javascript">
 *     (function(c,l,a,r,i,t,y){
 *         c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
 *         t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
 *         y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
 *     })(window, document, "clarity", "script", "mpy5c6k7xi");
 * </script>
 */
type ClarityFunctions = ((fn: 'start', options: {
    content: boolean;
    cookies: string[];
    dob: number;
    expire: number;
    projectId: string;
    upload: string;
}) => void) & ((fn: 'identify', id: string, session?: string, page?: string, userHint?: string) => Promise<{
    id: string;
    session: string;
    page: string;
    userHint: string;
}>) & ((fn: 'consent') => void) & ((fn: 'set', key: any, value: any) => void) & ((fn: 'event', value: any) => void) & ((fn: 'upgrade', upgradeReason: any) => void) & ((fn: string, ...args: any[]) => void);
interface ClarityApi {
    clarity: ClarityFunctions & {
        q: any[];
        v: string;
    };
}
declare global {
    interface Window extends ClarityApi {
    }
}
declare const ClarityOptions: valibot.ObjectSchema<{
    /**
     * The Clarity token.
     */
    readonly id: valibot.SchemaWithPipe<[valibot.StringSchema<undefined>, valibot.MinLengthAction<string, 10, undefined>]>;
}, undefined>;
type ClarityInput = RegistryScriptInput<typeof ClarityOptions>;

declare const CrispOptions: valibot.ObjectSchema<{
    /**
     * The Crisp ID.
     */
    readonly id: valibot.StringSchema<undefined>;
    /**
     * Extra configuration options. Used to configure the locale.
     * Same as CRISP_RUNTIME_CONFIG.
     * @see https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/language-customization/
     */
    readonly runtimeConfig: valibot.OptionalSchema<valibot.ObjectSchema<{
        readonly locale: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
    }, undefined>, never>;
    /**
     * Associated a session, equivalent to using CRISP_TOKEN_ID variable.
     * Same as CRISP_TOKEN_ID.
     * @see https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/session-continuity/
     */
    readonly tokenId: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
    /**
     * Restrict the domain that the Crisp cookie is set on.
     * Same as CRISP_COOKIE_DOMAIN.
     * @see https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/cookie-policies/
     */
    readonly cookieDomain: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
    /**
     * The cookie expiry in seconds.
     * Same as CRISP_COOKIE_EXPIRATION.
     * @see https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/cookie-policies/#change-cookie-expiration-date
     */
    readonly cookieExpiry: valibot.OptionalSchema<valibot.NumberSchema<undefined>, never>;
}, undefined>;
type CrispInput = RegistryScriptInput<typeof CrispOptions, false, false, false>;
interface CrispApi {
    push: (...args: any[]) => void;
    is: (name: 'chat:opened' | 'chat:closed' | 'chat:visible' | 'chat:hidden' | 'chat:small' | 'chat:large' | 'session:ongoing' | 'website:available' | 'overlay:opened' | 'overlay:closed' | string) => boolean;
    set: (name: 'message:text' | 'session:data' | 'session:segments' | 'session:event' | 'user:email' | 'user:phone' | 'user:nickname' | 'user:avatar' | 'user:company' | string, value: any) => void;
    get: (name: 'chat:unread:count' | 'message:text' | 'session:identifier' | 'session:data' | 'user:email' | 'user:phone' | 'user:nickname' | 'user:avatar' | 'user:company' | string) => any;
    do: (name: 'chat:open' | 'chat:close' | 'chat:toggle' | 'chat:show' | 'chat:hide' | 'helpdesk:search' | 'helpdesk:article:open' | 'helpdesk:query' | 'overlay:open' | 'overlay:close' | 'message:send' | 'message:show' | 'message:read' | 'message:thread:start' | 'message:thread:end' | 'session:reset' | 'trigger:run' | string, arg2?: any) => any;
    on: (name: 'session:loaded' | 'chat:initiated' | 'chat:opened' | 'chat:closed' | 'message:sent' | 'message:received' | 'message:compose:sent' | 'message:compose:received' | 'user:email:changed' | 'user:phone:changed' | 'user:nickname:changed' | 'user:avatar:changed' | 'website:availability:changed' | 'helpdesk:queried' | string, callback: (...args: any[]) => any) => void;
    off: (name: 'session:loaded' | 'chat:initiated' | 'chat:opened' | 'chat:closed' | 'message:sent' | 'message:received' | 'message:compose:sent' | 'message:compose:received' | 'user:email:changed' | 'user:phone:changed' | 'user:nickname:changed' | 'user:avatar:changed' | 'website:availability:changed' | 'helpdesk:queried' | string, callback: (...args: any[]) => any) => void;
    config: (options: any) => void;
    help: () => void;
    [key: string]: any;
}
declare global {
    interface Window {
        CRISP_READY_TRIGGER: () => void;
        CRISP_WEBSITE_ID: string;
        CRISP_RUNTIME_CONFIG?: {
            locale?: string;
        };
        CRISP_COOKIE_DOMAIN?: string;
        CRISP_COOKIE_EXPIRATION?: number;
        CRISP_TOKEN_ID?: string;
        $crisp: CrispApi;
    }
}

declare const GoogleAnalyticsOptions: valibot.ObjectSchema<{
    readonly id: valibot.StringSchema<undefined>;
    readonly l: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
}, undefined>;
type GoogleAnalyticsInput = RegistryScriptInput<typeof GoogleAnalyticsOptions>;

declare global {
    interface Window extends GoogleTagManagerApi {
    }
}
declare const GoogleTagManagerOptions: valibot.ObjectSchema<{
    readonly id: valibot.StringSchema<undefined>;
    readonly l: valibot.OptionalSchema<valibot.StringSchema<undefined>, never>;
}, undefined>;
type GoogleTagManagerInput = RegistryScriptInput<typeof GoogleTagManagerOptions>;

type NuxtUseScriptOptions<T = any> = Omit<UseScriptOptions<T>, 'trigger'> & {
    /**
     * The trigger to load the script:
     * - `onNuxtReady` - Load the script when Nuxt is ready.
     * - `manual` - Load the script manually by calling `$script.load()` or `$script.waitForLoad()`.
     * - `Promise` - Load the script when the promise resolves.
     */
    trigger?: UseScriptOptions<T>['trigger'] | 'onNuxtReady';
    /**
     * Should the script be bundled as an asset and loaded from your server. This is useful for improving the
     * performance by avoiding the extra DNS lookup and reducing the number of requests. It also
     * improves privacy by not sharing the user's IP address with third-party servers.
     * - `true` - Bundle the script as an asset.
     * - `false` - Do not bundle the script. (default)
     */
    bundle?: boolean;
    /**
     * Skip any schema validation for the script input. This is useful for loading the script stubs for development without
     * loading the actual script and not getting warnings.
     */
    skipValidation?: boolean;
    /**
     * @internal
     */
    performanceMarkFeature?: string;
    /**
     * @internal
     */
    devtools?: {
        /**
         * Key used to map to the registry script for Nuxt DevTools.
         * @internal
         */
        registryKey?: string;
        /**
         * Extra metadata to show with the registry script
         * @internal
         */
        registryMeta?: Record<string, string>;
    };
};
type NuxtUseScriptOptionsSerializable = Omit<NuxtUseScriptOptions, 'use' | 'skipValidation' | 'stub' | 'trigger' | 'eventContext' | 'beforeInit'> & {
    trigger?: 'client' | 'server' | 'onNuxtReady';
};
type NuxtUseScriptInput = UseScriptInput;
interface ScriptRegistry {
    crisp?: CrispInput;
    clarity?: ClarityInput;
    cloudflareWebAnalytics?: CloudflareWebAnalyticsInput;
    metaPixel?: MetaPixelInput;
    fathomAnalytics?: FathomAnalyticsInput;
    plausibleAnalytics?: PlausibleAnalyticsInput;
    googleAdsense?: GoogleAdsenseInput;
    googleAnalytics?: GoogleAnalyticsInput;
    googleMaps?: GoogleMapsInput;
    lemonSqueezy?: LemonSqueezyInput;
    googleTagManager?: GoogleTagManagerInput;
    hotjar?: HotjarInput;
    intercom?: IntercomInput;
    matomoAnalytics?: MatomoAnalyticsInput;
    segment?: SegmentInput;
    stripe?: StripeInput;
    xPixel?: XPixelInput;
    youtubePlayer?: YouTubePlayerInput;
    vimeoPlayer?: VimeoPlayerInput;
    [key: `${string}-npm`]: NpmInput;
}
type NuxtConfigScriptRegistryEntry<T> = true | 'mock' | T | [T, NuxtUseScriptOptionsSerializable];
type NuxtConfigScriptRegistry<T extends keyof ScriptRegistry = keyof ScriptRegistry> = Partial<{
    [key in T]: NuxtConfigScriptRegistryEntry<ScriptRegistry[key]>;
}>;
interface RegistryScript {
    import?: Import;
    scriptBundling?: false | ((options?: any) => string | false);
    label?: string;
    src?: string | false;
    category?: string;
    logo?: string | {
        light: string;
        dark: string;
    };
}
type RegistryScripts = RegistryScript[];

export type { NuxtConfigScriptRegistry as N, RegistryScripts as R, NuxtUseScriptOptionsSerializable as a, NuxtUseScriptInput as b };
