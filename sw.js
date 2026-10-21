/* Je parle baguette — cache des fichiers du site pour des ouvertures plus rapides.
   Pages : réseau d'abord (3 s max) puis cache ; fichiers versionnés, audios et images : cache d'abord. L'API n'est jamais interceptée. */
const CACHE="jpb-v1";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
const put=(req,res)=>{if(res&&res.ok&&res.type==="basic"){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(req,c)).catch(()=>{})}return res};
const netFirst=(req,ms)=>new Promise(ok=>{let done=false;const fb=()=>caches.match(req).then(r=>r||fetch(req)).then(ok,()=>ok(Response.error()));const t=setTimeout(()=>{if(!done){done=true;fb()}},ms);
  fetch(req).then(r=>{clearTimeout(t);if(!done){done=true;ok(put(req,r))}else put(req,r)}).catch(()=>{clearTimeout(t);if(!done){done=true;fb()}})});
const cacheFirst=req=>caches.match(req).then(r=>r||fetch(req).then(res=>put(req,res)));
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const u=new URL(req.url);if(u.origin!==location.origin)return;
  if(req.headers.has("range"))return;
  const p=u.pathname;
  if(req.mode==="navigate"||p.endsWith("/")||p.endsWith(".html")){e.respondWith(netFirst(req,3000));return}
  if(u.searchParams.has("v")||/\.(mp3|webp|png|jpg|jpeg|svg|woff2?)$/i.test(p)){e.respondWith(cacheFirst(req));return}
  e.respondWith(netFirst(req,3000))});
