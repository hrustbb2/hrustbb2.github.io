/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function() {

// const CACHE_NAME = 'my-pwa-cache-v1';
// const urlsToCache = ['/', '/index.html', '/distr/js/script.js', '/distr/js/service-worker.js', '/manifest.json', '/icon-180x180.png'];
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var CACHE_STATIC = 'static-cache-v1';
function hndlEventInstall(evt) {
    /**
     * @returns {Promise<void>}
     */
    function cacheStaticFiles() {
        return __awaiter(this, void 0, void 0, function () {
            var files, cacheStat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = ['/', '/index.html', '/distr/js/script.js', '/distr/js/service-worker.js', '/manifest.json', '/icon-180x180.png'];
                        return [4 /*yield*/, caches.open(CACHE_STATIC)];
                    case 1:
                        cacheStat = _a.sent();
                        return [4 /*yield*/, Promise.all(files.map(function (url) {
                                return cacheStat.add(url).catch(function (reason) {
                                    console.log("'".concat(url, "' failed: ").concat(String(reason)));
                                });
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    //  wait until all static files will be cached
    evt.waitUntil(cacheStaticFiles());
}
function hndlEventFetch(evt) {
    function getFromCache() {
        return __awaiter(this, void 0, void 0, function () {
            var cache, cachedResponse, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, self.caches.open(CACHE_STATIC)];
                    case 1:
                        cache = _a.sent();
                        return [4 /*yield*/, cache.match(evt.request)];
                    case 2:
                        cachedResponse = _a.sent();
                        if (cachedResponse) {
                            return [2 /*return*/, cachedResponse];
                        }
                        return [4 /*yield*/, fetch(evt.request)];
                    case 3:
                        resp = _a.sent();
                        return [4 /*yield*/, cache.put(evt.request, resp.clone())];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, resp];
                }
            });
        });
    }
    evt.respondWith(getFromCache());
}
self.addEventListener('install', hndlEventInstall);
self.addEventListener('fetch', hndlEventFetch);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/main.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=service-worker.js.map