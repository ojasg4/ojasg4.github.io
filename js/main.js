/* =============================================================
   Ojas Gupta — site behavior
   1. Morph the protein wordmark from a large hero plate into the
      small header logo as the user scrolls. All geometry is
      recomputed from the current viewport.
   2. Intro: a sparse field of particles the visitor can push around;
      a click denoises it into the atoms of the four structures, then
      the cartoon render fades in over them.
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
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ASPECT_FALLBACK = 2.889;   // width / height of assets/images/ojas.png
  function aspect() {
    return (brandImg && brandImg.naturalWidth && brandImg.naturalHeight)
      ? brandImg.naturalWidth / brandImg.naturalHeight
      : ASPECT_FALLBACK;
  }

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

    // Large hero plate: fit to width, then cap by height so it stays in the
    // top half. The cap is larger on desktop (>=1024); tablet/mobile keep 720.
    var bigW = Math.min(vw * 0.9, vw >= 1024 ? 1040 : 720);
    var bigH = bigW / a;
    var maxBigH = vh * 0.42;
    if (bigH > maxBigH) { bigH = maxBigH; bigW = bigH * a; }

    // Room above the plate (also clears the catalogue labels over the letters).
    var slotMt = clamp(vh * 0.07, 34, 72);

    // Docked logo sits at the left padding of the header bar (max-width 1200).
    var contentPad = parseFloat(getComputedStyle(root).getPropertyValue('--content-pad')) || 24;
    var gutter = Math.max((vw - 1200) / 2, 0) + contentPad;

    // Publish the values that affect header height first, then measure the
    // header's ACTUAL height (it grows when the nav wraps on narrow screens).
    root.style.setProperty('--header-h', headerH + 'px');
    root.style.setProperty('--dock-w', smallW + 'px');
    var headerActual = header ? Math.max(headerH, header.offsetHeight) : headerH;

    geo = {
      vw: vw, vh: vh,
      headerH: headerH,
      bigW: bigW, bigH: bigH, smallW: smallW, smallH: smallH,
      bigLeft: (vw - bigW) / 2,
      bigTop: headerActual + slotMt,
      smallLeft: gutter,
      smallTop: (headerH - smallH) / 2
    };

    root.style.setProperty('--header-pad', headerActual + 'px');
    root.style.setProperty('--big-w', bigW + 'px');
    root.style.setProperty('--big-h', bigH + 'px');
    root.style.setProperty('--slot-mt', slotMt + 'px');
  }

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---- apply the morph for a given progress 0..1 --------------------- */
  function applyProgress(p) {
    brand.style.width = lerp(geo.bigW, geo.smallW, p) + 'px';
    brand.style.height = lerp(geo.bigH, geo.smallH, p) + 'px';
    brand.style.left = lerp(geo.bigLeft, geo.smallLeft, p) + 'px';
    brand.style.top = lerp(geo.bigTop, geo.smallTop, p) + 'px';

    // Catalogue labels fade as the plate leaves; hover targets switch off.
    brand.style.setProperty('--tag-o', String(clamp(1 - p * 5, 0, 1)));
    brand.classList.toggle('is-docked', p > 0.2);

    header.classList.toggle('scrolled', p > 0.04);

    if (heroText) {
      var t = clamp(p / 0.6, 0, 1);
      heroText.style.opacity = t > 0 ? String(1 - t) : '';
      heroText.style.transform = 'translateY(' + (-20 * t) + 'px)';
    }
  }

  /* ---- scroll → progress -------------------------------------------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var end = geo.bigTop + geo.bigH;
      applyProgress(clamp(window.scrollY / end, 0, 1));
      ticking = false;
    });
  }

  /* ---- no hero (blog pages) or reduced motion: dock permanently ------ */
  var docked = reduceMotion || !hero;

  function render() {
    computeGeometry();
    if (docked) applyProgress(1); else onScroll();
  }

  render();
  window.addEventListener('resize', render, { passive: true });
  window.addEventListener('orientationchange', render);
  if (!docked) window.addEventListener('scroll', onScroll, { passive: true });
  if (brandImg && !brandImg.complete) brandImg.addEventListener('load', render);

  // Legacy hook: content is visible by default; nothing waits on scroll.
  Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (el) {
    el.classList.add('in');
  });

  /* =============================================================
     FIRST-VISIT INTRO — noise → atoms → cartoon
     The inline script in index.html sets html.intro-pending when the
     intro should play. Atom positions come from the same PyMOL
     session and camera as the cartoon image, so they land exactly
     under it (assets/data/ojas-atoms.bin: uint16 x, y, rgb565).
     ============================================================= */
  if (hero && root.classList.contains('intro-pending')) {
    window.__introStarted = true;
    playIntro();
  }

  function endIntro(canvas) {
    root.classList.remove('intro-pending', 'intro-reveal');
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }

  function playIntro() {
    var canvas = document.createElement('canvas');
    canvas.className = 'intro-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx || !window.fetch) { endIntro(canvas); return; }

    fetch('assets/data/ojas-atoms.bin')
      .then(function (r) { if (!r.ok) throw new Error('atoms'); return r.arrayBuffer(); })
      .then(function (buf) { run(new Uint16Array(buf)); })
      .catch(function () { endIntro(canvas); });

    function run(data) {
      var total = Math.floor(data.length / 3);
      var n = Math.min(total, window.innerWidth < 700 ? 15000 : total);

      // Per-atom: target (u,v in image space), a random home anywhere on the
      // screen, an offset from being pushed around (DX, DY) with its velocity,
      // and colour. File order is pre-shuffled, so a prefix is a fair sample.
      var U = new Float32Array(n), V = new Float32Array(n);
      var EX = new Float32Array(n), EY = new Float32Array(n);
      var DX = new Float32Array(n), DY = new Float32Array(n);
      var VX = new Float32Array(n), VY = new Float32Array(n);
      var HX = new Float32Array(n), HY = new Float32Array(n);   // each point's own wandering velocity
      var R = new Uint8Array(n), G = new Uint8Array(n), B = new Uint8Array(n);
      var i;
      for (i = 0; i < n; i++) {
        U[i] = data[i * 3] / 65535 * 1.1 - 0.05;
        V[i] = data[i * 3 + 1] / 65535 * 1.1 - 0.05;
        var c = data[i * 3 + 2];
        R[i] = (c >> 11) * 255 / 31; G[i] = ((c >> 5) & 63) * 255 / 63; B[i] = (c & 31) * 255 / 31;
        EX[i] = Math.random() - 0.5; EY[i] = Math.random() - 0.5;
      }
      // Jitter table: cheap per-frame noise so the field simmers while noisy.
      var JN = 4096, JT = new Float32Array(JN);
      for (i = 0; i < JN; i++) JT[i] = Math.random() * 2 - 1;

      var W = 0, H = 0, scale = 1, img, px;
      function size() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var vw = window.innerWidth, vh = window.innerHeight;
        scale = dpr;
        while (vw * scale * vh * scale > 5e6 && scale > 1) scale -= 0.25;
        W = Math.round(vw * scale); H = Math.round(vh * scale);
        canvas.width = W; canvas.height = H;
        img = ctx.createImageData(W, H);
        px = new Uint32Array(img.data.buffer);
      }
      size();
      window.addEventListener('resize', size);

      /* Tunables */
      var T_DENOISE = 6200, T_SETTLE = 900, T_FADE = 2600;
      var IDLE_DENSITY = 0.08;                         // share of the points drifting before the click
      var FAST_START = 2.4;                            // > 1: the first frames move faster, the end settles slowly
      var REACH = 95;                                  // how far the pointer pushes, in CSS pixels
      var PUSH = 240, STIR = 1.6;                       // hover push strength; how much a drag carries points along

      // The field waits, drifting, until a click (or key) starts the denoising.
      var phase = 'idle', start = 0, done = false, revealed = false, frame = 0, last = 0;
      var mouse = { x: -1e5, y: -1e5, vx: 0, vy: 0, down: false, moved: 0, dragged: false, seen: 0 };

      function begin() {
        if (phase !== 'idle') return;
        phase = 'run';
        start = performance.now();
      }

      function onMove(e) {
        var x = e.clientX * scale, y = e.clientY * scale, now = performance.now();
        var dt = Math.max(8, now - mouse.seen);
        if (mouse.seen && dt < 120) { mouse.vx = (x - mouse.x) / dt * 16; mouse.vy = (y - mouse.y) / dt * 16; }
        if (mouse.down) { mouse.moved += Math.abs(x - mouse.x) + Math.abs(y - mouse.y); if (mouse.moved > 10 * scale) mouse.dragged = true; }
        mouse.x = x; mouse.y = y; mouse.seen = now;
      }
      function onDown(e) { onMove(e); mouse.down = true; mouse.moved = 0; mouse.dragged = false; }
      function onUp() { mouse.down = false; }
      function onLeave() { mouse.x = mouse.y = -1e5; mouse.down = false; }
      // A click that was not a drag starts the denoising; a second click skips to the site.
      // Clicks never reach the (still hidden) page underneath.
      function onClick(e) {
        e.preventDefault(); e.stopPropagation();
        if (mouse.dragged) { mouse.dragged = false; return; }
        if (phase === 'idle') begin(); else finish();
      }
      function onKey(e) {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (phase === 'idle' && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); begin(); }
        else finish();
      }
      var LEAVE = ['scroll', 'wheel', 'touchmove'];    // any intent to scroll ends the intro at once

      function finish() {
        if (done) return;
        done = true;
        window.removeEventListener('resize', size);
        LEAVE.forEach(function (ev) { window.removeEventListener(ev, finish); });
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('click', onClick, true);
        window.removeEventListener('keydown', onKey);
        endIntro(canvas);
      }
      LEAVE.forEach(function (ev) { window.addEventListener(ev, finish, { passive: true }); });
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('pointerup', onUp, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      window.addEventListener('click', onClick, true);
      window.addEventListener('keydown', onKey);

      function tick(now) {
        if (done) return;
        if (window.scrollY > 8) { finish(); return; }   // scrolled away: stop at once
        var dt = last ? Math.min(now - last, 50) / 1000 : 0.016;
        last = now;
        var el = phase === 'run' ? now - start : 0;
        var t = clamp(el / T_DENOISE, 0, 1);
        var s = Math.pow(1 - t, FAST_START);           // noise: 1 = scattered over the whole screen
        var a = Math.sqrt(1 - s * s);                  // signal  = sqrt(alpha-bar)
        var mix = t;                                   // chalk points take on their colours
        var grow = clamp(t / 0.45, 0, 1);              // sparse at first, then every point joins in
        var shown = Math.round(n * (IDLE_DENSITY + (1 - IDLE_DENSITY) * grow * grow * (3 - 2 * grow)));

        var rect = brand.getBoundingClientRect();
        var bx = rect.left * scale, by = rect.top * scale;
        var bw = rect.width * scale, bh = rect.height * scale;
        var jit = phase === 'run' ? s * 0.9 * scale * clamp(t * 8, 0, 1) : 0;   // faint simmer while denoising
        var dot = Math.max(1, Math.round(scale * bw / (900 * scale) * 1.5));
        if (phase === 'idle') dot = Math.max(dot, Math.round(scale * 1.5));   // few points: draw them a little larger
        var j0 = (frame * 131) % JN;

        // Pointer forces: hovering pushes points away, dragging carries them along.
        var reach = REACH * scale * (mouse.down ? 1.5 : 1), reach2 = reach * reach;
        var mx = mouse.x, my = mouse.y, mvx = mouse.down ? mouse.vx : 0, mvy = mouse.down ? mouse.vy : 0;
        var damp = Math.exp(-dt * 2.2);                // velocities die away
        var spring = 6 + 6 * a * a;                    // pushed points ease back, so the pointer leaves a dimple, not a hole
        var drift = phase === 'idle' ? 9 * scale : 0;  // typical wandering speed while waiting, px per second
        // Smooth Brownian motion: every point's velocity wanders on its own (it
        // forgets its direction over about TAU seconds), so there is no shared
        // flow and the field stays evenly spread.
        var TAU = 2.5, keep = 1 - dt / TAU, kick = Math.sqrt(2 * dt / TAU) * drift * 1.73;
        mouse.vx *= 0.85; mouse.vy *= 0.85;

        px.fill(0);
        for (var k = 0; k < shown; k++) {
          var x = a * (bx + U[k] * bw) + (1 - a) * W / 2 + s * EX[k] * W + DX[k] + jit * JT[(k + j0) % JN];
          var y = a * (by + V[k] * bh) + (1 - a) * H / 2 + s * EY[k] * H + DY[k] + jit * JT[(k * 7 + j0 + 13) % JN];

          var vx = VX[k], vy = VY[k];
          var ddx = x - mx, ddy = y - my, d2 = ddx * ddx + ddy * ddy;
          if (d2 < reach2) {
            var d = Math.sqrt(d2) + 0.01, f = 1 - d / reach;
            vx += ddx / d * f * PUSH * scale * dt + mvx * f * STIR;
            vy += ddy / d * f * PUSH * scale * dt + mvy * f * STIR;
          }
          if (drift) {                                 // the point's home wanders and wraps at the edges
            var hx = HX[k] * keep + kick * (Math.random() * 2 - 1), hy = HY[k] * keep + kick * (Math.random() * 2 - 1);
            HX[k] = hx; HY[k] = hy;
            var ex = EX[k] + hx * dt / W, ey = EY[k] + hy * dt / H;
            EX[k] = ex > 0.5 ? ex - 1 : ex < -0.5 ? ex + 1 : ex;
            EY[k] = ey > 0.5 ? ey - 1 : ey < -0.5 ? ey + 1 : ey;
          }
          vx -= DX[k] * spring * dt;
          vy -= DY[k] * spring * dt;
          vx *= damp; vy *= damp;
          VX[k] = vx; VY[k] = vy;
          DX[k] += vx * dt; DY[k] += vy * dt;

          var xi = x | 0, yi = y | 0;
          if (xi < 0 || yi < 0 || xi > W - dot || yi > H - dot) continue;
          var r = 242 + (R[k] - 242) * mix, gg = 240 + (G[k] - 240) * mix, b = 230 + (B[k] - 230) * mix;
          var col = (255 << 24) | (b << 16) | (gg << 8) | r;   // little-endian ABGR
          var o = yi * W + xi;
          for (var dy = 0; dy < dot; dy++) for (var dxx = 0; dxx < dot; dxx++) px[o + dy * W + dxx] = col;
        }
        ctx.putImageData(img, 0, 0);
        frame++;

        if (phase === 'run') {
          var tReveal = T_DENOISE + T_SETTLE;
          if (!revealed && el >= tReveal) {
            revealed = true;
            root.classList.add('intro-reveal');          // cartoon fades in over the atoms
            canvas.style.opacity = '0';                  // atoms fade out beneath it
          }
          if (el >= tReveal + T_FADE) { finish(); return; }
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }
})();
