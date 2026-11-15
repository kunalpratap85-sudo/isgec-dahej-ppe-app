const CACHE_NAME = 'isgec-ppe-c55ee03482021cce';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  "./assets/index-DQRZbfBR.css","./assets/index-4IrDy-6N.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache => cache.addAll(ASSETS_TO_CACHE))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key.startsWith('isgec-ppe-') && key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests that are static assets, do not cache API calls
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) {
    return;
  }
  if (event.request.mode === 'navigate' && !new URL(event.request.url).pathname.endsWith('.apk')) {
    event.respondWith(caches.open(CACHE_NAME).then(async cache => (await cache.match('./index.html')) || fetch(event.request)));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

