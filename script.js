const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobile-nav");

function setMenuOpen(open) {
  if (!menuToggle || !mobileNav) return;

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileNav.hidden = !open;
  mobileNav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
}

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const from = 0;

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(from + (target - from) * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = String(target);
    }
  }

  requestAnimationFrame(tick);
}

const statCounts = document.querySelectorAll(".stat-count");

if (statCounts.length) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  statCounts.forEach((el) => {
    const target = Number(el.dataset.target);
    if (!Number.isFinite(target)) return;

    if (reducedMotion) {
      el.textContent = String(target);
      return;
    }

    if ("IntersectionObserver" in window) {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );

      counterObserver.observe(el);
    } else {
      el.textContent = String(target);
    }
  });
}

const header = document.querySelector(".site-header");
let lastScroll = 0;

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (!header) return;

    header.style.opacity = y > lastScroll && y > 80 ? "0.6" : "1";
    lastScroll = y;
  },
  { passive: true }
);
