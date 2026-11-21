import { readFile, writeFile } from "node:fs/promises";
import { validateCatalog } from "../src/domain/catalog.js";
const catalog = validateCatalog(
  JSON.parse(
    await readFile(new URL("../public/data/catalog.json", import.meta.url)),
  ),
);
const quote = (value) => "'" + String(value).replaceAll("'", "''") + "'";
const json = (value) => quote(JSON.stringify(value)) + "::jsonb";
const lines = [
  "-- PostgreSQL seed generated from public/data/catalog.json; REVIEW before applying.",
  "BEGIN;",
];
catalog.categories.forEach((row, i) =>
  lines.push(
    `INSERT INTO categories(id,name,sort_order) VALUES(${quote(row.id)},${json(row.name)},${i}) ON CONFLICT DO NOTHING;`,
  ),
);
for (const [group, kind] of [
  ["sizes", "size"],
  ["milks", "milk"],
  ["toppings", "topping"],
  ["foams", "foam"],
])
  catalog[group].forEach((row, i) => {
    const name =
      row.name ||
      Object.fromEntries(
        ["zh", "en", "ms"].map((key) => [key, row.volumeMl + "ml"]),
      );
    const metadata = Object.fromEntries(
      ["volumeMl", "color"]
        .filter((key) => key in row)
        .map((key) => [key, row[key]]),
    );
    lines.push(
      `INSERT INTO options(kind,id,name,price_cents,metadata,sort_order) VALUES(${quote(kind)},${quote(row.id)},${json(name)},${row.priceCents},${json(metadata)},${i}) ON CONFLICT DO NOTHING;`,
    );
  });
catalog.drinks.forEach((drink, i) => {
  lines.push(
    `INSERT INTO drinks(id,category_id,name,story,ingredients,price_cents,note,included_foam_id,sort_order) VALUES(${quote(drink.id)},${quote(drink.categoryId)},${json(drink.name)},${json(drink.story)},${json(drink.ingredients)},${drink.priceCents},${quote(drink.note || "")},${drink.includedFoamId ? quote(drink.includedFoamId) : "NULL"},${i}) ON CONFLICT DO NOTHING;`,
  );
  for (const [kind, field] of [
    ["topping", "allowedToppingIds"],
    ["foam", "allowedFoamIds"],
  ])
    drink[field].forEach((id, n) =>
      lines.push(
        `INSERT INTO drink_options(drink_id,option_kind,option_id,included,sort_order) VALUES(${quote(drink.id)},${quote(kind)},${quote(id)},${kind === "topping" && drink.includedToppingIds.includes(id)},${n}) ON CONFLICT DO NOTHING;`,
      ),
    );
});
lines.push("COMMIT;", "");
await writeFile(
  new URL("../database/seed.sql", import.meta.url),
  lines.join("\n"),
);
console.log("Generated database/seed.sql; no database contacted.");
