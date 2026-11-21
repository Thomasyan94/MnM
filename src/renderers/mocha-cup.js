import { mochaMilkAssets, mochaSpriteDefs } from "../config/visual-assets.js";
import { store } from "../state/store.js";
import { pick } from "../i18n/locale.js";
import { foamDefs, ingredients } from "../data/catalog-runtime.js";
export function toppingSprite(kind, attrs = "") {
  const a = mochaSpriteDefs[kind],
    id = "sprite" + store.uid++;
  return `<svg viewBox="${a.view}" ${attrs} aria-hidden="true" focusable="false">${a.path ? `<defs><clipPath id="${id}"><path d="${a.path}"/></clipPath></defs>` : ""}<image href="assets/${a.file}" width="${a.w}" height="${a.h}" ${a.path ? `clip-path="url(#${id})"` : ""}/></svg>`;
}
export function mochaMilkName(milk) {
  return pick(
    milk === 1
      ? ["燕麦奶摩卡", "Oat milk mocha", "Mocha susu oat"]
      : milk === 2
        ? ["椰奶摩卡", "Coconut milk mocha", "Mocha susu kelapa"]
        : milk === 3
          ? ["豆奶摩卡", "Soy milk mocha", "Mocha susu soya"]
          : ["经典摩卡", "Classic mocha", "Mocha klasik"],
  );
}
export function mochaCup(conf = {}) {
  const milkAsset = mochaMilkAssets[conf.milk] || mochaMilkAssets[0];
  const id = "mocha" + store.uid++,
    tops = conf.tops || [],
    cream = conf.foam && conf.foam !== "none",
    marsh = tops.includes("marshmallow"),
    choc = tops.includes("choc");
  if (cream && marsh && choc)
    return `<span class="photo-product mocha mocha-finished" role="img" aria-label="Mocha with cream, marshmallows and chocolate"><img class="product-photo" src="assets/${milkAsset.full}" alt="" width="1024" height="1536" decoding="async" draggable="false"></span>`;
  // Rear glass and photo liquid share one fixed viewBox; independent topping sprites sit between rear and front glass.
  const lower =
    "M126 475 C126 390 887 390 887 475 L780 1390 Q768 1440 512 1440 Q252 1440 245 1390Z";
  const placed = (kind, key, x, y, w, h, angle = 0) =>
    `<g data-part="${key}" transform="translate(${x} ${y})"><g transform="rotate(${angle} ${w / 2} ${h / 2})"><ellipse cx="${w * 0.5}" cy="${h * 0.91}" rx="${w * 0.34}" ry="${h * 0.055}" fill="#381b0c" opacity=".26" filter="url(#${id}-contact)"/>${toppingSprite(kind, `x="0" y="0" width="${w}" height="${h}"`)}</g></g>`;
  let layers = "";
  if (marsh)
    layers += placed(
      "marshmallow",
      "marsh-back",
      220,
      cream ? 215 : 290,
      215,
      220,
      -9,
    );
  if (choc)
    layers += placed(
      "choc",
      "choc-back",
      cream ? 580 : 410,
      cream ? 210 : 295,
      220,
      215,
      9,
    );
  if (cream) layers += placed("whip", "cream", 145, 200, 745, 335);
  if (choc) {
    layers += placed("choc", "choc-left", 235, 335, 210, 215, -9);
    layers += placed("choc", "choc-right", 610, 320, 215, 215, 11);
  }
  if (marsh)
    layers += placed(
      "marshmallow",
      "marsh-front",
      430,
      cream ? 335 : 320,
      220,
      220,
      5,
    );
  return `<span class="photo-product mocha" role="img" aria-label="Mocha${cream ? ", cream" : ""}${marsh ? ", marshmallows" : ""}${choc ? ", chocolate" : ""}"><svg class="mocha-composite" viewBox="0 0 1024 1536" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="${id}-contact" x="-40%" y="-100%" width="180%" height="300%"><feGaussianBlur stdDeviation="7"/></filter><clipPath id="${id}-liquid"><path d="${lower}"/></clipPath><linearGradient id="${id}-edge"><stop stop-color="#fff" stop-opacity=".8"/><stop offset=".2" stop-color="#a9aaa2" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset=".85" stop-color="#666d63" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></linearGradient><linearGradient id="${id}-shine"><stop stop-color="#fff" stop-opacity=".36"/><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient></defs><ellipse cx="512" cy="1450" rx="245" ry="17" fill="#35261b" opacity=".1"/><path d="M78 255 L126 475 M946 255 L887 475" stroke="#fff" stroke-opacity=".6" stroke-width="6"/><ellipse cx="512" cy="250" rx="438" ry="125" fill="none" stroke="url(#${id}-edge)" stroke-width="9"/><image class="mocha-liquid-photo" href="assets/${milkAsset.base}" width="1024" height="1536" clip-path="url(#${id}-liquid)"/><path d="M78 255 C78 420 946 420 946 255" fill="none" stroke="url(#${id}-edge)" stroke-width="5" opacity=".55"/>${layers}<path d="M110 300 L133 442 M917 300 L893 441" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="4" stroke-linecap="round"/></svg></span>`;
}
export function mochaCaption() {
  const a = [mochaMilkName(store.state.milk)];
  if (store.state.foam !== "none") a.push(pick(foamDefs[store.state.foam][0]));
  store.state.tops.forEach((k) => a.push(pick(ingredients[k][0])));
  return a.length
    ? a.join(" + ")
    : pick([
        "摩卡基底 · 为喜欢的配料留点空间",
        "Just mocha. Room for your favorites.",
        "Asas mocha. Ruang untuk kegemaran anda.",
      ]);
}
