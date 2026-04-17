/**
 * Service Worker — Cache-first for static assets, network-first for APIs
 * Handles fonts, images, JS/CSS chunks with long-lived caching.
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const FONT_CACHE = `fonts-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Assets to pre-cache on install (critical path)
const PRECACHE_ASSETS = [
  '/',
  '/fonts/inter-var.woff2',
  '/fonts/poppins-400.woff2',
  '/fonts/poppins-600.woff2',
  '/fonts/poppins-700.woff2',
  '/fonts/poppins-300.woff2',
  '/fonts/orbitron-700.woff2',
];

// Install: pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Pre-cache only what's guaranteed to be available
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache partial failure (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up stale caches from old versions
self.addEventListener('activate', (event) => {
  const CURRENT_CACHES = [STATIC_CACHE, FONT_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !CURRENT_CACHES.includes(name))
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: routing strategy per request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin API requests (Spotify, GitHub API)
  if (request.method !== 'GET') return;

  // GitHub API and Spotify API — Network-only (real-time data)
  if (
    url.hostname === 'api.github.com' ||
    url.hostname.includes('spotify') ||
    url.hostname.includes('github-contributions-api') ||
    url.hostname.includes('github-readme')
  ) {
    return; // Let fetch fall through to network
  }

  // Fonts — Cache-first with long TTL
  if (
    url.pathname.startsWith('/fonts/') ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // Images — Cache-first
  if (
    url.pathname.match(/\.(webp|jpg|jpeg|png|gif|svg|ico)$/) ||
    url.pathname.startsWith('/profile/') ||
    url.pathname.startsWith('/certificates/')
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return cached || new Response('', { status: 404 });
        }
      })
    );
    return;
  }

  // JS/CSS assets (content-hashed) — Cache-first, stale-while-revalidate
  if (url.pathname.match(/\.(js|css)$/) && url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // HTML navigation — Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/').then((cached) => cached || new Response('Offline', { status: 503 }))
      )
    );
  }
});
