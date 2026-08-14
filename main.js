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
