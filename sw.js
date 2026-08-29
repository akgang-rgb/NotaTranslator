self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key.indexOf('not-a-translator-site-') === 0;
      }).map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () {
      return self.registration.unregister();
    })
  );
});
