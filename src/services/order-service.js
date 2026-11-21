import { appConfig } from "../config/app-config.js";
import { toSelection } from "../data/catalog-runtime.js";
import { createOrderRepository } from "../repositories/order-repository.js";
const repository = createOrderRepository(appConfig);
export function submitOrder(cart, pickupName, catalog) {
  // Send IDs and quantities, never trust client-supplied cached prices.
  return repository.createDemoOrder(
    {
      pickupName: pickupName.trim(),
      items: cart.map((item) => ({
        drinkId: item.id,
        quantity: item.qty,
        selection: toSelection(item.state),
      })),
    },
    catalog,
  );
}
