/* ENOCK — motion. Progressive enhancement: page is fully readable without any of this. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ---------- 1. Native reveals (no CDN dependency) ---------- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- 2. Hero cutout intro ---------- */
  var cut = document.querySelector(".hero__cut");
  function showHero() {
    if (!cut) return;
    if (window.gsap && !reduce) {
      window.gsap.fromTo(cut,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out", delay: 0.15 });
      window.gsap.fromTo(".hero__name-main",
        { opacity: 0, yPercent: 12, filter: "blur(14px)" },
        { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1.3, ease: "power3.out" });
    } else {
      cut.style.opacity = 1;
    }
  }

  /* ---------- 3. Lenis smooth scroll + GSAP parallax ---------- */
  function initMotion() {
    var lenis = null;
    if (window.Lenis && !reduce) {
      lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
      function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      // anchor links -> smooth
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (ev) {
          var id = a.getAttribute("href");
          if (id.length > 1 && document.querySelector(id)) {
            ev.preventDefault();
            lenis.scrollTo(id, { offset: 0, duration: 1.2 });
          }
        });
      });
    }

    if (window.gsap && window.ScrollTrigger && !reduce) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      if (lenis) {
        lenis.on("scroll", window.ScrollTrigger.update);
        window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        window.gsap.ticker.lagSmoothing(0);
      }
      // hero parallax on scroll
      window.gsap.to(".hero__cut", { yPercent: -12, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      window.gsap.to(".hero__name", { yPercent: 22, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      window.gsap.to(".hero__glow", { yPercent: 30, scale: 1.15, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      // about cutout drift
      window.gsap.fromTo(".about__cut", { yPercent: 8 }, { yPercent: -8, ease: "none",
        scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } });
    }
  }

  /* ---------- 4. Mouse parallax on hero ---------- */
  function initMouse() {
    if (reduce || matchMedia("(pointer:coarse)").matches) return;
    var glowEl = document.querySelector(".cursor-glow");
    var tx = 0, ty = 0, cx = 0, cy = 0, mx = 0, my = 0;
    window.addEventListener("mousemove", function (e) {
      var rx = e.clientX / window.innerWidth - 0.5;
      var ry = e.clientY / window.innerHeight - 0.5;
      tx = rx * 26; ty = ry * 16;
      mx = e.clientX; my = e.clientY;
      if (glowEl) glowEl.style.opacity = 1;
    });
    (function loop() {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      if (cut) cut.style.translate = cx.toFixed(2) + "px " + cy.toFixed(2) + "px";  /* composes with GSAP transform */
      if (glowEl) glowEl.style.transform = "translate(" + mx + "px," + my + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 5. boot ---------- */
  function boot() { showHero(); initMotion(); initMouse(); }
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
  // safety: if CDNs never load, make sure hero is visible
  setTimeout(function () { if (cut && getComputedStyle(cut).opacity === "0") cut.style.opacity = 1; }, 2500);
})();
