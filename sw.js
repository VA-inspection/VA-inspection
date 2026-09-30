const C='vaunce-check-v22';
const ASSETS=['./','./index.html','./manifest.json','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.map(k=>k===C?null:caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  if(r.mode==='navigate'){
    e.respondWith((async()=>{const c=await caches.open(C);
      try{const f=await fetch(r,{cache:'no-store'});c.put('./index.html',f.clone());return f;}
      catch(err){return (await c.match('./index.html'))||(await c.match('./'))||Response.error();}})());
    return;
  }
  e.respondWith((async()=>{const c=await caches.open(C);const hit=await c.match(r);
    if(hit)return hit;
    try{const res=await fetch(r);if(res&&res.status===200)c.put(r,res.clone());return res;}catch(err){return Response.error();}})());
});
