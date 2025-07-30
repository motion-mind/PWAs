// sw.js (Service Worker)
const CACHE_NAME = 'duct-flow-calculator-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
    // No external CSS file, Tailwind is CDN.
    // No separate JS file, JS is inline.
    // Placeholder icons removed
];


self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // console.log('Opened cache'); // Removed console.log
                // Add all static assets to the cache
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Failed to open cache or add URLs:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request).catch(() => {
                    // Fallback for offline if network request fails
                    // For example, return a generic offline page if needed
                    // For this simple app, just failing gracefully is fine.
                    // console.warn('Network request failed and no cache match for:', event.request.url); // Removed console.warn
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

