/******/ (() => { // webpackBootstrap
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
var CACHE_NAME = 'my-pwa-cache-v1';
var urlsToCache = ['/', '/index.html',];
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
    }));
});
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
    }));
});

/******/ })()
;
//# sourceMappingURL=service-worker.js.map