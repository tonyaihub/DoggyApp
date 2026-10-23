/**
 * DogApp Service Worker (public/sw.js)
 * Production-ready PWA service worker with Web Push & offline caching
 */

const CACHE_NAME = 'dogapp-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching issue, continuing anyway:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Network First with Cache Fallback for dynamic assets)
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip websocket or API calls
  if (event.request.method !== 'GET' || event.request.url.includes('/api/') || event.request.url.includes('/ws')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback to root for SPA navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Push Notification Event Handler (VAPID)
self.addEventListener('push', (event) => {
  let data = {
    title: 'DogApp Запоріжжя',
    body: 'У вашому районі нова активність!',
    icon: '/icon.svg',
    badge: '/icon.svg',
    url: '/',
    tag: 'dogapp-alert',
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon.svg',
    badge: data.badge || '/icon.svg',
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      { action: 'open', title: '🐾 Відкрити' },
      { action: 'close', title: 'Закрити' },
    ],
    tag: data.tag || 'dogapp-notification',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Click Event Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
