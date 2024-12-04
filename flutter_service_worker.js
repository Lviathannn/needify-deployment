'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "e17fef12f594463f01ee7e3de6e4fa28",
"assets/AssetManifest.bin.json": "686e38e56ad8eb885e21f01413abaac0",
"assets/AssetManifest.json": "ebbd9ee49a7d19c221709a7face85adf",
"assets/assets/fonts/Satoshi-Black.ttf": "f12126e8a8e529e8195c7357dd5ad0c4",
"assets/assets/fonts/Satoshi-Bold.ttf": "50eee48d495ab752b3e6b873b1206f10",
"assets/assets/fonts/Satoshi-Light.ttf": "02d43df8e0b9f0acb1d1c6b40aaa5b7e",
"assets/assets/fonts/Satoshi-Medium.ttf": "7bec814954d059a7e7dae047285eedbc",
"assets/assets/fonts/Satoshi-Regular.ttf": "4da5359f3f975b25249e8cfcf142f39e",
"assets/assets/img/apple.png": "9fea4f55a472f9db3655161a046683c4",
"assets/assets/img/blueberry.png": "69ef51434124cf28fc359c933ea24438",
"assets/assets/img/broccoli.png": "847e7351c1f1fe7e017deadd4d7454a1",
"assets/assets/img/cheese.png": "83e7625d34e7c0a3b549656688aee4cb",
"assets/assets/img/coupon.png": "8984ef0623d3b6e558e1e4dbb783d5ad",
"assets/assets/img/dragon.png": "878acbb3ec334f81650ad46bf8a5465a",
"assets/assets/img/fruits.png": "94b82db27a99b18291ab48ba9287f7a8",
"assets/assets/img/google.png": "91b29118b8039ed9a6dbe8513a0c9bfe",
"assets/assets/img/lychee.png": "a4d791631815f070f8e10a46c96da2da",
"assets/assets/img/mango.png": "9bf0d7036136d6d044912cea5611e523",
"assets/assets/img/meat.png": "1573c7ec57dc38d807c7bd9fbb83d8e0",
"assets/assets/img/pineapple.png": "1179c13489f9820666cc8868a70c2742",
"assets/assets/img/strawberry.png": "4b674078fc837e571358f4e9990c8465",
"assets/FontManifest.json": "cbc1346b22a90f49cb964a98aef88a8f",
"assets/fonts/MaterialIcons-Regular.otf": "214483f26a48d63c1160a4fa34e91775",
"assets/NOTICES": "c4a53fed5bc9ce2c84a538b5a3499467",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "a61a2563356b1acba66eb4ffcbc323dc",
"assets/packages/hugeicons/lib/fonts/hgi-stroke-rounded.ttf": "7b7e29353cabc1555d2720eb496b805e",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.ico": "7a3630677c593940225a308465e890c9",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "a5c7a05ffbd2ee6820e1daad8241f9ea",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "68e64ee36ddc2cb09602911d089343b0",
"/": "68e64ee36ddc2cb09602911d089343b0",
"main.dart.js": "9d8a15ad77c3a6d88ccf77974d9c9084",
"manifest.json": "69fb97b813d84a2f0e20522f28153acc",
"version.json": "055602db24fa713e6a1cd0f40fbf171f"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
