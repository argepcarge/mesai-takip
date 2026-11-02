
// Ana PWA ve test PWA birbirinin önbelleğini etkilemez.
const CACHE_PREFIX =
  'mesai-pwa:' +
  encodeURIComponent(new URL(self.registration.scope).pathname) +
  ':';

// Beta.16: CSS güncelleme sistemi
const CACHE_NAME = CACHE_PREFIX + 'beta16-css-v1';
const INDEX = './index.html';

const assets = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './jspdf.umd.min.js',
  './jspdf.plugin.autotable.min.js',
  './Carlito-Regular.ttf',
  './Carlito-Bold.ttf'
];

// Service Worker kurulumu
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache =>
        cache.addAll(
          assets.map(u => new Request(u, { cache: 'reload' }))
        )
      )
      .then(() => self.skipWaiting())
  );
});

// Eski önbellekleri temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k =>
              k.startsWith(CACHE_PREFIX) &&
              k !== CACHE_NAME
            )
            .map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Sayfa isteği mi?
function isPage(req) {
  if (req.mode === 'navigate') return true;

  const path = new URL(req.url).pathname;

  return path.endsWith('/') ||
         path.endsWith('/index.html');
}

// HTML: Önce internet, sonra önbellek
function pageNetworkFirst(event) {
  const req = event.request;

  const fresh = fetch(req.url, {
    cache: 'no-cache'
  }).then(async res => {
    if (res && res.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(req, res.clone());
      await cache.put(INDEX, res.clone());
    }

    return res;
  });

  event.waitUntil(fresh.catch(() => {}));

  const timeout = new Promise(resolve =>
    setTimeout(() => resolve(null), 4000)
  );

  return (async () => {
    const res = await Promise.race([
      fresh.catch(() => null),
      timeout
    ]);

    if (res && res.ok) return res;

    const cache = await caches.open(CACHE_NAME);

    const cached =
      (await cache.match(req, { ignoreSearch: true })) ||
      (await cache.match(INDEX));

    if (cached) return cached;

    const late = await fresh.catch(() => null);

    return late || Response.error();
  })();
}

// CSS: İnternet varsa güncel dosyayı al.
// İnternet yoksa önbellekteki CSS'i kullan.
async function cssNetworkFirst(req) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const res = await fetch(req, {
      cache: 'no-cache'
    });

    if (res && res.ok) {
      await cache.put(req, res.clone());
      return res;
    }

    const cached = await cache.match(req, {
      ignoreSearch: true
    });

    return cached || res;
  } catch (e) {
    const cached = await cache.match(req, {
      ignoreSearch: true
    });

    return cached || Response.error();
  }
}

// Diğer dosyalar: Önce önbellek
async function assetCacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);

  const cached = await cache.match(req, {
    ignoreSearch: true
  });

  if (cached) return cached;

  try {
    const res = await fetch(req);

    if (res && res.ok) {
      await cache.put(req, res.clone());
    }

    return res;
  } catch (e) {
    return Response.error();
  }
}

// İstekleri yönlendir
self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  if (isPage(req)) {
    event.respondWith(pageNetworkFirst(event));
  } else if (
    url.pathname ===
    new URL('./style.css', self.registration.scope).pathname
  ) {
    event.respondWith(cssNetworkFirst(req));
  } else {
    event.respondWith(assetCacheFirst(req));
  }
});
