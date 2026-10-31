// Generated with a content revision; a new port never reuses the previous port's cache.
const PREFIX = 'port-brief-' + new URL(self.registration.scope).pathname + '-';
const CACHE = PREFIX + '4af7353843fbe96d';
const ASSETS = ['./', 'index.html', 'app.js', 'styles.css', 'ashore.js', 'brief-tools.js', 'vendor/leaflet/leaflet.js', 'vendor/leaflet/leaflet.css', 'data.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];
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

self.addEventListener('message', event => {
  if(!['PACK_STATUS','SAVE_PACK'].includes(event.data?.type) || !event.ports[0]) return;
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    try {
      if(event.data.type==='SAVE_PACK') {
        const urls=ASSETS.map(asset=>new URL(asset,self.registration.scope).href);
        const responses=await Promise.all(urls.map(url=>fetch(url,{cache:'reload'})));
        if(responses.some(r=>!r.ok)) throw new Error('Download incomplete');
        const data=await responses[ASSETS.indexOf('data.js')].clone().text();
        if(!data.includes('window.PORT_REVISION = "4af7353843fbe96d";')) throw new Error('New revision available');
        await Promise.all(responses.map((r,i)=>cache.put(urls[i],r)));
      }
      const hits=await Promise.all(ASSETS.map(asset=>cache.match(new URL(asset,self.registration.scope).href)));
      event.ports[0].postMessage({revision:'4af7353843fbe96d',ready:hits.every(Boolean)});
    } catch {event.ports[0].postMessage({revision:'4af7353843fbe96d',ready:false});}
  })());
});
