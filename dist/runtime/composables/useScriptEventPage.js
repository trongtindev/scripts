import { injectHead, ref, useNuxtApp, useRoute } from "#imports";
export function useScriptEventPage(onChange) {
  const nuxt = useNuxtApp();
  const route = useRoute();
  const head = injectHead();
  const payload = ref({
    path: route.fullPath,
    title: import.meta.client ? document.title : ""
  });
  if (import.meta.server)
    return payload;
  let lastPayload = { path: "", title: "" };
  let stopDomWatcher;
  nuxt.hooks.hook("page:finish", () => {
    Promise.race([
      // possibly no head update is needed
      new Promise((resolve) => setTimeout(resolve, 100)),
      new Promise((resolve) => {
        stopDomWatcher = head.hooks.hook("dom:rendered", () => resolve());
      })
    ]).finally(() => {
      stopDomWatcher && stopDomWatcher();
    }).then(() => {
      payload.value = {
        path: route.fullPath,
        title: document.title
      };
      if (lastPayload.path !== payload.value.path || lastPayload.title !== payload.value.title) {
        onChange && onChange(payload.value);
        lastPayload = payload.value;
      }
    });
  });
  return payload;
}
