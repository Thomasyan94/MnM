import { mochaCup } from "./mocha-cup.js";
import { catalogAssets, photoDefs } from "../config/visual-assets.js";
import { catalogCup, catalogLegacyCup } from "./catalog-cup.js";
import { vectorCup } from "./vector-cup.js";
export function cup(d, conf = {}, animate = false) {
  if (d.id === "1-3") return mochaCup(conf);
  if (catalogAssets[d.id]) return catalogCup(d, conf);
  const asset = photoDefs[d.id];
  if (!asset) return vectorCup(d, conf, animate);
  return catalogLegacyCup(d, conf, asset);
}
