(() => {
  const cdnUrl = 'https://cdn.jsdelivr.net'
  self.importScripts(`${cdnUrl}/npm/workbox-cdn/workbox/workbox-sw.js`)
  if (!self.workbox) {
    console.log(`Boo! Workbox didn't load 😬`);
    return
  }
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.setConfig({
    // debug: true,
    modulePathPrefix: `${cdnUrl}/npm/workbox-cdn/workbox/`
  });
  workbox.precaching.precacheAndRoute([{
    url: '/', revision: '1'
  }, {
    url: '/archives-post/', revision: '1'
  }], {
    ignoreURLParametersMatching: [/.*/]
  });
  workbox.core.clientsClaim();
  workbox.core.skipWaiting();
  workbox.precaching.cleanupOutdatedCaches();
  const {
    routing: { registerRoute },
    strategies: {
      NetworkOnly, CacheOnly,
      NetworkFirst,
      CacheFirst,
      StaleWhileRevalidate
    },
    cacheableResponse: {
      CacheableResponsePlugin
    },
    expiration: {
      ExpirationPlugin
    }
  } = workbox;
  registerRoute(
    new RegExp('baidu.com/.*(hm.gif|hm.js|s.gif)'),
    new NetworkOnly({})
  );
  registerRoute(
    new RegExp('.+(cdn.jsdelivr.net|lib.baomitu.com).+'),
    new CacheFirst({
      cacheName: 'cdn',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    }),
  );
  registerRoute(
    new RegExp('/assets/'),
    new CacheFirst({
      cacheName: 'main-assets',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        })
      ]
  }))
  registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
    new CacheFirst({
      cacheName: 'img-v1',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        })
      ]
    })
  );
  registerRoute(
    new RegExp('.+casper.ghost.com.*'),
    new CacheFirst({
      cacheName: 'casper-v1',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  registerRoute(
    new RegExp('.+(disquscdn.com|referrer.disqus.com|disqus.com/embed.js).*'),
    new CacheFirst({
      cacheName: 'disquscdn',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  registerRoute(
    new RegExp('.+(disqus.com/api|disqus.com/next/config.js|/images/pixel.gif).*'),
    new NetworkOnly({})
  );
  registerRoute(
    new RegExp('((fonts.(?:googleapis|gstatic).com|www.google-analytics.com|ssl.google-analytics.com))'),
    new CacheFirst({
      cacheName: 'googleapis',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365,
          purgeOnQuotaError: true
        }),
      ],
    }),
  );
  registerRoute(
    ({ url, event }) => {
      return Boolean(
        url.hostname === 'ghost.wuweixing.com'
        && event.request.headers.get('accept').includes('text/html')
      )
    },
    new NetworkFirst({
      cacheName: 'page',
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 5,
          })
      ]
    })
  );
  registerRoute(
    new RegExp('.+ghost.wuweixing.com.+(js|css).*'),
    new StaleWhileRevalidate({
      cacheName: 'common-assets-v1',
    })
  );

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
  registerRoute(
    new RegExp('((fonts.(?:googleapis|gstatic).com|www.google-analytics.com|ssl.google-analytics.com))'),
    new CacheFirst({
      cacheName: 'googleapis',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365,
          purgeOnQuotaError: true
        }),
      ],
    }),
  );
//   self.toolbox.router.get('/content/(.*)', self.toolbox.fastest, {
//     cache: {
//       name: contentCacheName,
//       maxEntries: maxEntries
//     }
//   });
  registerRoute(
    ({ url, event }) => {
      return Boolean(
        url.hostname === 'ghost.wuweixing.com'
        && event.request.headers.get('accept').includes('text/html')
      )
    },
    new NetworkFirst({
      cacheName: 'page',
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200]
          }),
          new ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 5,
          })
      ]
    })
  );
  registerRoute(
    new RegExp('.+ghost.wuweixing.com.+(js|css).*'),
    new StaleWhileRevalidate({
      cacheName: 'common-assets-v1',
    })
  );

  const defaultStrategy = new NetworkFirst({
    cacheName: 'default',
    options: [{
      networkTimeoutSeconds: 2,
    }],
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 7,
        purgeOnQuotaError: true
      }),
    ]
  })
  workbox.routing.setDefaultHandler((args) => {
    if (
      args.url.hostname.includes('baidu.com')
      || args.request.method !== 'GET'
    ) {
      return fetch(args.request)
    }
    return defaultStrategy.handle(args)
  })
})();
