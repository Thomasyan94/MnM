import { mochaMilkAssets } from "../config/visual-assets.js";
import { product, resetState, store } from "../state/store.js";
import { changeDrink, total, updateState } from "./drink-controller.js";
import { flyToBag, toast } from "../ui/feedback.js";
import { pick } from "../i18n/locale.js";
import { renderOptions } from "../ui/options.js";
import { applyLanguage, render, renderCup, renderDetails } from "../ui/menu.js";
import { renderCart, updateCount } from "../ui/cart.js";
import { $ } from "../lib/dom.js";
import { toppingIds } from "../data/catalog-runtime.js";
export const warmedMilkPhotos = new Set();
export function warmMilkPhotos(milk) {
  const a = mochaMilkAssets[milk];
  if (!a) return;
  for (const file of [a.base, a.full]) {
    if (warmedMilkPhotos.has(file)) continue;
    warmedMilkPhotos.add(file);
    const im = new Image();
    im.decoding = "async";
    im.src = "assets/" + file;
  }
}
export function bindEvents() {
  document.addEventListener("click", (e) => {
    let b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.cat !== undefined) {
      store.cat = +b.dataset.cat;
      store.index = [0, 3, 1][store.cat];
      changeDrink(store.index);
    }
    if (b.dataset.index !== undefined) changeDrink(+b.dataset.index);
    if (b.dataset.size !== undefined) updateState("size", +b.dataset.size);
    if (b.dataset.milk !== undefined) updateState("milk", +b.dataset.milk);
    if (b.dataset.foam !== undefined) updateState("foam", b.dataset.foam);
    if (b.dataset.sugar !== undefined) updateState("sugar", +b.dataset.sugar);
    if (b.dataset.ice !== undefined) updateState("ice", +b.dataset.ice);
    if (b.dataset.top) {
      let k = b.dataset.top;
      if (store.state.tops.includes(k))
        store.state.tops = store.state.tops.filter((x) => x !== k);
      else if (store.state.tops.length < 3) store.state.tops.push(k);
      else
        return toast(
          pick([
            "最多选择 3 种额外配料",
            "Choose up to 3 extras",
            "Pilih maksimum 3 tambahan",
          ]),
        );
      renderOptions();
      renderDetails();
      renderCup(
        false,
        pick([
          "正在调出你的好心情。",
          "Mixing a little happiness.",
          "Mencampur sedikit kegembiraan.",
        ]),
      );
    }
    if (b.dataset.remove !== undefined) {
      store.cart.splice(+b.dataset.remove, 1);
      updateCount();
      renderCart();
    }
    if (b.dataset.qty) {
      let item = store.cart[+b.dataset.item];
      item.qty += +b.dataset.qty;
      if (item.qty < 1) store.cart.splice(+b.dataset.item, 1);
      updateCount();
      renderCart();
    }
  });
  $("#lang").onchange = (e) => {
    store.lang = e.target.value;
    applyLanguage();
  };
  $("#prev").onclick = () => changeDrink(store.index - 1);
  $("#next").onclick = () => changeDrink(store.index + 1);
  $("#reset").onclick = () => {
    resetState();
    render();
  };
  let touchX = 0;
  let touchY = 0;
  $(".cup-scene").addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].screenX;
      touchY = e.changedTouches[0].screenY;
    },
    {
      passive: true,
    },
  );
  $(".cup-scene").addEventListener(
    "touchend",
    (e) => {
      let dx = e.changedTouches[0].screenX - touchX,
        dy = e.changedTouches[0].screenY - touchY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy))
        changeDrink(store.index + (dx < 0 ? 1 : -1));
    },
    {
      passive: true,
    },
  );
  $("#add").onclick = () => {
    flyToBag();
    store.cart.push({
      id: product().id,
      state: structuredClone(store.state),
      unit: total(),
      qty: 1,
    });
    updateCount();
    toast(
      pick([
        "搭配好了！已加入购物袋。",
        "Your happy cup is in the bag!",
        "Minuman anda telah ditambah!",
      ]),
    );
    $("#bag").classList.remove("bump");
    void $("#bag").offsetWidth;
    $("#bag").classList.add("bump");
  };
  $("#bag").onclick = () => {
    renderCart();
    $("#cart-dialog").showModal();
  };
  $("#close-cart").onclick = () => $("#cart-dialog").close();
  $("#cart-dialog").addEventListener("click", (e) => {
    if (e.target === $("#cart-dialog")) {
      let r = e.target.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        e.target.close();
    }
  });
  // Marshmallows are a coffee-category topping; the mocha preview highlights its three designed ingredients.
  toppingIds[1].push("marshmallow");
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-mocha-loaded]")) {
      store.state.tops = ["marshmallow", "choc"];
      store.state.foam = "whip";
      renderOptions();
      renderDetails();
      renderCup();
    }
    if (e.target.closest("[data-mocha-base]")) {
      store.state.tops = [];
      store.state.foam = "none";
      renderOptions();
      renderDetails();
      renderCup();
    }
  });
  document.querySelector("#milks").addEventListener("pointerover", (e) => {
    const b = e.target.closest("[data-milk]");
    if (b && product()?.id === "1-3") warmMilkPhotos(+b.dataset.milk);
  });
}
