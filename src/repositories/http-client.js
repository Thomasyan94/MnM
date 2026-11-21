export async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Accept: "application/json", ...options.headers },
    signal: options.signal || AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("API request failed: " + response.status);
  return response.json();
}
export function apiUrl(baseUrl, path) {
  const base = new URL(
    baseUrl.endsWith("/") ? baseUrl : baseUrl + "/",
    location.href,
  );
  return new URL(path, base).href;
}
