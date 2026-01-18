// Shared helpers
(function () {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".top-nav .nav-link").forEach(a => {
    const href = a.getAttribute("href");
    if (href === here) a.classList.add("active");
  });

  // Highlight the corresponding link in the bottom navigation when present.
  // Some pages include a sticky bottom nav to aid navigation on mobile. This
  // code mirrors the top-nav logic: it adds the `active` class to the
  // bottom nav link whose href matches the current page. Without this,
  // users would not see which section they're on when navigating via the
  // bottom bar.
  document.querySelectorAll(".bottom-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === here) a.classList.add("active");
  });
})();

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function getParam(name) {
  const url = new URL(location.href);
  return url.searchParams.get(name);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
