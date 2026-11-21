import { calculateQuote } from "../domain/pricing.js";
import { catalog, toSelection } from "../data/catalog-runtime.js";
import { product, resetState, store } from "../state/store.js";
import { render, renderCup, renderDetails } from "../ui/menu.js";
import { $ } from "../lib/dom.js";
import { renderOptions } from "../ui/options.js";
export function baseExtras(drink) {
  const record = catalog.drinks.find((row) => row.id === drink.id);
  return [
    ...record.includedToppingIds,
    ...(record.includedFoamId ? ["basefoam"] : []),
  ];
}

export function total() {
  return (
    calculateQuote(catalog, product().id, toSelection(store.state)).totalCents /
    100
  );
}
export function changeDrink(i) {
  const length = store.menu.filter((d) => d.cat === store.cat).length;
  store.index = ((i % length) + length) % length;
  resetState();
  render();
  const cup = $("#drink-cup");
  cup.classList.remove("cup-appear");
  void cup.offsetWidth;
  cup.classList.add("cup-appear");
}
export function updateState(key, value) {
  store.state[key] = value;
  renderOptions();
  renderDetails();
  renderCup(false);
}
