// const CACHE_NAME = 'blood-donation-v1';
// const urlsToCache = [
//   '/',
//   '/static/js/bundle.js',
//   '/static/css/main.css',
//   '/manifest.json'
// ];

// self.addEventListener('install', (event) => {
//   console.log('🔧 Service Worker installing...');
  
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => {
//         console.log('📦 Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         return response || fetch(event.request);
//       }
//     )
//   );
// });

// self.addEventListener('activate', (event) => {
//   console.log('✅ Service Worker activated');
  
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             console.log('🗑️ Deleting old cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// self.addEventListener('message', (event) => {
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// });