const CACHE_NAME = 'mesai-pwa-v7';
const INDEX = './index.html';

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

function isPage(req) {
  if (req.mode === 'navigate') return true;
  const path = new URL(req.url).pathname;
  return path.endsWith('/') || path.endsWith('/index.html');
}

// Sayfa: önce internetten al (hep en yeni), internet yoksa ya da yavaşsa önbellekten ver.
// Gelen taze kopya hem './' hem './index.html' anahtarına yazılır, iki kopya hep aynı kalır.
function pageNetworkFirst(event) {
  const req = event.request;

  const fresh = fetch(req.url, { cache: 'no-cache' }).then(async res => {
    if (res && res.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(req, res.clone());
      await cache.put(INDEX, res.clone());
    }
    return res;
  });
  event.waitUntil(fresh.catch(() => {}));

  const timeout = new Promise(resolve => setTimeout(() => resolve(null), 4000));

  return (async () => {
    const res = await Promise.race([fresh.catch(() => null), timeout]);
    if (res && res.ok) return res;

    const cache = await caches.open(CACHE_NAME);
    const cached = (await cache.match(req, { ignoreSearch: true })) || (await cache.match(INDEX));
    if (cached) return cached;

    // Önbellekte de yoksa internetin gelmesini bekle
    const late = await fresh.catch(() => null);
    return late || Response.error();
  })();
}

// Diğer dosyalar (jsPDF, fontlar, ikonlar): önbellekten ver, yoksa internetten al.
// Bunlar sürüm numarası değişince (CACHE_NAME) yeniden indirilir.
async function assetCacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req, { ignoreSearch: true });
  if (cached) return cached;

  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return Response.error();
  }
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(isPage(req) ? pageNetworkFirst(event) : assetCacheFirst(req));
});
