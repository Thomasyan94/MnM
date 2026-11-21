import { store } from "../state/store.js";
export const pick = (a) => a[["zh", "en", "ms"].indexOf(store.lang)];
export function name(d) {
  return store.lang === "zh" ? d.zh : store.lang === "ms" ? d.ms : d.en;
}
