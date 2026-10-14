const CACHE = "mon-renfo-v2";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting() });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim() });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const save = r => { if (r && (r.ok || r.type === "opaque")) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)) } return r };
  // Page : réseau d'abord pour recevoir les mises à jour, cache si hors connexion
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(save).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(save)));
});
