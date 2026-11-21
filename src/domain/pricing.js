const find = (rows, id, type) => {
  const value = rows.find((row) => row.id === id);
  if (!value) throw new Error("Unknown " + type + ": " + id);
  return value;
};
export function calculateQuote(catalog, drinkId, selection) {
  const drink = find(catalog.drinks, drinkId, "drink");
  if (!selection || !Array.isArray(selection.toppingIds))
    throw new Error("Invalid selection");
  const toppingIds = selection.toppingIds;
  if (toppingIds.length > 3 || new Set(toppingIds).size !== toppingIds.length)
    throw new Error("Choose at most three unique toppings");
  if (
    ![0, 30, 50, 70, 100].includes(selection.sugar) ||
    ![0, 1, 2].includes(selection.ice)
  )
    throw new Error("Invalid sugar or ice");
  const size = find(catalog.sizes, selection.sizeId, "size");
  const milk = find(catalog.milks, selection.milkId, "milk");
  if (!drink.allowedFoamIds.includes(selection.foamId))
    throw new Error("Foam is not available for this drink");
  const foam = find(catalog.foams, selection.foamId, "foam");
  const lines = [
    { id: drink.id, kind: "drink", amountCents: drink.priceCents },
    { id: size.id, kind: "size", amountCents: size.priceCents },
    { id: milk.id, kind: "milk", amountCents: milk.priceCents },
    { id: foam.id, kind: "foam", amountCents: foam.priceCents },
  ];
  for (const id of toppingIds) {
    if (
      !drink.allowedToppingIds.includes(id) ||
      drink.includedToppingIds.includes(id)
    )
      throw new Error("Topping unavailable or already included: " + id);
    lines.push({
      id,
      kind: "topping",
      amountCents: find(catalog.toppings, id, "topping").priceCents,
    });
  }
  return {
    currency: catalog.currency,
    totalCents: lines.reduce((sum, line) => sum + line.amountCents, 0),
    lines,
  };
}
