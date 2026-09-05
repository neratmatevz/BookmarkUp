/**
 * The search engines offered in Settings → Behavior → Search engine behavior.
 * Shared so the popup (which renders a toggle per engine) and the service
 * worker (which matches the current tab's host) use the exact same list.
 *
 * Each engine's `pattern` is tested against a page's hostname. `(^|\.)` lets it
 * match the bare domain and any subdomain; the trailing `[a-z.]{2,}` accepts
 * country TLDs (google.com, google.si, google.co.uk, …).
 */
export const SEARCH_ENGINES = [
  { id: "google", label: "Google", home: "https://www.google.com", pattern: /(^|\.)google\.[a-z.]{2,}$/ },
  { id: "bing", label: "Bing", home: "https://www.bing.com", pattern: /(^|\.)bing\.com$/ },
  { id: "duckduckgo", label: "DuckDuckGo", home: "https://duckduckgo.com", pattern: /(^|\.)duckduckgo\.com$/ },
  { id: "brave", label: "Brave Search", home: "https://search.brave.com", pattern: /(^|\.)search\.brave\.com$/ },
  { id: "yahoo", label: "Yahoo", home: "https://search.yahoo.com", pattern: /(^|\.)yahoo\.[a-z.]{2,}$/ },
  { id: "ecosia", label: "Ecosia", home: "https://www.ecosia.org", pattern: /(^|\.)ecosia\.org$/ },
  { id: "startpage", label: "Startpage", home: "https://www.startpage.com", pattern: /(^|\.)startpage\.com$/ },
  { id: "yandex", label: "Yandex", home: "https://yandex.com", pattern: /(^|\.)yandex\.[a-z.]{2,}$/ },
];

/**
 * The search engine a hostname belongs to, or null. Accepts a raw hostname
 * (e.g. "www.google.com").
 */
export function matchEngine(hostname) {
  if (!hostname) return null;
  const host = hostname.toLowerCase();
  return SEARCH_ENGINES.find((engine) => engine.pattern.test(host)) ?? null;
}
