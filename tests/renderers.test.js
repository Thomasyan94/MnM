import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
const fileFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  const parsed = new URL(url);
  if (parsed.protocol === "file:")
    return new Response(
      await readFile(new URL("../public/data/catalog.json", import.meta.url)),
      { headers: { "Content-Type": "application/json" } },
    );
  return fileFetch(url, options);
};
const { catalog, toLegacyDrinks, toSelection } =
  await import("../src/data/catalog-runtime.js");
const { store } = await import("../src/state/store.js");
const { cup } = await import("../src/renderers/cup.js");
const { calculateQuote } = await import("../src/domain/pricing.js");
await import("../src/controllers/bootstrap.js"); // verifies complete module graph without DOM startup
store.menu = toLegacyDrinks(catalog);
test("all drinks and allowed milk/foam combinations keep valid visuals and prices", async () => {
  let cases = 0;
  const assets = new Set();
  for (const record of catalog.drinks) {
    const drink = store.menu.find((d) => d.id === record.id);
    for (let milk = 0; milk < 4; milk++)
      for (const foam of record.allowedFoamIds) {
        const tops = record.allowedToppingIds
          .filter((id) => !record.includedToppingIds.includes(id))
          .slice(0, 3);
        const state = { size: 1, milk, tops, foam, sugar: 30, ice: 1 };
        const html = cup(drink, state);
        assert(!html.includes("undefined"), "undefined visual: " + record.id);
        const quote = calculateQuote(catalog, record.id, toSelection(state));
        assert(Number.isSafeInteger(quote.totalCents));
        for (const m of html.matchAll(/(?:src|href)="assets\/([^"#]+)"/g))
          assets.add(m[1]);
        cases++;
      }
  }
  for (const asset of assets)
    await access(new URL("../public/assets/" + asset, import.meta.url));
  assert(cases >= 600);
  console.log(
    cases + " drink/milk/foam cases; " + assets.size + " assets resolved",
  );
});
