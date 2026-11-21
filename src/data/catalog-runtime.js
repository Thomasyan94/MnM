// Adapter boundary: the UI keeps its existing visual behavior while repositories use stable IDs and cents.
import { appConfig } from "../config/app-config.js";
import { createCatalogRepository } from "../repositories/catalog-repository.js";
export const catalog = await createCatalogRepository(appConfig).getCatalog();
const categoryOrder = ["milk-tea", "coffee", "matcha"];
const milkOrder = ["original", "oat", "coconut", "soy"];
const sizeOrder = ["medium", "large"];
const orderedCategories = categoryOrder.map((id) =>
  catalog.categories.find((row) => row.id === id),
);
const labels = (value) => [value.zh, value.en, value.ms];
export const categories = orderedCategories.map((row) => labels(row.name));
export const ingredients = Object.fromEntries(
  catalog.toppings.map((row) => [
    row.id,
    [labels(row.name), row.priceCents / 100, row.color],
  ]),
);
export const foamDefs = Object.fromEntries(
  catalog.foams.map((row) => [
    row.id,
    [labels(row.name), row.priceCents / 100],
  ]),
);
export const milks = milkOrder
  .map((id) => catalog.milks.find((row) => row.id === id))
  .map((row) => [labels(row.name), row.priceCents / 100]);
export const toppingIds = orderedCategories.map((category) => [
  ...new Set(
    catalog.drinks
      .filter((d) => d.categoryId === category.id)
      .flatMap((d) => d.allowedToppingIds),
  ),
]);
export const foamIds = orderedCategories.map((category) => [
  ...new Set(
    catalog.drinks
      .filter((d) => d.categoryId === category.id)
      .flatMap((d) => d.allowedFoamIds),
  ),
]);
export const toLegacyDrinks = (data) =>
  data.drinks.map((d) => ({
    id: d.id,
    cat: categoryOrder.indexOf(d.categoryId),
    en: d.name.en,
    zh: d.name.zh,
    ms: d.name.ms,
    price: d.priceCents / 100,
    story: labels(d.story),
    ingredients: labels(d.ingredients),
    note: d.note,
  }));
export function toSelection(state) {
  return {
    sizeId: sizeOrder[state.size],
    milkId: milkOrder[state.milk],
    toppingIds: [...state.tops],
    foamId: state.foam,
    sugar: state.sugar,
    ice: state.ice,
  };
}
