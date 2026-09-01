/* 家庭物品管理系统 PWA Service Worker
   策略：离线优先 + 后台网络更新（stale-while-revalidate 简化版）
   缓存：应用外壳（HTML/manifest/图标）全部预缓存，离线可完整打开 */

var CACHE_NAME = 'family-items-pro-v46-20260901-1605';

var APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

/* 安装：预缓存应用外壳 */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* 激活：清理旧版本缓存 */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* 请求：离线优先，命中即返回；未命中回源并缓存 */
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;  // 只缓存同源

  event.respondWith(
    (function () {
      // 导航(打开Shell/页面)走 network-first：优先最新，避免一直用旧缓存导致改版不生效
      if (event.request.mode === 'navigate') {
        return fetch(event.request).then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            var copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
          }
          return networkResponse;
        }).catch(function () {
          return caches.match(event.request).then(function (c) { return c || caches.match('./index.html'); });
        });
      }
      // 其它请求：stale-while-revalidate（缓存优先+后台更新）
      return caches.match(event.request).then(function (cached) {
        var fetchChain = fetch(event.request).then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            var copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
          }
          return networkResponse;
        }).catch(function () { return cached; });
        return cached || fetchChain;
      });
    })()
  );
});

/* 消息：跳过等待立即接管新 SW */
self.addEventListener('message', function (event) {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
