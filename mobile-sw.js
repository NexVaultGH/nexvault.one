'use strict'

const CACHE = 'nexvault-mobile-v2'
const OFFLINE = '/nexvault-mobile.html'

// Assets to pre-cache on install
const PRECACHE = [
  '/app.html',
  '/nexvault-mobile.html',
  '/nv-style.css',
  '/nv-core.js',
  '/nv-canvas.js',
  '/favicon.svg',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/mobile-manifest.json'
]

// ── Install: pre-cache critical assets ────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

// ── Activate: clean up old caches ─────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// ── Fetch: network-first for navigate, cache-first for assets ─────────────────
self.addEventListener('fetch', e => {
  const { request } = e
  const url = new URL(request.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    // Network-first for navigation: always get freshest HTML
    e.respondWith(
      fetch(request)
        .catch(() => caches.match(request).then(r => r || caches.match(OFFLINE)))
    )
  } else {
    // Cache-first for static assets (icons, etc.)
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone()
            caches.open(CACHE).then(c => c.put(request, clone))
          }
          return res
        })
      })
    )
  }
})
