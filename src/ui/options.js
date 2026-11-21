import { catalog } from "../data/catalog-runtime.js";
import { product, store } from "../state/store.js";
import { $ } from "../lib/dom.js";
import { baseExtras, total } from "../controllers/drink-controller.js";
import {
  foamDefs,
  foamIds,
  ingredients,
  milks,
  toppingIds,
} from "../data/catalog-runtime.js";
import { catalogCream, catalogSprite } from "../renderers/catalog-cup.js";
import { pick } from "../i18n/locale.js";
import { money } from "../lib/money.js";
import { catalogDefaults } from "../config/visual-assets.js";
import { copy } from "../i18n/copy.js";
import { toppingSprite } from "../renderers/mocha-cup.js";
export function renderCatalogOptions() {
  const d = product(),
    isMocha = d.id === "1-3";
  $("#toppings").classList.toggle("catalog-options", !isMocha);
  $("#foams").classList.toggle("catalog-foams", !isMocha);
  if (isMocha) return;
  const included = baseExtras(d);
  $("#toppings").innerHTML = catalog.drinks
    .find((row) => row.id === d.id)
    .allowedToppingIds.map((k) => {
      const locked = included.includes(k),
        selected = locked || store.state.tops.includes(k);
      return `<button class="ingredient-card ${selected ? "selected" : ""}" data-top="${k}" aria-pressed="${selected}" ${locked ? "disabled" : ""}>${catalogSprite(k, 'class="ingredient-thumb"')}<span>${pick(ingredients[k][0])}</span><small>${locked ? pick(["已包含", "Included", "Termasuk"]) : "+ " + money(ingredients[k][1])}</small><i>${selected ? "✓" : "+"}</i></button>`;
    })
    .join("");
  const original = catalogDefaults[d.id];
  $("#foams").innerHTML = catalog.drinks
    .find((row) => row.id === d.id)
    .allowedFoamIds.map(
      (k) =>
        `<button class="catalog-foam-choice ${store.state.foam === k ? "selected" : ""}" data-foam="${k}" aria-pressed="${store.state.foam === k}">${k === "none" ? "" : `<svg class="catalog-foam-thumb" viewBox="0 0 1024 440" aria-hidden="true">${catalogCream(k, 20, 75, 984, 330)}</svg>`}<span>${k === "none" ? pick(original ? ["保留原配方奶泡", "Keep original foam", "Kekalkan buih asal"] : ["不加奶盖", "No cream cap", "Tanpa krim"]) : pick(foamDefs[k][0])}</span><small>${k === "none" ? pick(["已包含", "Included", "Termasuk"]) : "+ " + money(foamDefs[k][1])}</small></button>`,
    )
    .join("");
}
export function btn(text, selected, attrs = "", extra = "") {
  return `<button class="${selected ? "selected" : ""}" aria-pressed="${selected}" ${attrs}>${text}${extra ? "<small>" + extra + "</small>" : ""}</button>`;
}
export function renderOptions() {
  let d = product(),
    base = baseExtras(d);
  $("#sizes").innerHTML = [
    pick(["中杯 · 500ml", "Medium · 500ml", "Sederhana · 500ml"]),
    pick(["大杯 · 750ml", "Large · 750ml", "Besar · 750ml"]),
  ]
    .map((s, i) =>
      btn(
        s,
        store.state.size === i,
        `data-size="${i}"`,
        money(d.price + i * 3 + milks[store.state.milk][1]),
      ),
    )
    .join("");
  $("#milks").innerHTML = milks
    .map((m, i) =>
      btn(
        pick(m[0]),
        store.state.milk === i,
        `data-milk="${i}"`,
        m[1] ? "+" + m[1] : "",
      ),
    )
    .join("");
  $("#toppings").innerHTML = catalog.drinks
    .find((row) => row.id === d.id)
    .allowedToppingIds.map((k) =>
      base.includes(k)
        ? `<button disabled class="selected">${pick(ingredients[k][0])}<small>${pick(["已包含", "Included", "Termasuk"])}</small></button>`
        : btn(
            pick(ingredients[k][0]),
            store.state.tops.includes(k),
            `data-top="${k}"`,
            "+" + ingredients[k][1],
          ),
    )
    .join("");
  $("#foams").innerHTML = catalog.drinks
    .find((row) => row.id === d.id)
    .allowedFoamIds.map((k) =>
      btn(
        pick(foamDefs[k][0]),
        store.state.foam === k,
        `data-foam="${k}"`,
        foamDefs[k][1] ? "+" + foamDefs[k][1] : "",
      ),
    )
    .join("");
  $("#sugars").innerHTML = [0, 30, 50, 70, 100]
    .map((n) => btn(n + "%", store.state.sugar === n, `data-sugar="${n}"`))
    .join("");
  $("#ices").innerHTML = [
    ["去冰", "No ice", "Tiada"],
    ["少冰", "Less", "Sedikit"],
    ["正常", "Regular", "Biasa"],
  ]
    .map((a, i) => btn(pick(a), store.state.ice === i, `data-ice="${i}"`))
    .join("");
  $("#total").textContent = money(total());
  renderMochaOptions();
  renderCatalogOptions();
}
export function renderMochaOptions() {
  const isMocha = product().id === "1-3";
  let preset = $("#mocha-presets");
  if (!preset) {
    preset = document.createElement("div");
    preset.id = "mocha-presets";
    $("#details").after(preset);
  }
  preset.hidden = !isMocha;
  $("#toppings").classList.toggle("mocha-topping-options", isMocha);
  $("#foams").classList.toggle("mocha-foam-options", isMocha);
  document.querySelector('[data-t="max3"]').textContent = isMocha
    ? pick(["可自由组合", "Mix your favorites", "Gabungkan kegemaran"])
    : pick(copy.max3);
  if (!isMocha) return;
  $("#scene-word").innerHTML = "MOCHA<br>JOY.";
  $(".drink-display").style.background = "#edd4bd";
  preset.innerHTML = `<p>${pick(["先选一杯纯摩卡，再搭出图里的快乐。", "Start with mocha. Add a little happy.", "Mulakan dengan mocha. Tambah kegembiraan."])}</p><div class="options"><button data-mocha-base aria-pressed="${!store.state.tops.length && store.state.foam === "none"}">${pick(["只看摩卡基底", "Mocha only", "Mocha sahaja"])}</button><button data-mocha-loaded aria-pressed="${store.state.foam === "whip" && store.state.tops.includes("choc") && store.state.tops.includes("marshmallow")}">${pick(["试试奶油＋双配料", "Try the full topping mix", "Cuba semua topping"])}</button></div>`;
  $("#toppings").innerHTML = ["marshmallow", "choc"]
    .map(
      (k) =>
        `<button data-top="${k}" class="ingredient-card ${store.state.tops.includes(k) ? "selected" : ""}" aria-pressed="${store.state.tops.includes(k)}">${toppingSprite(k, 'class="ingredient-thumb"')}<span>${k === "choc" ? pick(["圆润巧克力块", "Chunky chocolate", "Ketulan coklat"]) : pick(ingredients[k][0])}</span><small>+ RM ${ingredients[k][1].toFixed(2)}</small><i>${store.state.tops.includes(k) ? "✓" : "+"}</i></button>`,
    )
    .join("");
  $("#foams").innerHTML =
    btn(
      pick(["不加奶油", "No cream", "Tanpa krim"]),
      store.state.foam === "none",
      'data-foam="none"',
    ) +
    `<button data-foam="whip" class="cream-choice ${store.state.foam === "whip" ? "selected" : ""}" aria-pressed="${store.state.foam === "whip"}">${toppingSprite("whip", 'class="cream-thumb"')}<span>${pick(foamDefs.whip[0])}</span><small>+ RM 2.50</small></button>`;
}
