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

// Install event: cache semua aset
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assetsToCache))
  );
});

// Activate event: hapus cache lama jika ada
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)))
    )
  );
});

// Fetch event: ambil dari cache, fallback ke index.html kalau offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes =>
      cacheRes || fetch(event.request).catch(() => caches.match('./index.html'))
    )
  );
});
