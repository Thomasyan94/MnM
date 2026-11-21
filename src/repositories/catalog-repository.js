import { requestJson, apiUrl } from "./http-client.js";
import { validateCatalog } from "../domain/catalog.js";
export function createCatalogRepository(config) {
  return {
    async getCatalog() {
      const url =
        config.catalogSource === "api"
          ? apiUrl(config.apiBaseUrl, "catalog")
          : new URL("../../data/catalog.json", import.meta.url);
      return validateCatalog(await requestJson(url));
    },
  };
}
