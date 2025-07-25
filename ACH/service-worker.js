// service-worker.js

const CACHE_NAME = 'ach-calculator-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    // Placeholder icons (replace with real icons in a production app)
    'https://placehold.co/192x192/2563eb/ffffff?text=ACH',
    'https://placehold.co/512x512/2563eb/ffffff?text=ACH'
];

// Install event: caches all necessary files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache files during install:', error);
            })
    );
});

// Fetch event: serves cached content if available, otherwise fetches from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If the request is in the cache, return the cached response
                if (response) {
                    return response;
                }
                // Otherwise, fetch from the network
                return fetch(event.request).catch(() => {
                    // This catch block handles network failures (e.g., offline)
                    // You could serve an offline page here if desired
                    console.log('Network request failed for:', event.request.url);
                    // For this simple app, we just return a new Response indicating offline
                    return new Response('<h1>You are offline!</h1>', {
                        headers: { 'Content-Type': 'text/html' }
                    });
                });
            })
    );
});

// Activate event: cleans up old caches
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
