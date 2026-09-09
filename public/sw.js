// E-SMART-WORLD Service Worker v2.0
const CACHE_NAME = 'esworld-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png',
];

// Install: precache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing E-SMART-WORLD Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Failed to cache some assets:', err);
      });
    }).then(() => {
      self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating E-SMART-WORLD Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch: stale-while-revalidate for pages, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and external requests
  if (request.method !== 'GET') return;
  if (!url.origin.includes(self.location.origin) && !url.pathname.startsWith('/')) return;

  // Network-first for API calls
  if (url.pathname.startsWith('/functions/') || url.pathname.includes('supabase')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for assets, stale-while-revalidate for pages
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => cached);

        return cached || fetchPromise;
      });
    })
  );
});

// Push notifications (future)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'E-SMART-WORLD', {
    body: data.body || 'New update available',
    icon: '/icon-512.png',
    badge: '/icon-512.png',
  });
});
