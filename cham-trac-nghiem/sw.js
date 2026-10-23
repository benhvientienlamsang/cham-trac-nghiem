const VERSION = 'ctn-c0dd19bfd5';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "fonts/be-vietnam-pro-latin-400-normal.woff2", "fonts/be-vietnam-pro-latin-500-normal.woff2", "fonts/be-vietnam-pro-latin-600-normal.woff2", "fonts/be-vietnam-pro-latin-700-normal.woff2", "fonts/be-vietnam-pro-vietnamese-400-normal.woff2", "fonts/be-vietnam-pro-vietnamese-500-normal.woff2", "fonts/be-vietnam-pro-vietnamese-600-normal.woff2", "fonts/be-vietnam-pro-vietnamese-700-normal.woff2", "fonts/ibm-plex-mono-latin-500-normal.woff2", "fonts/ibm-plex-mono-latin-600-normal.woff2", "fonts/ibm-plex-mono-vietnamese-500-normal.woff2", "fonts/ibm-plex-mono-vietnamese-600-normal.woff2"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => {
      if (!r.ok) return caches.match('index.html').then((hit) => hit || r);
      const cp = r.clone(); caches.open(VERSION).then((c) => c.put('index.html', cp)); return r;
    }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
