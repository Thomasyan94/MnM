import { $ } from "../lib/dom.js";
import { store } from "../state/store.js";
export function toast(s) {
  $("#toast").textContent = s;
  $("#toast").classList.add("show");
  clearTimeout(store.toastTimer);
  store.toastTimer = setTimeout(
    () => $("#toast").classList.remove("show"),
    2400,
  );
}
export function flyToBag() {
  const host = matchMedia("(max-width:680px)").matches
    ? document.querySelector(".float-cup")
    : document.querySelector("#drink-cup");
  const src =
    host?.querySelector("svg") || host?.querySelector(".product-photo");
  if (!src || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = src.getBoundingClientRect(),
    target = document.querySelector("#bag").getBoundingClientRect();
  const clone = src.cloneNode(true);
  clone.removeAttribute("id");
  Object.assign(clone.style, {
    position: "fixed",
    left: r.left + "px",
    top: r.top + "px",
    width: r.width + "px",
    height: r.height + "px",
    zIndex: 150,
    pointerEvents: "none",
    margin: 0,
    objectFit: "contain",
  });
  document.body.append(clone);
  const anim = clone.animate(
    [
      {
        transform: "translate(0,0) scale(1)",
        opacity: 1,
      },
      {
        transform: `translate(${target.left + target.width / 2 - r.left - r.width / 2}px,${target.top + target.height / 2 - r.top - r.height / 2}px) scale(.08) rotate(14deg)`,
        opacity: 0.2,
      },
    ],
    {
      duration: 780,
      easing: "cubic-bezier(.45,.05,.22,1)",
      fill: "forwards",
    },
  );
  anim.finished.then(() => clone.remove());
}
