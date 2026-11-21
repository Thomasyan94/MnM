import { calculateQuote } from "./pricing.js";
export function priceOrder(catalog, request) {
  if (
    !request ||
    typeof request.pickupName !== "string" ||
    !request.pickupName.trim() ||
    request.pickupName.length > 50
  )
    throw new Error("Invalid pickup name");
  if (
    !Array.isArray(request.items) ||
    !request.items.length ||
    request.items.length > 100
  )
    throw new Error("Invalid order items");
  let totalCents = 0;
  const items = request.items.map((item) => {
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    )
      throw new Error("Invalid quantity");
    const quote = calculateQuote(catalog, item.drinkId, item.selection);
    totalCents += quote.totalCents * item.quantity;
    return {
      ...item,
      unitPriceCents: quote.totalCents,
      drinkName: catalog.drinks.find((d) => d.id === item.drinkId).name,
    };
  });
  if (!Number.isSafeInteger(totalCents))
    throw new Error("Order total overflow");
  return { currency: "MYR", totalCents, items };
}
