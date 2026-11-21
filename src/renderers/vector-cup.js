import { store } from "../state/store.js";
import { baseExtras } from "../controllers/drink-controller.js";
import { ingredients } from "../data/catalog-runtime.js";
export function colors(d) {
  let bottom = d.cat === 0 ? "#bd8d54" : d.cat === 1 ? "#ab734c" : "#789653",
    top = d.cat === 2 ? "#709351" : d.cat === 1 ? "#b98862" : "#d8b48c";
  if (/Strawberry/.test(d.en)) bottom = "#db8391";
  if (/Blueberry/.test(d.en)) bottom = "#8d6a9b";
  if (/Taro/.test(d.en)) bottom = "#b4a0cb";
  if (/Thai/.test(d.en)) top = "#d78745";
  if (/Americano|Cold Brew/.test(d.en)) top = "#704b37";
  if (/Pistachio/.test(d.en)) top = "#adb580";
  return [bottom, top];
}
export function vectorCup(d, conf = {}, animate = false) {
  let id = "cup" + store.uid++,
    cs = colors(d),
    extras = baseExtras(d);
  let bits = [...extras.filter((x) => x !== "basefoam"), ...(conf.tops || [])];
  let hasFoam =
    (conf.foam && conf.foam !== "none") || extras.includes("basefoam");
  let milkTint =
    conf.milk > 0 ? ["", "#ead6b5", "#f1e8d1", "#e3d7b9"][conf.milk] : null;
  let dots = bits
    .map((key, j) => {
      let color = ingredients[key]?.[2] || "#412c24";
      return `<g class="${animate ? "ingredient-pop" : ""}" style="animation-delay:${j * 0.06}s">${Array.from(
        {
          length: key === "shot" ? 5 : 12,
        },
        (_, i) => {
          let x = 89 + ((i * 31 + j * 13) % 120),
            y = 300 + Math.floor(i / 4) * 13 - j * 11;
          return [
            "coconut",
            "jelly",
            "pudding",
            "egg",
            "choc",
            "taro",
          ].includes(key)
            ? `<rect x="${x}" y="${y}" width="12" height="11" rx="3" fill="${color}" transform="rotate(${i * 11} ${x} ${y})"/>`
            : `<circle cx="${x}" cy="${y}" r="${key === "mochi" ? 10 : 6}" fill="${color}"/><circle cx="${x - 2}" cy="${y - 2}" r="1.5" fill="#ffffff50"/>`;
        },
      ).join("")}</g>`;
    })
    .join("");
  let ice = conf.ice === 0 ? 0 : conf.ice === 1 ? 3 : 6;
  return `<svg viewBox="0 0 300 410" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${d.en}"><defs><linearGradient id="${id}glass" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".65"/><stop offset=".28" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".65"/></linearGradient><linearGradient id="${id}liquid" x1="0" y1="1" x2="0" y2="0"><stop stop-color="${cs[0]}"/><stop offset=".4" stop-color="${milkTint || "#efe6cd"}"/><stop offset=".7" stop-color="${cs[1]}"/></linearGradient><clipPath id="${id}clip"><path d="M65 85L87 359Q150 381 213 359L235 85Z"/></clipPath></defs><ellipse cx="150" cy="383" rx="66" ry="8" fill="#253f2e12"/><path d="M162 15L183 12L171 202L154 200Z" fill="#f2c0cb" stroke="#c4899c" stroke-width="1.3"/><path d="M174 15L163 195" stroke="#fff8" stroke-width="3"/><path d="M65 85L87 359Q150 381 213 359L235 85Z" fill="#fff4" stroke="#fff9" stroke-width="2"/><g clip-path="url(#${id}clip)"><rect x="62" y="112" width="180" height="265" fill="url(#${id}liquid)"/><path d="M65 135Q150 112 238 133V118Q150 99 65 118Z" fill="${cs[1]}"/><path d="M78 113Q95 180 85 237M219 120Q209 166 219 205M102 115Q111 151 106 175" stroke="${cs[0]}" stroke-width="9" opacity=".4" fill="none"/>${Array.from(
    {
      length: ice,
    },
    (_, i) =>
      `<rect x="${85 + (i % 3) * 43}" y="${128 + Math.floor(i / 3) * 36}" width="31" height="28" rx="7" fill="#fff4" stroke="#fff5" transform="rotate(${i % 2 ? 15 : -12} ${100 + (i % 3) * 43} ${140 + Math.floor(i / 3) * 36})"/>`,
  ).join(
    "",
  )}${dots}${hasFoam ? `<g class="${animate ? "ingredient-pop" : ""}"><path d="M64 132Q79 96 101 114Q117 86 137 109Q154 87 176 109Q203 90 235 124L235 149Q161 169 64 148Z" fill="${conf.foam === "taro" || d.en.includes("Taro Cloud") ? "#c9b7dc" : "#fff4dc"}"/><path d="M76 139Q150 153 222 139" stroke="#e6d6b6" fill="none" stroke-width="2"/></g>` : ""}<path d="M76 100L95 354Q150 371 205 353L226 100" fill="url(#${id}glass)"/><path d="M84 145L99 326" stroke="#fff" opacity=".45" stroke-width="6" stroke-linecap="round"/></g><ellipse cx="150" cy="85" rx="88" ry="15" fill="#fefbf3b0" stroke="#fff" stroke-width="3"/><ellipse cx="150" cy="82" rx="80" ry="10" fill="#eee7ce70"/><path d="M62 85L85 360Q150 386 215 360L238 85" stroke="#fff9" stroke-width="2" fill="none"/></svg>`;
}
