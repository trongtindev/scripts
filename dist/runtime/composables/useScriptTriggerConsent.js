import { isRef, onNuxtReady, ref, requestIdleCallback, toValue, tryUseNuxtApp, watch } from "#imports";
export function useScriptTriggerConsent(options) {
  if (import.meta.server)
    return new Promise(() => {
    });
  const consented = ref(false);
  const nuxtApp = tryUseNuxtApp();
  const promise = new Promise((resolve) => {
    watch(consented, (ready) => {
      if (ready) {
        const runner = nuxtApp?.runWithContext || ((cb) => cb());
        if (options?.postConsentTrigger instanceof Promise) {
          options.postConsentTrigger.then(() => runner(resolve));
          return;
        }
        if (options?.postConsentTrigger === "onNuxtReady") {
          const idleTimeout = options?.postConsentTrigger ? nuxtApp ? onNuxtReady : requestIdleCallback : (cb) => cb();
          runner(() => idleTimeout(resolve));
          return;
        }
        runner(resolve);
      }
    });
    if (options?.consent) {
      if (typeof options?.consent === "boolean") {
        consented.value = true;
      } else if (options?.consent instanceof Promise) {
        options?.consent.then((res) => {
          consented.value = typeof res === "boolean" ? res : true;
        });
      } else if (isRef(options?.consent)) {
        watch(options.consent, (_val) => {
          const val = toValue(_val);
          if (typeof val === "boolean")
            consented.value = val;
        }, { immediate: true });
      }
    }
  });
  promise.accept = () => {
    consented.value = true;
  };
  return promise;
}
