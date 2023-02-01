let CACHE_NAME = 'my-site-cache-v2'
const urlsToCache = ['/', '/index.html']
self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Opened cache')

// Service worker cache should be cleared with caches.delete()
caches.keys().then(function(names) {
  for (let name of names) {
    console.log("deleting cache: " + name)
    caches.delete(name)
  };
});

      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response
      }
      return fetch(event.request)
    })
  )
})
