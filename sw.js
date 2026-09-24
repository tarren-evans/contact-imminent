const VERSION='0.11.6.14';
const CACHE=`contact-imminent-v${VERSION}`;
const CORE=[
  './',
  './index.html',
  `./styles.css?v=${VERSION}`,
  `./game.js?v=${VERSION}`,
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/maps/global-deep-space.png',
  './assets/maps/global-notional-earth-surface.jpg',

  // Tactical OA visual worlds
  './assets/maps/oa-kestrel-overscan.png',
  './assets/maps/oa-vantage-overscan.png',
  './assets/maps/oa-verdant-overscan.png',
  './assets/maps/oa-mirage-overscan.png',
  './assets/maps/oa-tempest-overscan.png',
  './assets/maps/oa-arctic-overscan.png',

  // Global/descent OA basemaps
  './assets/maps/oa-kestrel-basemap.png',
  './assets/maps/oa-vantage-basemap.png',
  './assets/maps/oa-verdant-basemap.png',
  './assets/maps/oa-mirage-basemap.png',
  './assets/maps/oa-tempest-basemap.png',
  './assets/maps/oa-arctic-basemap.png'
];

self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('contact-imminent-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.protocol!=='http:'&&u.protocol!=='https:')return;

  if(e.request.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        const r=await fetch(e.request,{cache:'no-store'});
        if(r&&r.ok){
          const c=await caches.open(CACHE);
          await c.put('./index.html',r.clone());
        }
        return r;
      }catch(_){
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  if(e.request.method!=='GET')return;

  const sameOrigin=u.origin===self.location.origin;
  const isShell=sameOrigin&&(
    u.pathname.endsWith('/styles.css')||
    u.pathname.endsWith('/game.js')||
    u.pathname.endsWith('/manifest.webmanifest')||
    u.pathname.endsWith('/sw.js')
  );

  if(isShell){
    e.respondWith((async()=>{
      try{
        const r=await fetch(e.request,{cache:'no-store'});
        if(r&&r.ok){
          const c=await caches.open(CACHE);
          await c.put(e.request,r.clone());
        }
        return r;
      }catch(_){
        return (await caches.match(e.request)) || Response.error();
      }
    })());
    return;
  }

  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(async r=>{
    if(r&&r.ok&&sameOrigin){
      const c=await caches.open(CACHE);
      c.put(e.request,r.clone());
    }
    return r;
  })));
});
