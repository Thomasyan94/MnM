import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateCatalog } from "../src/domain/catalog.js";
import { calculateQuote } from "../src/domain/pricing.js";
import { priceOrder } from "../src/domain/order.js";
import { createOrderRepository } from "../src/repositories/order-repository.js";
const catalog = JSON.parse(
  await readFile(new URL("../public/data/catalog.json", import.meta.url)),
);
const selection = {
  sizeId: "medium",
  milkId: "original",
  toppingIds: [],
  foamId: "none",
  sugar: 50,
  ice: 2,
};
test("catalog validates all 30 drinks with stable relations", () => {
  assert.equal(validateCatalog(catalog).drinks.length, 30);
});
test("prices use exact integer cents including size, milk and multiple extras", () => {
  assert.equal(
    calculateQuote(catalog, "0-0", {
      ...selection,
      sizeId: "large",
      milkId: "oat",
      toppingIds: ["grass", "jelly", "pudding"],
      foamId: "cream",
    }).totalCents,
    2540,
  );
});
test("already included, duplicate and incompatible toppings are rejected", () => {
  for (const toppingIds of [
    ["brown"],
    ["grass", "grass"],
    ["lemon"],
    ["grass", "jelly", "pudding", "pearl"],
  ])
    assert.throws(() =>
      calculateQuote(catalog, "0-0", { ...selection, toppingIds }),
    );
  assert.throws(() =>
    calculateQuote(catalog, "1-3", { ...selection, foamId: "cream" }),
  );
  assert.throws(() =>
    calculateQuote(catalog, "0-0", { ...selection, sugar: 90 }),
  );
});
test("catalog rejects corrupt prices, broken relationships and unsafe markup", () => {
  for (const mutate of [
    (c) => (c.drinks[0].priceCents = 1.2),
    (c) => (c.drinks[0].categoryId = "missing"),
    (c) => (c.drinks[0].name.en = "<img src=x>"),
    (c) => (c.toppings[0].id = c.toppings[1].id),
  ]) {
    const bad = structuredClone(catalog);
    mutate(bad);
    assert.throws(() => validateCatalog(bad));
  }
});
test("order reprices every item and ignores submitted prices", () => {
  const request = {
    pickupName: "Thomas",
    items: [
      {
        drinkId: "0-0",
        quantity: 2,
        unitPriceCents: 1,
        selection: { ...selection, toppingIds: ["pudding"] },
      },
    ],
  };
  assert.equal(priceOrder(catalog, request).totalCents, 2780);
  assert.throws(() =>
    priceOrder(catalog, {
      ...request,
      items: [{ ...request.items[0], quantity: -1 }],
    }),
  );
});
test("demo order produces no payment or network request", async () => {
  const receipt = await createOrderRepository({
    orderSource: "demo",
  }).createDemoOrder(
    {
      pickupName: "Thomas",
      items: [{ drinkId: "0-0", quantity: 1, selection }],
    },
    catalog,
  );
  assert.equal(receipt.simulated, true);
  assert.equal(receipt.totalCents, 1190);
});
