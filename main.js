// Yizhou Lu — personal site interactions
// Count-up ticker, pipeline light-up, scroll reveals. All gated on reduced motion.

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- count-up numbers in the hero ticker ---------- */

function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  if (prefersReduced || !Number.isFinite(target)) {
    el.textContent = target.toLocaleString("en-US");
    return;
  }
  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased).toLocaleString("en-US");
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const tickerNums = document.querySelectorAll(".ticker-num");
const tickerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      tickerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
tickerNums.forEach((el) => tickerObserver.observe(el));

/* ---------- pipeline: stations light up in order on first view ---------- */

const pipeline = document.querySelector(".pipeline");
if (pipeline) {
  const pipeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        pipeline.classList.add("lit");
        pipeObserver.disconnect();
      }
    });
  }, { threshold: 0.25 });
  pipeObserver.observe(pipeline);
}

/* ---------- generic scroll reveal for cards and timeline ---------- */

const revealables = document.querySelectorAll(
  ".project, .mini-project, .tl-item, .rules, .rule"
);
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

/* ---------- highlight the current section in the nav ---------- */

const navAnchors = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const navTargets = navAnchors
  .map((a) => ({ a, sec: document.querySelector(a.getAttribute("href")) }))
  .filter((x) => x.sec);

if (navTargets.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navTargets.forEach(({ a, sec }) => {
        const on = sec === entry.target;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  navTargets.forEach(({ sec }) => navObserver.observe(sec));
}
