import { product, store } from "../state/store.js";
import { name, pick } from "../i18n/locale.js";
import { copy } from "../i18n/copy.js";
import { $ } from "../lib/dom.js";
import {
  categories,
  ingredients,
  milks,
  toppingIds,
} from "../data/catalog-runtime.js";
import { btn, renderOptions } from "./options.js";
import { money } from "../lib/money.js";
import { cup } from "../renderers/cup.js";
import { mochaCaption, mochaMilkName } from "../renderers/mocha-cup.js";
import {
  catalogFlavorScales,
  catalogRecommendations,
  photoDefs,
} from "../config/visual-assets.js";
import { catalogCaption } from "../renderers/catalog-cup.js";
import { baseExtras } from "../controllers/drink-controller.js";
import { colors } from "../renderers/vector-cup.js";
export function applyLanguage() {
  document.documentElement.lang = {
    zh: "zh-Hans",
    en: "en",
    ms: "ms",
  }[store.lang];
  document
    .querySelectorAll("[data-t]")
    .forEach((e) => (e.innerHTML = pick(copy[e.dataset.t])));
  render();
}
export function render() {
  let d = product();
  $("#categories").innerHTML = categories
    .map((c, i) => btn(pick(c), i === store.cat, `data-cat="${i}"`))
    .join("");
  $("#categories").querySelector(".selected").classList.add("active");
  $("#category-label").textContent = [
    "MILK TEA COLLECTION",
    "COFFEE COLLECTION",
    "MATCHA COLLECTION",
  ][store.cat];
  $("#product-number").textContent =
    String(store.index + 1).padStart(2, "0") +
    " / " +
    store.menu.filter((x) => x.cat === store.cat).length;
  $("#scene-word").innerHTML = [
    "MILK<br>TEA.",
    "COFFEE<br>CLUB.",
    "MATCHA<br>MOOD.",
  ][store.cat];
  $(".drink-display").style.background = ["#ebd8bf", "#e7bd9c", "#dfe8c6"][
    store.cat
  ];
  $("#drink-title").textContent = name(d);
  $("#base-price").textContent = money(d.price);
  let stories = [
    [
      "茶香和奶香之间，留一点空间，装下你喜欢的甜与嚼劲。",
      "Comforting tea meets creamy milk. Leave a little room for something chewy.",
      "Aroma teh bertemu susu berkrim. Tambah sedikit tekstur kenyal kegemaran anda.",
    ],
    [
      "一口咖啡香，唤醒今天的灵感。浓一点，或柔和一点，都由你决定。",
      "A little coffee ritual for a brighter day. Keep it bold or make it mellow.",
      "Ritual kopi untuk hari yang ceria. Pilih rasa pekat atau lebih lembut.",
    ],
    [
      "把一抹清新的绿，和喜欢的风味放在一起，让每一口都有层次。",
      "Earthy green matcha, a creamy canvas and a little room for a colorful twist.",
      "Matcha hijau dengan asas berkrim dan sentuhan rasa pilihan anda.",
    ],
  ];
  $("#drink-story").textContent = pick(d.story || stories[store.cat]);
  renderOptions();
  renderCup();
  renderDetails();
  $("#drink-dots").innerHTML = Array.from(
    {
      length: store.menu.filter((x) => x.cat === store.cat).length,
    },
    (_, i) =>
      `<button class="dot ${i === store.index ? "on" : ""}" data-index="${i}" aria-label="${i + 1}" aria-current="${i === store.index}"></button>`,
  ).join("");
  $("#drink-list").innerHTML = store.menu
    .filter((x) => x.cat === store.cat)
    .map(
      (x, i) =>
        `<button class="drink-card ${i === store.index ? "active" : ""}" data-index="${i}">${cup(x)}<span>${name(x)}</span><small>${money(x.price)}</small></button>`,
    )
    .join("");
}
export function renderCup(animate = false, msg = "") {
  let el = $("#drink-cup");
  if (product().id === "1-3")
    $("#drink-title").textContent = mochaMilkName(store.state.milk);
  $("#base-price").textContent =
    pick(["基底 ", "Base ", "Asas "]) +
    money(
      product().price + milks[store.state.milk][1] + (store.state.size ? 3 : 0),
    );
  const previousParts = new Set(
    Array.from(el.querySelectorAll("[data-part]")).map((e) => e.dataset.part),
  );
  el.innerHTML = cup(product(), store.state, animate);
  el.querySelectorAll("[data-part]").forEach((e) => {
    if (!previousParts.has(e.dataset.part)) e.classList.add("mocha-arrive");
  });
  el.classList.toggle("mocha-large", store.state.size === 1);
  el.style.width =
    (photoDefs[product().id]
      ? store.state.size
        ? innerWidth < 681
          ? 290
          : 350
        : innerWidth < 681
          ? 260
          : 318
      : store.state.size
        ? innerWidth < 681
          ? 225
          : 260
        : innerWidth < 681
          ? 200
          : 235) + "px";
  $("#cup-caption").textContent =
    (product().id === "1-3"
      ? mochaCaption()
      : catalogCaption(product(), store.state)) ||
    pick([
      "你的杯子，正在变得不一样。",
      "A little more you, with every choice.",
      "Setiap pilihan menjadikannya milik anda.",
    ]);
}
export function renderDetails() {
  let d = product(),
    extras = baseExtras(d),
    cs = colors(d);
  let ingredientsText = pick(d.ingredients);
  let nums = catalogFlavorScales[d.id] || [3, 3, 3];
  let html = `<b>${pick(["原料与特色", "Ingredients & character", "Ramuan & ciri"])}</b><p>${ingredientsText}</p>`;
  [
    ["甜感", "Sweetness", "Kemanisan"],
    ["浓郁度", "Richness", "Kepekatan"],
    ["清爽感", "Freshness", "Kesegaran"],
  ].forEach(
    (a, i) =>
      (html += `<div class="meter"><span>${pick(a)}</span>${Array.from(
        {
          length: 5,
        },
        (_, j) => '<i class="' + (j < nums[i] ? "filled" : "") + '"></i>',
      ).join("")}</div>`),
  );
  html += `<p>${pick(["风味指标为示意；0% 指不额外加糖，原料本身仍可能含糖。", "Flavor scales are illustrative. 0% means no added sugar; ingredients may still be sweet.", "Skala rasa ialah ilustrasi. 0% bermaksud tiada gula tambahan; ramuan mungkin masih manis."])}</p><b>${pick(["推荐搭配", "Try it with", "Padanan pilihan"])}</b><div class="options" style="margin-top:10px">${(
    catalogRecommendations[d.id] || toppingIds[store.cat]
  )
    .filter((k) => !extras.includes(k))
    .slice(0, 2)
    .map((k) =>
      btn(
        pick(ingredients[k][0]),
        store.state.tops.includes(k),
        `data-top="${k}"`,
        "+" + ingredients[k][1],
      ),
    )
    .join(
      "",
    )}</div><p>${pick(["喝法小贴士：先尝原本的层次，再轻轻搅拌，让风味融合。", "Sip the layers first, then stir gently to bring the flavors together.", "Nikmati lapisan dahulu, kemudian kacau perlahan untuk menyatukan rasa."])}</p>`;
  $("#detail-content").innerHTML = html;
}
