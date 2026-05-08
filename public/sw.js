const CACHE_NAME = 'complete-gardener-planner-v1'
const BASE = '/complete-gardener-planner/'
const STATIC_DATA = [
  'data/v1/plants.json',
  'data/v1/companions.json',
  'data/v1/frost.json',
  'data/v1/soil-cells.json',
  'data/v1/weather-normals.json',
  'data/v1/disease-signatures.json',
  'data/v1/yield-model.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll([BASE, `${BASE}index.html`, ...STATIC_DATA.map((path) => `${BASE}${path}`)]),
      ),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (!url.pathname.startsWith(BASE) || event.request.method !== 'GET') {
    return
  }
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
            return response
          })
          .catch(() => caches.match(`${BASE}index.html`)),
    ),
  )
})
