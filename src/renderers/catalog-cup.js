import { toppingSprite } from "./mocha-cup.js";
import {
  catalogAssets,
  catalogDefaults,
  catalogFilters,
  catalogTopAssets,
} from "../config/visual-assets.js";
import { store } from "../state/store.js";
import { foamDefs, ingredients, milks } from "../data/catalog-runtime.js";
import { name, pick } from "../i18n/locale.js";
export function catalogSprite(k, attrs = "") {
  if (["choc", "marshmallow"].includes(k)) return toppingSprite(k, attrs);
  if (k === "whip") return toppingSprite("whip", attrs);
  if (catalogTopAssets[k])
    return `<svg viewBox="0 0 1024 1024" ${attrs} aria-hidden="true"><image href="assets/top-${catalogTopAssets[k]}-v8.webp" width="1024" height="1024" ${catalogFilters[k] ? `style="filter:${catalogFilters[k]}"` : ""}/></svg>`;
  if (["cocoa", "cinnamon"].includes(k)) {
    const c = k === "cocoa" ? "#71402b" : "#b67943";
    return `<svg viewBox="0 0 120 90" ${attrs} aria-hidden="true"><ellipse cx="60" cy="66" rx="43" ry="12" fill="#36231212"/><path d="M17 63 Q38 46 54 23 Q66 17 80 40 Q88 50 106 64 Q64 85 17 63" fill="${c}"/>${Array.from(
      {
        length: 36,
      },
      (_, i) =>
        `<circle cx="${26 + ((i * 29) % 72)}" cy="${43 + ((i * 11) % 25)}" r="1" fill="#f9d29e" opacity=".55"/>`,
    ).join("")}</svg>`;
  }
  const c = k === "shot" ? "#4a2518" : k === "caramel" ? "#ba752b" : "#e0b774";
  return `<svg viewBox="0 0 120 90" ${attrs} aria-hidden="true"><path d="M60 8 C49 24 32 41 32 57 C32 89 88 89 88 57 C88 40 70 23 60 8Z" fill="${c}"/><path d="M47 44 Q39 57 48 65" stroke="#fff9" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`;
}
export function catalogCream(foam, x = 135, y = 290, w = 754, h = 250) {
  if (foam === "whip")
    return toppingSprite(
      "whip",
      `x="${x}" y="${y - 65}" width="${w}" height="${h + 65}"`,
    );
  const filter =
    foam === "taro"
      ? "sepia(.3) saturate(.8) hue-rotate(225deg)"
      : foam === "coco"
        ? "brightness(1.06)"
        : foam === "van"
          ? "sepia(.16)"
          : "";
  return `<image href="assets/cream-cap.png" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" ${filter ? `style="filter:${filter}"` : ""}/>`;
}
export function catalogLayers(d, conf, id) {
  const foam =
    conf.foam && conf.foam !== "none" ? conf.foam : catalogDefaults[d.id];
  const solid = (conf.tops || []).filter(
    (k) => catalogTopAssets[k] || ["choc", "marshmallow"].includes(k),
  );
  const effects = (conf.tops || []).filter((k) => !solid.includes(k));
  let out = foam
    ? `<g data-part="foam-${foam}"><g>${catalogCream(foam)}</g></g>`
    : "";
  if (d.id === "1-8")
    out += `<g data-part="original-brulee"><path d="M208 407 Q495 332 819 408 Q742 485 260 450Z" fill="#b47723" opacity=".76"/>${Array.from(
      {
        length: 35,
      },
      (_, i) =>
        `<circle cx="${255 + ((i * 73) % 514)}" cy="${391 + ((i * 11) % 49)}" r="${3 + (i % 3)}" fill="#5b321d" opacity=".6"/>`,
    ).join("")}</g>`;
  if (d.id === "1-9")
    out += `<g data-part="original-pistachio">${Array.from(
      {
        length: 22,
      },
      (_, i) =>
        `<ellipse cx="${265 + ((i * 71) % 490)}" cy="${388 + ((i * 13) % 60)}" rx="6" ry="3" fill="${i % 2 ? "#647a39" : "#b5bd71"}" transform="rotate(${i * 17} ${265 + ((i * 71) % 490)} ${388 + ((i * 13) % 60)})"/>`,
    ).join("")}</g>`;
  const arrangements = {
    1: [
      {
        x: 345,
        y: 315,
        w: 335,
        angle: -3,
      },
    ],
    2: [
      {
        x: 215,
        y: 325,
        w: 320,
        angle: -4,
      },
      {
        x: 520,
        y: 330,
        w: 320,
        angle: 4,
      },
    ],
    3: [
      {
        x: 370,
        y: 280,
        w: 290,
        angle: -2,
      },
      {
        x: 175,
        y: 340,
        w: 310,
        angle: -4,
      },
      {
        x: 550,
        y: 340,
        w: 310,
        angle: 4,
      },
    ],
  };
  solid.forEach((k, j) => {
    const { x, y, w, angle } = arrangements[solid.length][j];
    out += `<g data-part="top-${k}" class="catalog-solid-topping"><g transform="rotate(${angle} ${x + w / 2} ${y + w / 2})"><ellipse cx="${x + w / 2}" cy="${Math.min(545, y + w * 0.86)}" rx="${w * 0.31}" ry="19" fill="#362212" opacity=".19" filter="url(#${id}-shadow)"/>${catalogSprite(k, `x="${x}" y="${y}" width="${w}" height="${w}"`)}</g></g>`;
  });
  effects.forEach((k) => {
    if (k === "cocoa" || k === "cinnamon")
      out += `<g data-part="top-${k}"><g>${Array.from(
        {
          length: 110,
        },
        (_, i) =>
          `<circle cx="${230 + ((i * 73) % 565)}" cy="${(foam ? 352 : 430) + ((i * 29) % 71)}" r="${3 + (i % 5)}" fill="${k === "cocoa" ? "#542d1c" : "#99592e"}" opacity="${0.35 + (i % 4) * 0.13}"/>`,
      ).join("")}</g></g>`;
    else if (k === "shot")
      out += `<g data-part="top-shot"><g clip-path="url(#${id}-liquid)"><path d="M248 480 Q440 565 750 476 C720 640 365 585 420 805 C485 1000 673 917 690 1270" stroke="#341c13" stroke-width="85" opacity=".72" fill="none"/><ellipse cx="512" cy="475" rx="340" ry="58" fill="#382017" opacity=".4"/></g></g>`;
    else
      out += `<g data-part="top-${k}"><g><path d="M225 ${foam ? 382 : 452} Q360 ${foam ? 330 : 402} 715 ${foam ? 424 : 494} M285 ${foam ? 428 : 480} Q590 ${foam ? 360 : 420} 800 ${foam ? 448 : 500}" fill="none" stroke="${k === "caramel" ? "#ae631f" : "#d8ad6c"}" stroke-width="${k === "caramel" ? 32 : 24}" stroke-linecap="round" opacity=".85"/><path d="M270 505 Q330 626 310 718 M760 505 Q710 607 735 662" stroke="${k === "caramel" ? "#b97934" : "#d7b67a"}" stroke-width="13" opacity=".4" fill="none"/></g></g>`;
  });
  if (foam && solid.length)
    out += `<g clip-path="url(#${id}-front)">${catalogCream(foam)}</g>`;
  return out;
}
export function catalogCup(d, conf = {}) {
  const id = "catalog" + store.uid++,
    file = catalogAssets[d.id];
  const body =
    "M126 475 C126 390 887 390 887 475 L780 1390 Q768 1440 512 1440 Q252 1440 245 1390Z";
  let milk = "";
  if (conf.milk) {
    const color = ["", "#ead4ac", "#fffaf0", "#e4d6b7"][conf.milk];
    milk = `<g clip-path="url(#${id}-liquid)"><path d="M170 520 Q315 790 240 1050 Q480 1420 790 1130 L800 1420 H220Z" fill="${color}" opacity=".27"/><path d="M295 485 Q570 660 415 890 Q280 1090 660 1280" stroke="${color}" opacity=".4" stroke-width="55" fill="none"/></g>`;
  }
  const desc = [
    d.en,
    ...(conf.tops || []).map((k) => ingredients[k][0][1]),
    conf.foam && conf.foam !== "none" ? foamDefs[conf.foam][0][1] : "",
  ]
    .filter(Boolean)
    .join(", ");
  return `<span class="photo-product catalog-product" role="img" aria-label="${desc}"><svg class="catalog-composite" viewBox="0 0 1024 1536" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><clipPath id="${id}-outer"><path d="M65 250 C65 77 960 77 960 250 L790 1395 Q773 1450 512 1450 Q250 1450 235 1395Z"/></clipPath><clipPath id="${id}-liquid"><path d="${body}"/></clipPath><clipPath id="${id}-front"><path d="M126 475 C126 585 887 585 887 475 L780 1390 Q768 1440 512 1440 Q252 1440 245 1390Z"/></clipPath><filter id="${id}-shadow" x="-40%" y="-200%" width="180%" height="500%"><feGaussianBlur stdDeviation="7"/></filter><linearGradient id="${id}-glass"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".24" stop-color="#d9d8cb" stop-opacity=".45"/><stop offset=".53" stop-color="#fff" stop-opacity=".85"/><stop offset=".82" stop-color="#889083" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".95"/></linearGradient></defs><ellipse cx="512" cy="1450" rx="245" ry="17" fill="#35261b" opacity=".1"/><image href="assets/${file}" width="1024" height="1536" clip-path="url(#${id}-outer)"/>${milk}${catalogLayers(d, conf, id)}${(conf.tops || []).some((k) => catalogTopAssets[k] || ["choc", "marshmallow"].includes(k)) && (!conf.foam || conf.foam === "none") && !catalogDefaults[d.id] ? `<image href="assets/${file}" width="1024" height="1536" clip-path="url(#${id}-front)"/>` : ""}<path d="M78 255 C78 420 946 420 946 255" stroke="url(#${id}-glass)" stroke-width="5" opacity=".72" fill="none"/><path d="M110 300 L133 442 M917 300 L893 441" stroke="#fff" stroke-opacity=".25" stroke-width="4" fill="none"/></svg></span>`;
}
export function catalogLegacyCup(d, conf, asset) {
  const id = "legacy" + store.uid++;
  const offset =
    asset.key === "brown" ? -120 : asset.key === "coffee" ? 40 : -65;
  return `<span class="photo-product ${asset.key} catalog-legacy" role="img" aria-label="${d.en}"><img class="product-photo" src="assets/${asset.file}" alt="" width="1024" height="1536" decoding="async" draggable="false"><svg class="catalog-legacy-extras" viewBox="0 0 1024 1536" aria-hidden="true"><defs><filter id="${id}-shadow"><feGaussianBlur stdDeviation="7"/></filter><clipPath id="${id}-liquid"><path d="M170 450 L310 1470 H710 L850 450Z"/></clipPath></defs><g transform="translate(0 ${offset})">${catalogLayers(d, conf, id)}</g></svg></span>`;
}
export function catalogCaption(d, conf) {
  const parts = [name(d)];
  if (conf.milk) parts.push(pick(milks[conf.milk][0]));
  if (catalogDefaults[d.id])
    parts.push(
      pick([
        "原配方奶泡已包含",
        "Original foam included",
        "Buih asal termasuk",
      ]),
    );
  (conf.tops || []).forEach((k) => parts.push(pick(ingredients[k][0])));
  if (conf.foam && conf.foam !== "none")
    parts.push(pick(foamDefs[conf.foam][0]));
  return parts.join(" + ");
}
