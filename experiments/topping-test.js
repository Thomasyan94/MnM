"use strict";
const choices = {
  grass: { label: "仙草", price: 1.5 },
  coffee: { label: "咖啡冻", price: 2 },
  pudding: { label: "焦糖布丁", price: 2 },
};
const selected = new Set();
function update() {
  let amount = 11.9;
  const labels = [];
  for (const [id, choice] of Object.entries(choices)) {
    const active = selected.has(id),
      button = document.querySelector(`[data-choice="${id}"]`);
    button.setAttribute("aria-pressed", String(active));
    button.querySelector(".check").textContent = active ? "✓" : "+";
    document.getElementById(id).classList.toggle("selected", active);
    if (active) {
      amount += choice.price;
      labels.push(choice.label);
    }
  }
  const text = labels.length ? labels.join("＋") : "未加额外配料";
  document.getElementById("price").textContent = `RM ${amount.toFixed(2)}`;
  document.getElementById("selection").textContent = text;
  document.getElementById("count").textContent = `${selected.size} / 3`;
  document.getElementById("preview-caption").textContent = labels.length
    ? text
    : "原配方 · 杯底已含黑糖珍珠";
  document
    .getElementById("cup")
    .setAttribute("aria-label", `黑糖珍珠鲜奶茶，${text}`);
}
document.querySelectorAll("[data-choice]").forEach((button) =>
  button.addEventListener("click", () => {
    const id = button.dataset.choice;
    selected.has(id) ? selected.delete(id) : selected.add(id);
    update();
  }),
);
document.getElementById("all").addEventListener("click", () => {
  Object.keys(choices).forEach((id) => selected.add(id));
  update();
});
document.getElementById("reset").addEventListener("click", () => {
  selected.clear();
  update();
});
update();
