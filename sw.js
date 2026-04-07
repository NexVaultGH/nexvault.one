// ═══════════════════════════════════════════════════════════════
//  NexVault Service Worker
//  Caches all app assets for offline use and instant load times.
//  Users stay signed in — their wallet address persists in
//  localStorage which survives SW updates.
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'nexvault-v1'
const OFFLINE_URL = '/offline.html'

// All assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/app.html',
  '/security.html',
  '/offline.html',
  '/favicon.svg',
  '/favicon.ico',
  '/favicon-192.png',
  '/favicon-32.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/apple-touch-icon.png',
  '/og-image.png',
  '/site.webmanifest',
]

// ── Install: pre-cache all core assets ────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// ── Activate: clear old caches ────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// ── Fetch: serve from cache, fall back to network ─────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and cross-origin requests (ethers CDN, Google Fonts, etc.)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // For navigation requests: cache-first with network fallback,
  // serve offline page if both fail
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          return response
        })
        .catch(() =>
          caches.match(request)
            .then(cached => cached || caches.match(OFFLINE_URL))
        )
    )
    return
  }

  // For all other local assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return response
      })
    })
  )
})

// ── Push notifications (for Nexus mainnet launch alert) ───────
self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  const title   = data.title   || 'NexVault'
  const body    = data.body    || 'You have a new notification'
  const icon    = data.icon    || '/favicon-192.png'
  const badge   = data.badge   || '/favicon-192.png'
  const url     = data.url     || '/app.html'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      data: { url },
      vibrate: [200, 100, 200],
      tag: 'nexvault-notification',
      renotify: true,
    })
  )
})

// ── Notification click: open or focus the app ─────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/app.html'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        const existing = clientList.find(c => c.url.includes('nexvault') && 'focus' in c)
        if (existing) return existing.focus()
        return clients.openWindow(url)
      })
  )
})
