import { watch } from "vue";
import { useRegistryScript } from "../utils.js";
import { useHead } from "#imports";
export function useScriptYouTubePlayer(_options) {
  let readyPromise = Promise.resolve();
  const instance = useRegistryScript("youtubePlayer", () => ({
    scriptInput: {
      src: "https://www.youtube.com/iframe_api",
      crossorigin: false
      // crossorigin can't be set or it breaks
    },
    scriptOptions: {
      use() {
        return {
          YT: readyPromise.then(() => {
            return window.YT;
          })
        };
      }
    },
    clientInit: import.meta.server ? void 0 : () => {
      readyPromise = new Promise((resolve) => {
        window.onYouTubeIframeAPIReady = resolve;
      });
    }
  }), _options);
  if (import.meta.client) {
    const _ = watch(instance.$script.status, (status) => {
      if (status === "loading") {
        useHead({
          link: [
            {
              rel: "preconnect",
              href: "https://www.youtube-nocookie.com"
            },
            {
              rel: "preconnect",
              href: "https://www.google.com"
            },
            {
              rel: "preconnect",
              href: "https://googleads.g.doubleclick.net"
            },
            {
              rel: "preconnect",
              href: "https://static.doubleclick.net"
            }
          ]
        });
        _();
      }
    });
  }
  return instance;
}
