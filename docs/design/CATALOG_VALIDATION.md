# Complete drink catalog upgrade

26 independent drink images and 9 reusable food topping images generated with the built-in image tool. Prompts are preserved in catalog-prompts.json; browser-ready high-resolution WebP assets in dist/assets/. Original generated PNG files are retained locally in source-images/ and excluded from the Git upload.

- 30 menu entries have photographic artwork, with no vector fallback used for the current menu.
- Original approved mocha artwork and its milk variants are retained.
- Mobile sticky preview and desktop two-column layout retained.
- Reusable toppings are rendered as independent food layers and cards. Flavor variations use display filters.
- Cappuccino, cold brew, creme brulee, pistachio, salted cloud matcha and taro cloud matcha include their original foam.
- Recommendations and illustrative flavor scales vary by drink.
- 628 drink/milk/foam combinations validated for render output, local references and prices by scripts/check-catalog.cjs.
- Browser QA: all 30 drinks switched through the native mobile picker; taro milk tea with three toppings and cream, blueberry matcha with mochi and mango pearls, zoom dialogs, English labels and cart totals checked.

Limits: photographic ice is illustrative; changing the ice-level order option does not reconstruct ice inside the base photo. Milk alternatives outside the custom mocha images use composited milk tinting. Salt/vanilla/sweet cream share the same base cream texture. Orders and payment remain simulated.
