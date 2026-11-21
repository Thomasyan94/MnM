// Public browser configuration only. No database or service-role credentials here.
export const appConfig = Object.freeze({
  catalogSource: "local", // 'local' or 'api'
  orderSource: "demo", // 'demo' or 'api'; API endpoint must itself be demo-only
  apiBaseUrl: "/api/",
});
