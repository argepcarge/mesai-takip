
const CACHE_PREFIX =
  'mesai-pwa:' +
  encodeURIComponent(new URL(self.registration.scope).pathname) +
  ':';

const CACHE_NAME = CACHE_PREFIX + 'beta16-css-js-v5';
const INDEX = './index.html';

const assets = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './libs/jspdf.umd.min.js',
  './libs/jspdf.plugin.autotable.min.js',
  './fonts/Carlito-Regular.ttf',
  './fonts/Carlito-Bold.ttf'
];

// Kurulum: Dosyalari onbellege al
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

// Aktivasyon: Yalnizca bu PWA'ya ait eski cache'leri temizle
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

function isPage(req) {
  if (req.mode === 'navigate') return true;

  const path = new URL(req.url).pathname;

  return path.endsWith('/') ||
         path.endsWith('/index.html');
}

// HTML: Once internet, sonra onbellek
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

// CSS ve JS: Internet varsa guncel surumu kontrol et
// Internet yoksa onbellekteki kopyayi kullan
async function assetNetworkFirst(req) {
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

// Diger dosyalar: Once onbellek
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

// Gelen istekleri yonlendir
self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  const cssPath =
    new URL('./style.css', self.registration.scope).pathname;

  const jsPath =
    new URL('./main.js', self.registration.scope).pathname;

  if (isPage(req)) {
    event.respondWith(pageNetworkFirst(event));
  } else if (
    url.pathname === cssPath ||
    url.pathname === jsPath
  ) {
    event.respondWith(assetNetworkFirst(req));
  } else {
    event.respondWith(assetCacheFirst(req));
  }
});
