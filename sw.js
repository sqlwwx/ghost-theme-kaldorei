'use strict';

(function () {
  'use strict';
    /**
    * Service Worker Toolbox caching
    */

    var cacheVersion = '-toolbox-v6';
    var dynamicVendorCacheName = 'dynamic-vendor' + cacheVersion;
    var staticVendorCacheName = 'static-vendor' + cacheVersion;
    var staticAssetsCacheName = 'static-assets' + cacheVersion;
    var contentCacheName = 'content' + cacheVersion;
    // 50s
    var maxEntries = 50;

    self.importScripts('https://cdn.bootcss.com/sw-toolbox/3.6.1/sw-toolbox.js');

    self.toolbox.options.debug = false;

    self.toolbox.router.get('/(.*)', self.toolbox.fastest, {
      origin: /cdn\.bootcss\.com/,
      cache: {
        name: staticAssetsCacheName,
        maxEntries: 999999
      }
    });

    self.toolbox.router.get('/(.*)', self.toolbox.fastest, {
      origin: /ghost-static\.lab\.wuweixing\.com/,
      cache: {
        name: staticAssetsCacheName,
        maxEntries: 999999
      }
    });


    // 缓存本站静态文件
    self.toolbox.router.get('/assets/(.*)', self.toolbox.cacheFirst, {
      cache: {
        name: staticAssetsCacheName,
        maxEntries: maxEntries
      }
    });

    self.toolbox.router.get('/public/ghost-sdk.min.js', self.toolbox.cacheFirst, {
        cache: {
          name: staticAssetsCacheName,
          maxEntries: maxEntries
        }
    });

    self.toolbox.router.get('/(.*)', self.toolbox.cacheFirst, {
        origin: /casper\.ghost\.org/,
        cache: {
          name: staticAssetsCacheName,
          maxEntries: 999999
        }
    });

    // 缓存 googleapis
    self.toolbox.router.get('/css', self.toolbox.fastest, {
        origin: /fonts\.googleapis\.com/,
            cache: {
              name: dynamicVendorCacheName,
              maxEntries: 999999
            }
    });

    // 不缓存 DISQUS 评论
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
      origin: /disquscdn\.com/,
      cache: {
        name: staticVendorCacheName,
        maxEntries: 99999
      }
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
      origin: /c\.disquscdn\.com/,
      cache: {
        name: staticVendorCacheName,
        maxEntries: 99999
      }
    });
    self.toolbox.router.get("/next/config.json", self.toolbox.networkOnly, {
      origin: /disqus\.com/
    });
    self.toolbox.router.get("/api/(.*)", self.toolbox.networkOnly, {
      origin: /disqus\.com/
    });
    self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
      origin: /referrer\.disqus\.com/,
      cache: {
        name: staticVendorCacheName,
        maxEntries: maxEntries
      }
    });

    // 缓存所有 Google 字体
    self.toolbox.router.get('/(.*)', self.toolbox.cacheFirst, {
        origin: /(fonts\.gstatic\.com|www\.google-analytics\.com|ssl\.google-analytics\.com)/,
        cache: {
          name: staticVendorCacheName,
          maxEntries: maxEntries
        }
    });

    self.toolbox.router.get('/content/(.*)', self.toolbox.fastest, {
        cache: {
          name: contentCacheName,
          maxEntries: maxEntries
        }
    });

    self.toolbox.router.get('/*', function (request, values, options) {
        if (!request.url.match(/(\/ghost\/|\/page\/)/) && request.headers.get('accept').includes('text/html')) {
            return self.toolbox.fastest(request, values, options);
        } else {
            return self.toolbox.networkOnly(request, values, options);
        }
        }, {
        cache: {
            name: contentCacheName,
            maxEntries: maxEntries
        }
    });

    // immediately activate this serviceworker
    self.addEventListener('install', function (event) {
        return event.waitUntil(self.skipWaiting());
    });

    self.addEventListener('activate', function (event) {
        return event.waitUntil(self.clients.claim());
    });

})();
