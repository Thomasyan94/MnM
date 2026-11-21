import { name, pick } from "../i18n/locale.js";
import { product, store } from "../state/store.js";
import { categories } from "../data/catalog-runtime.js";
import { copy } from "../i18n/copy.js";
import { cup } from "../renderers/cup.js";
import { changeDrink } from "../controllers/drink-controller.js";
export /* A sticky mobile drink preview with independent price controls. */
function installMobilePreview() {
  const mq = matchMedia("(max-width: 680px)");
  const panel = document.createElement("aside");
  panel.id = "mobile-drink-float";
  panel.setAttribute("role", "region");
  panel.innerHTML =
    '<button class="float-cup" type="button"></button><div class="mobile-preview-info"><div class="float-name"></div><label class="mobile-drink-label" for="mobile-drink-picker"></label><select id="mobile-drink-picker"></select><span class="mobile-preview-hint"></span></div>';
  const dock = document.createElement("div");
  dock.id = "mobile-order-dock";
  dock.innerHTML =
    '<div class="mobile-order-row"><div><small class="mobile-total-label"></small><strong class="mobile-total" aria-live="polite"></strong></div><button class="primary mobile-order-add" type="button"></button></div>';
  const zoom = document.createElement("dialog");
  zoom.id = "mobile-drink-zoom";
  zoom.innerHTML =
    '<button class="zoom-close" type="button">×</button><h2></h2><div class="zoom-cup"></div><p></p>';
  document.querySelector(".studio").before(panel);
  document.body.append(dock, zoom);
  panel.hidden = dock.hidden = true;
  let inMenu = false,
    signature = "",
    frame = 0;
  const tr = (zh, en, ms) => pick([zh, en, ms]);
  const floatCup = panel.querySelector(".float-cup");
  const picker = panel.querySelector("select");
  const title = () => document.querySelector("#drink-title")?.textContent || "";
  function visibility() {
    const openDialog = !!document.querySelector("dialog[open]");
    const show = mq.matches && inMenu && !openDialog;
    panel.hidden = !mq.matches;
    dock.hidden = !show;
    panel.classList.toggle("dialog-obscured", openDialog);
    document.body.classList.toggle("mobile-floating-active", show);
  }
  function sync() {
    if (!store.menu.length) return;
    const current = product();
    if (!current) return;
    panel.setAttribute(
      "aria-label",
      tr("当前饮品预览", "Your drink preview", "Pratonton minuman anda"),
    );
    panel.querySelector(".mobile-preview-hint").textContent = tr(
      "点杯子放大 · 往下选配料",
      "Tap cup to enlarge · Customize below",
      "Tekan cawan · Pilih tambahan di bawah",
    );
    floatCup.setAttribute(
      "aria-label",
      tr("放大查看当前饮品", "Enlarge current drink", "Besarkan minuman"),
    );
    panel.querySelector(".float-name").textContent = title();
    panel.querySelector(".mobile-drink-label").textContent = tr(
      "换一杯",
      "Choose a drink",
      "Pilih minuman",
    );
    const menuSignature = store.lang;
    if (picker.dataset.language !== menuSignature) {
      picker.innerHTML = categories
        .map(
          (group, c) =>
            '<optgroup label="' +
            pick(group) +
            '">' +
            store.menu
              .filter((d) => d.cat === c)
              .map(
                (d) => '<option value="' + d.id + '">' + name(d) + "</option>",
              )
              .join("") +
            "</optgroup>",
        )
        .join("");
      picker.dataset.language = menuSignature;
    }
    picker.value = current.id;
    dock.querySelector(".mobile-total-label").textContent = tr(
      "这杯合计",
      "Your cup total",
      "Jumlah minuman",
    );
    dock.querySelector(".mobile-total").textContent =
      document.querySelector("#total").textContent;
    dock.querySelector(".mobile-order-add").textContent = pick(copy.add);
    const next = current.id + JSON.stringify(store.state) + store.lang;
    if (signature !== next) {
      const previous = new Set(
        [...floatCup.querySelectorAll("[data-part]")].map(
          (e) => e.dataset.part,
        ),
      );
      signature = next;
      floatCup.innerHTML = cup(current, store.state);
      const detailSvg = floatCup.querySelector(
        ".catalog-composite,.mocha-composite",
      );
      if (detailSvg) detailSvg.setAttribute("viewBox", "70 85 884 1380");
      floatCup.querySelectorAll("[data-part]").forEach((e) => {
        if (!previous.has(e.dataset.part)) e.classList.add("mocha-arrive");
      });
      if (zoom.open) renderZoom();
    }
    visibility();
  }
  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      sync();
    });
  }
  function renderZoom() {
    zoom.querySelector("h2").textContent = title();
    zoom.querySelector(".zoom-cup").innerHTML = cup(product(), store.state);
    zoom.querySelector("p").textContent =
      document.querySelector("#cup-caption").textContent;
    zoom
      .querySelector(".zoom-close")
      .setAttribute(
        "aria-label",
        tr("关闭放大预览", "Close enlarged preview", "Tutup pratonton besar"),
      );
  }
  floatCup.addEventListener("click", () => {
    renderZoom();
    zoom.showModal();
    visibility();
  });
  zoom
    .querySelector(".zoom-close")
    .addEventListener("click", () => zoom.close());
  zoom.addEventListener("click", (e) => {
    if (e.target === zoom) {
      const r = zoom.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        zoom.close();
    }
  });
  zoom.addEventListener("close", schedule);
  dock
    .querySelector(".mobile-order-add")
    .addEventListener("click", () => document.querySelector("#add").click());
  picker.addEventListener("change", () => {
    const d = store.menu.find((d) => d.id === picker.value);
    if (!d) return;
    store.cat = d.cat;
    changeDrink(
      store.menu
        .filter((x) => x.cat === store.cat)
        .findIndex((x) => x.id === d.id),
    );
    schedule();
  });
  new MutationObserver(schedule).observe(document.querySelector("#drink-cup"), {
    childList: true,
  });
  new MutationObserver(schedule).observe(document.querySelector("#total"), {
    childList: true,
    subtree: true,
    characterData: true,
  });
  new MutationObserver(schedule).observe(
    document.querySelector("#cart-dialog"),
    {
      attributes: true,
      attributeFilter: ["open"],
    },
  );
  const io = new IntersectionObserver(
    (entries) => {
      inMenu = entries[0].isIntersecting;
      schedule();
    },
    {
      threshold: 0,
      rootMargin: "-73px 0px -75px 0px",
    },
  );
  io.observe(document.querySelector("#menu"));
  document.querySelector("#lang").addEventListener("change", schedule);
  mq.addEventListener("change", schedule);
  window.addEventListener("resize", schedule);
  window.visualViewport?.addEventListener("resize", schedule);
  schedule();
}
