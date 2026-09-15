/* =============================================================
   Ojas Gupta — site behavior
   1. Morph the brand image from a large hero element into the
      small header logo as the user scrolls. Fully responsive:
      all geometry is recomputed from the current viewport.
   2. Fade the header background in on scroll.
   3. Reveal content sections as they enter view.
   No dependencies, no build step.
   ============================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var brand = document.getElementById('brand');
  var header = document.getElementById('siteHeader');
  var hero = document.getElementById('hero');       // absent on blog pages
  var heroText = document.getElementById('heroText');
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- geometry, recomputed on resize -------------------------------- */
  var geo = {};

  function computeGeometry() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var headerH = clamp(Math.round(vh * 0.08), 56, 76);
    var small = headerH - 16;                     // docked size
    var big = Math.min(vw * 0.62, vh * 0.5, 440); // large hero size

    // Where the small image docks: aligned with the content gutter.
    var contentPad = parseFloat(getComputedStyle(root).getPropertyValue('--content-pad')) || 24;
    var gutter = Math.max((vw - 760) / 2, contentPad); // matches .site-header__inner
    if (gutter < contentPad) gutter = contentPad;

    geo = {
      vw: vw, vh: vh,
      headerH: headerH,
      big: big, small: small,
      bigLeft: (vw - big) / 2,
      bigTop: headerH + clamp((vh - headerH) * 0.1, 24, 90),
      smallLeft: gutter,
      smallTop: (headerH - small) / 2
    };

    // Publish header height + big size so CSS spacers stay in sync.
    root.style.setProperty('--header-h', headerH + 'px');
    root.style.setProperty('--big', big + 'px');
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---- apply the morph for a given progress 0..1 --------------------- */
  function applyProgress(p) {
    var size = lerp(geo.big, geo.small, p);
    var left = lerp(geo.bigLeft, geo.smallLeft, p);
    var top = lerp(geo.bigTop, geo.smallTop, p);

    brand.style.width = size + 'px';
    brand.style.height = size + 'px';
    brand.style.left = left + 'px';
    brand.style.top = top + 'px';
    brand.style.borderRadius = lerp(14, 10, p) + 'px';

    // Header bar fades in once the image starts docking.
    header.classList.toggle('scrolled', p > 0.04);

    // Hero text fades/lifts away in the first part of the scroll.
    if (heroText) {
      var t = clamp(p / 0.6, 0, 1);
      heroText.style.opacity = String(1 - t);
      heroText.style.transform = 'translateY(' + (-20 * t) + 'px)';
    }
  }

  /* ---- scroll → progress -------------------------------------------- */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      // Morph completes by the time the big image would scroll off the top.
      var end = geo.bigTop + geo.big;
      var p = clamp(window.scrollY / end, 0, 1);
      applyProgress(p);
      ticking = false;
    });
  }

  /* ---- no hero (blog pages) or reduced motion: dock permanently ------ */
  var docked = reduceMotion || !hero;

  function render() {
    computeGeometry();
    if (docked) {
      applyProgress(1);            // stays small, docked in the header
    } else {
      onScroll();
    }
  }

  render();

  window.addEventListener('resize', render, { passive: true });
  window.addEventListener('orientationchange', render);
  if (!docked) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  // Re-run once the placeholder image has painted (real photo may differ).
  var img = document.getElementById('brandImg');
  if (img && !img.complete) img.addEventListener('load', render);

  /* ---- reveal sections on scroll ------------------------------------ */
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    revealables.forEach(function (el) { io.observe(el); });
  }
})();
