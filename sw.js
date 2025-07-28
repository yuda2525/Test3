const cacheName = 'yudatime-v1';
const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './sw.js',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// Install
self.addEventListener('install', event => {
  self.skipWaiting(); // Langsung aktifkan SW baru
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assetsToCache))
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Ambil kendali semua halaman
});

// Fetch
self.addEventListener('fetch', event => {
  const request = event.request;

  // Hanya tangani GET request
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cacheRes => {
      return (
        cacheRes ||
        fetch(request).catch(() => {
          // Jika request HTML dan gagal (offline), fallback ke index.html
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        })
      );
    })
  );
});
