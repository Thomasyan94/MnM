export const store = {
  lang: "zh",
  menu: [],
  cat: 1,
  index: 3,
  uid: 0,
  cart: [],
  state: {},
  toastTimer: null,
};
export function product() {
  return store.menu.filter((x) => x.cat === store.cat)[store.index];
}
export function resetState() {
  store.state = {
    size: 0,
    milk: 0,
    tops: [],
    foam: "none",
    sugar: 50,
    ice: 2,
  };
}
