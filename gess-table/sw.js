/* Offline cache. Once the table has loaded on a connection it keeps working with no internet.
   App files (html, js, css, json) check the network first so updates show up on the next reload;
   photos, logos, fonts and video come straight from the cache. */
const V = "edge-gess-v7";
const SHELL = /(\/|\.html|\.js|\.css|\.json|\.webmanifest)$/;

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c =>
    fetch("precache.json", { cache: "no-store" }).then(r => r.json())
      .then(list => Promise.all(list.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {}))))
  ).catch(() => {}));
});

self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())
));

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  const keep = res => { if (res && res.status === 200) { const cp = res.clone(); caches.open(V).then(c => c.put(req, cp)); } return res; };
  if (SHELL.test(url.pathname)) {
    e.respondWith(fetch(req, { cache: "no-cache" }).then(keep).catch(() => caches.match(req, { ignoreSearch: true })));
  } else {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(keep)));
  }
});
