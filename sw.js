importScripts('libs/workbox-sw/build/workbox-sw.js')

workbox.core.setCacheNameDetails({
  prefix: '1pass'
})

workbox.precaching.precacheAndRoute([
  {
    "url": "favicon-114.png",
    "revision": "090e5453e92f06d7916a0ca884231bec"
  },
  {
    "url": "favicon-120.png",
    "revision": "f38a8a8ab7daeea262697d53cd2b304b"
  },
  {
    "url": "favicon-144.png",
    "revision": "b47f72af050df30509cd871c2b4f24ac"
  },
  {
    "url": "favicon-150.png",
    "revision": "d7f757e753d7ce97eed12ba806650cbe"
  },
  {
    "url": "favicon-152.png",
    "revision": "6ba8ffcd9c515cba6f738eaa12305419"
  },
  {
    "url": "favicon-16.png",
    "revision": "67899a6074210d1eb6d7e325b3e3044a"
  },
  {
    "url": "favicon-160.png",
    "revision": "30370e4aa5327215e67e6744f332728c"
  },
  {
    "url": "favicon-180.png",
    "revision": "3427d1399ab8e5560f806d4e721f6b58"
  },
  {
    "url": "favicon-192.png",
    "revision": "216d52b73b27b9a53053ce11cd47dc7c"
  },
  {
    "url": "favicon-310.png",
    "revision": "a2a253e4b801b58ec4f032cd953d24bc"
  },
  {
    "url": "favicon-32.png",
    "revision": "7753a140838e821bed9e7f5c23a8f3aa"
  },
  {
    "url": "favicon-57.png",
    "revision": "83dd0b4bcb97bc792a816e616f945116"
  },
  {
    "url": "favicon-60.png",
    "revision": "f7d79c6e1f4345634089af4d5cc5ea7c"
  },
  {
    "url": "favicon-64.png",
    "revision": "82cd37151708827ab0f946bea777c90b"
  },
  {
    "url": "favicon-70.png",
    "revision": "59b500f54d0731c68e3028b80868db3f"
  },
  {
    "url": "favicon-72.png",
    "revision": "adeedd0c95395128c731450889face81"
  },
  {
    "url": "favicon-76.png",
    "revision": "398db57962b43d70829c3b49f76744e1"
  },
  {
    "url": "favicon-96.png",
    "revision": "52d1e17c4e7f32cadbe9632b11835496"
  },
  {
    "url": "favicon.ico",
    "revision": "bcacd5da7c4311fde2608c969ee89bdd"
  },
  {
    "url": "app.js",
    "revision": "6fbd23b789fac1e5457459a32fadf4e7"
  },
  {
    "url": "pwa.html",
    "revision": "976d681e4705ac6154a3d602ce6be3ed"
  },
  {
    "url": "manifest.json",
    "revision": "8a7b766915c107de7e857a71608112b6"
  }
])

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
