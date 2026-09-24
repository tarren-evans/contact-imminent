const CACHE='contact-imminent-v0.11.6.10';
const CORE=[
  './',
  './index.html',
  './styles.css?v=0.11.6.10',
  './game.js?v=0.11.6.10',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/maps/global-deep-space.webp',
  './assets/maps/global-notional-earth-surface.jpg'
];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  ]));
});

self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.protocol!=='http:'&&u.protocol!=='https:')return;

  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request)
        .then(r=>{const q=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',q));return r})
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  if(e.request.method!=='GET')return;

  e.respondWith(
    caches.match(e.request).then(hit=>{
      if(hit)return hit;
      return fetch(e.request).then(r=>{
        if(r&&r.ok){
          const q=r.clone();
          caches.open(CACHE).then(c=>c.put(e.request,q));
        }
        return r;
      });
    })
  );
});
