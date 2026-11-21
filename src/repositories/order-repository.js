import { priceOrder } from "../domain/order.js";
import { requestJson, apiUrl } from "./http-client.js";
export function createOrderRepository(config) {
  return {
    async createDemoOrder(request, catalog) {
      if (config.orderSource === "api") {
        const receipt = await requestJson(
          apiUrl(config.apiBaseUrl, "demo-orders"),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
          },
        );
        if (
          receipt?.simulated !== true ||
          receipt.currency !== "MYR" ||
          !Number.isSafeInteger(receipt.totalCents) ||
          receipt.totalCents < 0 ||
          !/^[A-Za-z0-9-]{1,80}$/.test(receipt.orderId)
        )
          throw new Error("Invalid demo receipt");
        return receipt;
      }
      const priced = priceOrder(catalog, request);
      return {
        orderId: "MNM-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
        currency: priced.currency,
        totalCents: priced.totalCents,
        simulated: true,
      };
    },
  };
}
