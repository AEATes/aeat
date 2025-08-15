const CACHE_NAME = "pwa-cache-v1-1755278217";
const CORE_ASSETS = ["./","./index.htm","./manifest.json","./icon-192.png","./icon-512.png","./icon-512-maskable.png"];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (new URL(req.url).origin === location.origin) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return resp;
      }).catch(() => caches.match('index.htm')))
    );
  }
});