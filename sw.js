(function () {
  self.importScripts('https://cdn.weidiango.com/workbox-cdn/releases/5.1.3/workbox-sw.js');
  if (!self.workbox) {
    console.log(`Boo! Workbox didn't load 😬`);
    return
  }
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.setConfig({
    debug: true,
    modulePathPrefix: 'https://cdn.weidiango.com/workbox-cdn/releases/5.1.3/'
  });
  var cacheVersion = '-workbox-v1';
  var dynamicVendorCacheName = 'dynamic-vendor' + cacheVersion;
  var staticVendorCacheName = 'static-vendor' + cacheVersion;
  var staticAssetsCacheName = 'static-assets' + cacheVersion;
  var contentCacheName = 'content' + cacheVersion;
  var maxEntries = 50;
  self.workbox.routing.registerRoute(
    /ghost.wuweixing.com\/(.+)\.(?:png|gif|jpg|jpeg|svg)$/,
    new self.workbox.strategies.CacheFirst()
  );
  workbox.routing.registerRoute(
      // Cache CSS & JS files
    /.*\.(css|js)/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-assets-cache',
    })
  );
//   self.toolbox.router.get('/(.*)', self.toolbox.fastest, {
//     origin: /lib\.baomitu\.com/,
//     cache: {
//       name: staticAssetsCacheName,
//       maxEntries: 999999
//     }
//   });
// 
//   self.toolbox.router.get('/(.*)', self.toolbox.cacheFirst, {
//     origin: /ghost-static\.lab\.wuweixing\.com/,
//     cache: {
//       name: staticAssetsCacheName,
//       maxEntries: 999999
//     }
//   });
// 
// 
//   // 缓存本站静态文件
//   self.toolbox.router.get('/assets/(.*)', self.toolbox.cacheFirst, {
//     cache: {
//       name: staticAssetsCacheName,
//       maxEntries: maxEntries
//     }
//   });
// 
//   self.toolbox.router.get('/public/ghost-sdk.min.js', self.toolbox.cacheFirst, {
//     cache: {
//       name: staticAssetsCacheName,
//       maxEntries: maxEntries
//     }
//   });
// 
//   self.toolbox.router.get('/(.*)', self.toolbox.cacheFirst, {
//     origin: /casper\.ghost\.org/,
//     cache: {
//       name: staticAssetsCacheName,
//       maxEntries: 999999
//     }
//   });
// 
//   // 缓存 googleapis
//   self.toolbox.router.get('/css', self.toolbox.fastest, {
//     origin: /fonts\.googleapis\.com/,
//     cache: {
//       name: dynamicVendorCacheName,
//       maxEntries: 999999
//     }
//   });
// 
//   // 不缓存 DISQUS 评论
//   self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
//     origin: /disquscdn\.com/,
//     cache: {
//       name: staticVendorCacheName,
//       maxEntries: 99999
//     }
//   });
//   self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
//     origin: /c\.disquscdn\.com/,
//     cache: {
//       name: staticVendorCacheName,
//       maxEntries: 99999
//     }
//   });
//   self.toolbox.router.get("/next/config.json", self.toolbox.networkOnly, {
//     origin: /disqus\.com/
//   });
//   self.toolbox.router.get("/api/(.*)", self.toolbox.networkOnly, {
//     origin: /disqus\.com/
//   });
//   self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
//     origin: /referrer\.disqus\.com/,
//     cache: {
//       name: staticVendorCacheName,
//       maxEntries: maxEntries
//     }
//   });
// 
//   // 缓存所有 Google 字体
//   self.toolbox.router.get('/(.*)', self.toolbox.cacheFirst, {
//       origin: /(fonts\.gstatic\.com|www\.google-analytics\.com|ssl\.google-analytics\.com)/,
//       cache: {
//         name: staticVendorCacheName,
//         maxEntries: maxEntries
//       }
//   });
// 
//   self.toolbox.router.get('/content/(.*)', self.toolbox.fastest, {
//     cache: {
//       name: contentCacheName,
//       maxEntries: maxEntries
//     }
//   });
// 
//   self.toolbox.router.get('/*', function (request, values, options) {
//     if (!request.url.match(/(\/ghost\/|\/page\/)/) && request.headers.get('accept').includes('text/html')) {
//       return self.toolbox.fastest(request, values, options);
//     } else {
//       return self.toolbox.networkOnly(request, values, options);
//     }
//     }, {
//     cache: {
//       name: contentCacheName,
//       maxEntries: maxEntries
//     }
//   });
// 
  // immediately activate this serviceworker
  self.addEventListener('install', function (event) {
    return event.waitUntil(self.skipWaiting());
  });

  self.addEventListener('activate', function (event) {
    return event.waitUntil(self.clients.claim());
  });
  workbox.routing.setDefaultHandler(
    new workbox.strategies.NetworkFirst({
      options: [{
        // 超过 3s 请求没有响应则 fallback 到 cache
        networkTimeoutSeconds: 3,
      }]
    })
  );
})();
