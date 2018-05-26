importScripts('libs/workbox-sw/build/workbox-sw.js')

workbox.core.setCacheNameDetails({
  prefix: '1pass'
})

workbox.precaching.precacheAndRoute([])

workbox.routing.registerRoute(
  /^(?!.*(?:install|bundle))(?:.+)\.(?:js|html)/,
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif|ico)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

// var cacheName = '1pass-pwa-cache';

// self.addEventListener('install', function(e) {
//   console.log('[ServiceWorker] Install');
//   e.waitUntil(
//     caches.open(cacheName).then(function(cache) {
//       console.log('[ServiceWorker] Caching 1pass mobile');
//       return cache.addAll(filesToCache);
//     })
//   );
// });

// self.addEventListener('activate', function(e) {
//   console.log('[ServiceWorker] Activate');
//   e.waitUntil(
//     caches.keys().then(function(keyList) {
//       return Promise.all(keyList.map(function(key) {
//         console.log(key)
//         if (key !== cacheName) {
//           console.log('[ServiceWorker] Removing old cache', key);
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
//   /*
//    * Fixes a corner case in which the app wasn't returning the latest data.
//    * You can reproduce the corner case by commenting out the line below and
//    * then doing the following steps: 1) load app for first time so that the
//    * initial New York City data is shown 2) press the refresh button on the
//    * app 3) go offline 4) reload the app. You expect to see the newer NYC
//    * data, but you actually see the initial data. This happens because the
//    * service worker is not yet activated. The code below essentially lets
//    * you activate the service worker faster.
//    */
//   return self.clients.claim();
// });

// // test update

// self.addEventListener('fetch', function(e) {
//   console.log('[ServiceWorker] Fetch', e.request.url);
//   e.respondWith(
//     caches.match(e.request).then(function(response) {
//       return response || fetch(e.request);
//     })
//   );
// });
