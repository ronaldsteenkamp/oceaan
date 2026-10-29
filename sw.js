// Service worker: maakt de oceaan installeerbaar en speelbaar zonder internet.
const VERSION = "b251670d5a";
const SHELL = `oceaan-shell-${VERSION}`;
const SHELL_FILES = ["./", "index.html", "spelen.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "fonts/caveat-600.woff2", "fonts/dmmono-400.woff2", "fonts/dmmono-500.woff2", "fonts/figtree.woff2"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      // old app versions, and the old cache of Google fonts (the fonts now come with the app)
      .then(keys => Promise.all(keys.filter(k => (k.startsWith("oceaan-shell-") && k !== SHELL) || k.startsWith("oceaan-fonts-")).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin !== location.origin) return;

  // de app zelf: netwerk eerst, zodat updates binnenkomen; de cache als je offline bent
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(async () =>
        (await caches.match(req, { ignoreSearch: true })) ||
        (req.mode === "navigate" ? caches.match("spelen.html") : Response.error()))
  );
});
