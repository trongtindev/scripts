import {
  useEventListener,
  useIntersectionObserver
} from "@vueuse/core";
function useElementVisibilityPromise(element) {
  let observer;
  return new Promise((resolve) => {
    observer = useIntersectionObserver(
      element,
      (intersectionObserverEntries) => {
        for (const entry of intersectionObserverEntries) {
          if (entry.isIntersecting)
            resolve();
        }
      },
      {
        rootMargin: "30px 0px 0px 0px",
        threshold: 0
      }
    );
  }).finally(() => {
    observer.stop();
  });
}
export function useScriptTriggerElement(options) {
  const { el, trigger } = options;
  if (import.meta.server || !el)
    return new Promise(() => {
    });
  const triggers = (Array.isArray(options.trigger) ? options.trigger : [options.trigger]).filter(Boolean);
  if (el && triggers.some((t) => ["visibility", "visible"].includes(t)))
    return useElementVisibilityPromise(el);
  if (!trigger)
    return Promise.resolve();
  if (!triggers.includes("immediate")) {
    return new Promise((resolve) => {
      const _ = useEventListener(
        typeof el !== "undefined" ? el : document.body,
        triggers,
        () => {
          resolve();
          _();
        },
        { once: true, passive: true }
      );
    });
  }
  return Promise.resolve();
}
