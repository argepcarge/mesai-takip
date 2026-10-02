const CACHE_NAME = 'mesai-pwa-v6';

const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './jspdf.umd.min.js',
  './jspdf.plugin.autotable.min.js',
  './Carlito-Regular.ttf',
  './Carlito-Bold.ttf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(assets.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });

    // Arkada ağdan yenile; yeni sürüm bir sonraki açılışta gelir
    const network = fetch(req).then(res => {
      if (res && res.ok && res.status === 200) cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    if (cached) return cached;

    const res = await network;
    if (res) return res;
    if (req.mode === 'navigate') return cache.match('./index.html');
    return Response.error();
  })());
});
