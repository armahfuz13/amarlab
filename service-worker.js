/* Amar Lab - Basic Service Worker (Cache First for static, Network First for JSON) */

const CACHE_VERSION = "amar-lab-v1.0.0";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DATA_CACHE = `${CACHE_VERSION}-data`;

// Core files to precache (update list if you rename/move files)
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./equipment.html",
  "./equipment-detail.html",
  "./safety.html",
  "./quiz.html",

  "./css/style.css",

  "./js/app.js",
  "./js/home.js",
  "./js/equipment.js",
  "./js/equipment-detail.js",
  "./js/quiz.js",

  "./data/equipment.json",

  "./assets/images/logo.png",
  "./assets/images/banner-cover.png",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Helpers
const isDataRequest = (request) =>
  request.url.includes("/data/") && request.method === "GET";

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Network-first for JSON/data so updates arrive when online
  if (isDataRequest(req)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(DATA_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => {
          // Optional fallback: if navigation fails, go home
          if (req.mode === "navigate") return caches.match("./index.html");
          return new Response("Offline", { status: 503, statusText: "Offline" });
        });
    })
  );
});
