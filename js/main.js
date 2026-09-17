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
  var brandImg = document.getElementById('brandImg');
  var header = document.getElementById('siteHeader');
  var hero = document.getElementById('hero');       // absent on blog pages
  var heroText = document.getElementById('heroText');

  var ASPECT_FALLBACK = 2.889;   // width / height of assets/images/ojas.png
  function aspect() {
    return (brandImg && brandImg.naturalWidth && brandImg.naturalHeight)
      ? brandImg.naturalWidth / brandImg.naturalHeight
      : ASPECT_FALLBACK;
  }
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- geometry, recomputed on resize -------------------------------- */
  var geo = {};

  function computeGeometry() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var a = aspect();

    var headerH = clamp(Math.round(vh * 0.08), 56, 76);

    // Docked (header) logo: sized by height so it fits the bar, width follows.
    var smallH = headerH - 22;
    var smallW = smallH * a;

    // Large hero image: fit to width, then cap by height so it stays in the
    // top half on tall/narrow screens.
    var bigW = Math.min(vw * 0.9, 720);
    var bigH = bigW / a;
    var maxBigH = vh * 0.42;
    if (bigH > maxBigH) { bigH = maxBigH; bigW = bigH * a; }

    // Top margin above the image (mirrors the CSS clamp(1.5rem,6vh,4rem)).
    var slotMt = clamp(vh * 0.06, 24, 64);

    // Docked logo sits at the left padding of the header bar (max-width 1200).
    var contentPad = parseFloat(getComputedStyle(root).getPropertyValue('--content-pad')) || 24;
    var gutter = Math.max((vw - 1200) / 2, 0) + contentPad;

    // Publish the values that affect header height first, then measure the
    // header's ACTUAL height (it grows when the nav wraps on narrow screens)
    // so the hero image and content clear it instead of hiding underneath.
    root.style.setProperty('--header-h', headerH + 'px');
    root.style.setProperty('--dock-w', smallW + 'px');
    var headerActual = header ? Math.max(headerH, header.offsetHeight) : headerH;

    geo = {
      vw: vw, vh: vh,
      headerH: headerH,
      bigW: bigW, bigH: bigH, smallW: smallW, smallH: smallH,
      bigLeft: (vw - bigW) / 2,
      bigTop: headerActual + slotMt,      // clears the (possibly wrapped) header
      smallLeft: gutter,
      smallTop: (headerH - smallH) / 2
    };

    // Publish remaining geometry so the CSS spacers stay in sync.
    root.style.setProperty('--header-pad', headerActual + 'px');
    root.style.setProperty('--big-w', bigW + 'px');
    root.style.setProperty('--big-h', bigH + 'px');
    root.style.setProperty('--slot-mt', slotMt + 'px');
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---- apply the morph for a given progress 0..1 --------------------- */
  function applyProgress(p) {
    var w = lerp(geo.bigW, geo.smallW, p);
    var h = lerp(geo.bigH, geo.smallH, p);
    var left = lerp(geo.bigLeft, geo.smallLeft, p);
    var top = lerp(geo.bigTop, geo.smallTop, p);

    brand.style.width = w + 'px';
    brand.style.height = h + 'px';
    brand.style.left = left + 'px';
    brand.style.top = top + 'px';

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
      var end = geo.bigTop + geo.bigH;
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
  // Re-run once the image has loaded, so geometry uses its real aspect ratio.
  if (brandImg && !brandImg.complete) brandImg.addEventListener('load', render);

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
