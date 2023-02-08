let CACHE_NAME = 'my-site-cache-v18'
const urlsToCache = ['/', '/index.html']

self.addEventListener('install', function (event) {
  caches.keys().then(function (keys) {
    keys.forEach(function (key) {
      console.log('CacheKey: ' + key)
      if (key !== CACHE_NAME) {
        caches.delete(key).then(function (deleted) {
          if (deleted) {
            console.log(key + ' deleted successfully')
          } else {
            console.error(key + ' not found')
          }
        })
      }
    })
  })

  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Cache opened:', CACHE_NAME)
      return cache.addAll(urlsToCache)
    })
  )
})

// self.addEventListener('activate', function (event) {
//   event.waitUntil(
//     caches.keys().then(function (cacheNames) {
//       console.log('test')
//       return Promise.all(
//         cacheNames.map(function (cacheName) {
//           if (
//             CACHE_NAME !== cacheName &&
//             cacheName.startsWith('my-site-cache')
//           ) {
//             console.log('Deleting outdated cache:', cacheName)
//             return caches.delete(cacheName)
//           }
//         })
//       )
//     })
//   )
// })

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       // Cache hit - return response
//       if (response) {
//         return response
//       }

//       // Clone the request to use it multiple times
//       let fetchRequest = event.request.clone()

//       return fetch(fetchRequest).then(function (response) {
//         // Check if we received a valid response
//         if (!response || response.status !== 200 || response.type !== 'basic') {
//           return response
//         }

//         // Clone the response to use it multiple times
//         let responseToCache = response.clone()

//         if (event.request.url.startsWith(self.location.origin)) {
//           caches.open(CACHE_NAME).then(function (cache) {
//             cache.put(event.request, responseToCache)
//           })
//         }

//         return response
//       })
//     })
//   )
// })
