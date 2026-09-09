const CACHE_NAME = 'mesai-pwa-v4';

const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png',
  './jspdf.umd.min.js',
  './jspdf.plugin.autotable.min.js',
  './Roboto-Regular.ttf',
  './Roboto-Medium.ttf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(assets))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
