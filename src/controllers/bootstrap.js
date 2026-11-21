import { resetState, store } from "../state/store.js";
import {
  catalog,
  foamIds,
  toLegacyDrinks,
  toppingIds,
} from "../data/catalog-runtime.js";
import { installMobilePreview } from "../ui/mobile-preview.js";
import { bindEvents } from "./events.js";
import { $ } from "../lib/dom.js";
import { cup } from "../renderers/cup.js";
import { applyLanguage, render } from "../ui/menu.js";
import { baseExtras } from "./drink-controller.js";
import { toast } from "../ui/feedback.js";
import { pick } from "../i18n/locale.js";
export async function init() {
  try {
    store.menu = toLegacyDrinks(catalog);
    installMobilePreview();
    resetState();
    bindEvents();
    $("#hero-cup").innerHTML = cup(
      store.menu.find((x) => x.id === "1-3"),
      {
        tops: ["marshmallow", "choc"],
        foam: "whip",
        ice: 2,
      },
    );
    applyLanguage();
    let h = location.hash;
    if (h.startsWith("#drink-")) {
      let d = store.menu.find((x) => "#drink-" + x.id === h);
      if (d) {
        store.cat = d.cat;
        store.index = store.menu
          .filter((x) => x.cat === d.cat)
          .findIndex((x) => x.id === d.id);
        const query = new URLSearchParams(location.search),
          flavor = query.get("milk");
        if (d.id === "1-3" && ["oat", "coconut"].includes(flavor))
          store.state.milk = flavor === "oat" ? 1 : 2;
        const allowed = catalog.drinks.find(
          (row) => row.id === d.id,
        ).allowedToppingIds;
        store.state.tops = [
          ...new Set((query.get("toppings") || "").split(",")),
        ]
          .filter((k) => allowed.includes(k) && !baseExtras(d).includes(k))
          .slice(0, 3);
        const foam = query.get("foam");
        if (
          catalog.drinks
            .find((row) => row.id === d.id)
            .allowedFoamIds.includes(foam)
        )
          store.state.foam = foam;
        render();
        $("#menu").scrollIntoView();
      }
    }
  } catch (e) {
    toast(
      pick([
        "菜单加载失败，请刷新重试。",
        "Menu could not load. Please refresh.",
        "Menu gagal dimuatkan. Sila muat semula.",
      ]),
    );
  }
}
/* A sticky mobile drink preview with independent price controls. */
