// const CACHE_NAME = 'my-pwa-cache-v1';
// const urlsToCache = ['/', '/index.html', '/distr/js/script.js', '/distr/js/service-worker.js', '/manifest.json', '/icon-180x180.png'];

// self.addEventListener('install', (event:ExtendableEvent) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => {
//       console.log('Opened cache');
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// self.addEventListener('fetch', (event:FetchEvent) => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       return response || fetch(event.request);
//     })
//   );
// });

const CACHE_STATIC = 'static-cache-v6';

function hndlEventInstall(evt: any) {
    /**
     * @returns {Promise<void>}
     */
    async function cacheStaticFiles() {
        const files = ['/', '/index.html', '/distr/js/spa.js', '/distr/js/sw.js', '/manifest.json', '/icon-180x180.png'];
        const cacheStat = await caches.open(CACHE_STATIC);
        await Promise.all(
            files.map(function (url) {
                return cacheStat.add(url).catch(function (reason) {
                    console.log(`'${url}' failed: ${String(reason)}`);
                });
            })
        );
    }

    //  wait until all static files will be cached
    evt.waitUntil(cacheStaticFiles());
}

function hndlEventFetch(evt: any) {
    async function getFromCache() {
        const cache = await self.caches.open(CACHE_STATIC);
        const cachedResponse = await cache.match(evt.request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // wait until resource will be fetched from server and stored in cache
        const resp = await fetch(evt.request);
        await cache.put(evt.request, resp.clone());
        return resp;
    }

    evt.respondWith(getFromCache());
}

self.addEventListener('install', hndlEventInstall);
self.addEventListener('fetch', hndlEventFetch);