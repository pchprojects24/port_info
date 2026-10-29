// Generated with a content revision; a new port never reuses the previous port's cache.
const PREFIX = 'port-brief-' + new URL(self.registration.scope).pathname + '-';
const CACHE = PREFIX + '__REVISION__';
const ASSETS = ['./', 'index.html', 'app.js', 'styles.css', 'data.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request, url = new URL(req.url);
  if(req.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope) || url.pathname.includes('/.netlify/')) return;
  // Keep the cached app and port record together until the next complete revision installs.
  if(!ASSETS.some(asset => new URL(asset,self.registration.scope).href === url.href) && req.mode !== 'navigate') return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(req);
    if(cached) return cached;
    if(req.mode === 'navigate') return (await cache.match(new URL('index.html',self.registration.scope).href)) || fetch(req);
    return fetch(req);
  }));
});
