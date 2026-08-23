// Yizhou Lu — personal site interactions
// Scroll reveals and theme toggle. All gated on reduced motion.

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- generic scroll reveal for cards and sections ---------- */

const revealables = document.querySelectorAll(
  ".proof-item, .flagship-copy, .match-card, .card, .rule"
);
if (!prefersReduced) {
  revealables.forEach((el) => el.classList.add("scroll-reveal"));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealables.forEach((el) => revealObserver.observe(el));
}

/* ---------- theme toggle (persists to localStorage, overrides system) ---------- */

const rootEl = document.documentElement;
const themeBtn = document.querySelector(".theme-toggle");

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function currentTheme() {
  return rootEl.dataset.theme || systemTheme();
}
function renderThemeBtn() {
  if (!themeBtn) return;
  const dark = currentTheme() === "dark";
  themeBtn.textContent = dark ? "☀" : "☾";
  themeBtn.setAttribute("aria-pressed", String(dark));
}
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    rootEl.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
    renderThemeBtn();
  });
  renderThemeBtn();
}
