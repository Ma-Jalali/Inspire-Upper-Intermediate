/* Inspire service worker: makes the hub installable, keeps a copy for when the
   connection drops, and shows push reminders. Course content and progress always
   come from the network first, so students see the newest version when online. */
const CACHE = 'inspire-v134';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const CDN = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.plyr.io'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).catch(function(){}).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

function networkFirst(req, fallbackUrl){
  return new Promise(function(resolve){
    let settled = false;
    const fromCache = function(){
      return caches.match(req).then(function(r){ return r || (fallbackUrl ? caches.match(fallbackUrl) : null); });
    };
    /* a very slow network falls back to the saved copy after 6 seconds */
    const timer = setTimeout(function(){ fromCache().then(function(r){ if(r && !settled){ settled = true; resolve(r); } }); }, 6000);
    fetch(req).then(function(res){
      clearTimeout(timer);
      if(res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
      if(!settled){ settled = true; resolve(res); }
    }).catch(function(){
      clearTimeout(timer);
      fromCache().then(function(r){ if(!settled){ settled = true; resolve(r || Response.error()); } });
    });
  });
}
function staleWhileRevalidate(req){
  return caches.open(CACHE).then(function(c){
    return c.match(req).then(function(hit){
      const net = fetch(req).then(function(res){ if(res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(function(){ return hit; });
      return hit || net;
    });
  });
}
self.addEventListener('fetch', function(e){
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(req.mode === 'navigate'){ e.respondWith(networkFirst(req, './index.html')); return; }
  if(url.origin === self.location.origin){
    if(/\/(index\.html)?$/.test(url.pathname)){ e.respondWith(networkFirst(req)); return; }
    e.respondWith(staleWhileRevalidate(req)); return;
  }
  if(CDN.indexOf(url.hostname) !== -1){ e.respondWith(staleWhileRevalidate(req)); return; }
  /* everything else (the database, dictionaries, videos) goes straight to the network */
});

/* push: reminders and class news sent by the Supabase "push" function */
self.addEventListener('push', function(e){
  let d = {};
  try{ d = e.data ? e.data.json() : {}; }catch(err){ d = {body: e.data ? e.data.text() : ''}; }
  const title = d.title || 'Inspire';
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || '',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: d.tag || 'inspire',
    renotify: !!d.renotify,
    data: {url: d.url || './'}
  }));
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  const target = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
    for(const c of list){ if(c.url.indexOf(self.registration.scope) === 0 && 'focus' in c){ if(target !== c.url && 'navigate' in c) c.navigate(target); return c.focus(); } }
    return self.clients.openWindow(target);
  }));
});
