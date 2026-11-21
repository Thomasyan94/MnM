import { $ } from "../lib/dom.js";
import { store } from "../state/store.js";
import { name, pick } from "../i18n/locale.js";
import {
  catalog,
  foamDefs,
  ingredients,
  milks,
} from "../data/catalog-runtime.js";
import { money } from "../lib/money.js";
import { copy } from "../i18n/copy.js";
import { submitOrder } from "../services/order-service.js";
import { toast } from "./feedback.js";
export function updateCount() {
  $("#count").textContent = store.cart.reduce((a, x) => a + x.qty, 0);
}
export function cartTotal() {
  return store.cart.reduce((a, x) => a + x.unit * x.qty, 0);
}
export function recipe(item) {
  let s = item.state;
  return [
    (s.size ? "750" : "500") + "ml",
    pick(milks[s.milk][0]),
    ...s.tops.map((k) => pick(ingredients[k][0])),
    s.foam === "none" ? "" : pick(foamDefs[s.foam][0]),
    s.sugar + "% " + pick(["额外糖", "added sugar", "gula tambahan"]),
    pick([
      ["去冰", "少冰", "正常冰"][s.ice],
      ["No ice", "Less ice", "Regular ice"][s.ice],
      ["Tiada ais", "Sedikit ais", "Ais biasa"][s.ice],
    ]),
  ]
    .filter(Boolean)
    .join(" · ");
}
export function renderCart() {
  let el = $("#cart-content");
  if (!store.cart.length) {
    el.innerHTML = `<div class="empty">♡<br>${pick(["购物袋还是空的，去搭一杯喜欢的吧。", "Your bag is waiting for a little happiness.", "Beg anda menanti minuman kegemaran."])}</div><button class="primary wide" id="continue">${pick(["继续探索", "Explore drinks", "Terokai minuman"])}</button>`;
    $("#continue").onclick = () => $("#cart-dialog").close();
    return;
  }
  el.innerHTML =
    store.cart
      .map(
        (item, i) =>
          `<div class="cart-item"><h3>${name(store.menu.find((x) => x.id === item.id))}</h3><p>${recipe(item)}</p><div class="cart-actions"><span><button data-qty="-1" data-item="${i}" aria-label="Decrease quantity">−</button> ${item.qty} <button data-qty="1" data-item="${i}" aria-label="Increase quantity">+</button></span><strong>${money(item.unit * item.qty)}</strong><button data-remove="${i}">${pick(["删除", "Remove", "Padam"])}</button></div></div>`,
      )
      .join("") +
    `<div class="cart-total"><span>${pick(["合计", "Total", "Jumlah"])}</span><strong>${money(cartTotal())}</strong></div><p class="demo-note">${pick(copy.demo)}</p><button class="primary wide" id="checkout">${pick(["检查并模拟结账", "Continue to demo checkout", "Teruskan pembayaran demo"])}</button>`;
  $("#checkout").onclick = renderCheckout;
}
export function renderCheckout() {
  $("#cart-content").innerHTML =
    `<p>${pick(["确认你的搭配，完成示范订单。", "One last look at your creation.", "Semak ciptaan anda sebelum mengesahkan."])}</p>${store.cart.map((x) => `<div class="cart-item"><h3>${name(store.menu.find((d) => d.id === x.id))} × ${x.qty}</h3><p>${recipe(x)}</p></div>`).join("")}<form id="checkout-form"><label class="checkout-label">${pick(["取餐称呼（可填写昵称）", "Pickup name (a nickname is fine)", "Nama pengambilan (nama samaran dibenarkan)"])}<input id="pickup-name" maxlength="50" required autocomplete="off" placeholder="${pick(["例如：Thomas", "e.g. Thomas", "cth. Thomas"])}"></label><div class="cart-total"><span>${pick(["合计", "Total", "Jumlah"])}</span><strong>${money(cartTotal())}</strong></div><p class="demo-note">${pick(copy.demo)} ${pick(["无需支付信息。", "No payment details needed.", "Maklumat bayaran tidak diperlukan."])}</p><button class="primary wide" type="submit">${pick(["确认模拟订单", "Confirm demo order", "Sahkan pesanan demo"])}</button></form><button class="reset" id="back-cart">${pick(["返回购物袋", "Back to bag", "Kembali ke beg"])}</button>`;
  $("#back-cart").onclick = renderCart;
  $("#checkout-form").onsubmit = async (e) => {
    e.preventDefault();
    let who = $("#pickup-name").value.trim();
    if (!who) return;
    const submit = $("#checkout-form button[type=submit]");
    submit.disabled = true;
    let receipt;
    try {
      receipt = await submitOrder(store.cart, who, catalog);
    } catch (error) {
      submit.disabled = false;
      toast(
        pick([
          "模拟订单未完成，请重试。",
          "Demo order failed. Please retry.",
          "Pesanan demo gagal. Sila cuba lagi.",
        ]),
      );
      return;
    }
    let amount = receipt.totalCents / 100,
      num = receipt.orderId;
    $("#cart-content").innerHTML =
      `<div class="success"><div class="success-icon">✳</div><h3>${pick(["你的好心情，搭配完成！", "Your happy cup is ready!", "Minuman anda sudah siap!"])}</h3><p id="thanks-name"></p><p>${num} · ${money(amount)}</p><p class="demo-note">${pick(copy.demo)}</p><button class="primary" id="done">${pick(["再调一杯", "Mix another cup", "Cipta minuman lagi"])}</button></div>`;
    $("#thanks-name").textContent =
      pick(["谢谢你，", "Thank you, ", "Terima kasih, "]) + who;
    store.cart = [];
    updateCount();
    $("#done").onclick = () => $("#cart-dialog").close();
    for (let i = 0; i < 45; i++) {
      let c = document.createElement("i");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = ["#e9afc1", "#8aa468", "#e2bd6e"][i % 3];
      c.style.animationDelay = Math.random() * 0.5 + "s";
      document.body.append(c);
      setTimeout(() => c.remove(), 3200);
    }
  };
}
