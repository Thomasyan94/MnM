const locales = ["zh", "en", "ms"];
const fail = (message) => {
  throw new Error("Invalid catalog: " + message);
};
function localized(value, label) {
  if (
    !value ||
    locales.some((key) => typeof value[key] !== "string" || !value[key].trim())
  )
    fail(label);
}
export function validateCatalog(catalog) {
  if (!catalog || catalog.schemaVersion !== 1 || catalog.currency !== "MYR")
    fail("version/currency");
  for (const key of [
    "categories",
    "sizes",
    "milks",
    "toppings",
    "foams",
    "drinks",
  ]) {
    const rows = catalog[key];
    if (!Array.isArray(rows) || !rows.length)
      fail(key + " must be a nonempty list");
    const ids = new Set();
    for (const row of rows) {
      if (
        !row ||
        typeof row.id !== "string" ||
        !/^[a-z0-9-]+$/.test(row.id) ||
        ids.has(row.id)
      )
        fail(key + " id");
      ids.add(row.id);
      if (key !== "sizes") localized(row.name, key + " name");
      if (
        key !== "categories" &&
        (!Number.isSafeInteger(row.priceCents) || row.priceCents < 0)
      )
        fail(key + " priceCents");
    }
  }
  const ids = (key) => new Set(catalog[key].map((row) => row.id));
  const categories = ids("categories"),
    toppings = ids("toppings"),
    foams = ids("foams");
  for (const drink of catalog.drinks) {
    if (!categories.has(drink.categoryId)) fail("unknown category");
    localized(drink.story, "story");
    localized(drink.ingredients, "ingredients");
    for (const [field, known] of [
      ["allowedToppingIds", toppings],
      ["includedToppingIds", toppings],
      ["allowedFoamIds", foams],
    ]) {
      const values = drink[field];
      if (
        !Array.isArray(values) ||
        new Set(values).size !== values.length ||
        values.some((id) => !known.has(id))
      )
        fail(field);
    }
    if (drink.includedFoamId !== null && !foams.has(drink.includedFoamId))
      fail("includedFoamId");
  }
  // The retained HTML/SVG presentation uses plain catalog text, never markup.
  function checkText(value) {
    if (typeof value === "string" && /[<>"]/.test(value))
      fail(
        "catalog fields must be plain text without HTML/attribute delimiters",
      );
    if (value && typeof value === "object")
      Object.values(value).forEach(checkText);
  }
  checkText(catalog);
  return catalog;
}
