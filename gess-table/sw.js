/* Offline cache. Once the table has loaded on a connection it keeps working with no internet.
   App files (html, js, css, json) check the network first so updates show up on the next reload;
   photos, logos, fonts and video come straight from the cache. */
const V = "edge-gess-v8";
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

/* Video players ask for byte ranges. Safari (and some TV browsers) refuse to play
   unless the answer is a proper 206 slice, so cut the cached file to the range asked for. */
async function ranged(req, res) {
  const range = req.headers.get("range");
  if (!range || !res || res.status !== 200) return res;
  const blob = await res.blob(), size = blob.size, m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  let start = m[1] ? +m[1] : 0, end = m[2] ? +m[2] : size - 1;
  if (!m[1] && m[2]) { start = Math.max(0, size - +m[2]); end = size - 1; }
  end = Math.min(end, size - 1);
  if (start >= size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + size } });
  return new Response(blob.slice(start, end + 1), { status: 206, statusText: "Partial Content", headers: {
    "Content-Type": res.headers.get("Content-Type") || "video/mp4", "Content-Range": `bytes ${start}-${end}/${size}`,
    "Content-Length": String(end - start + 1), "Accept-Ranges": "bytes" } });
}

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.searchParams.has("net")) return; /* a deliberate retry: straight to the network */
  const keep = res => { if (res && res.status === 200) { const cp = res.clone(); caches.open(V).then(c => c.put(req, cp)); } return res; };
  if (SHELL.test(url.pathname)) {
    e.respondWith(fetch(req, { cache: "no-cache" }).then(keep).catch(() => caches.match(req, { ignoreSearch: true })));
  } else {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit ? ranged(req, hit) : fetch(req).then(keep)));
  }
});
