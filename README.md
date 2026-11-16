# website

Static HTML/CSS/vanilla JS, no build step.

## Structure
```
index.html        markup + content (placeholders marked with TODO)
css/style.css      dark editorial theme, fully responsive
js/main.js         morphing hero-image → header-logo, section reveals
assets/images/     drop the real hero photo here (see TODO in index.html)
assets/video/      reserved for later
```

## Design
The look is documented in [DESIGN.md](DESIGN.md) ("Structure Atlas": navy chart
ground, italic serif names, amber labels). Product facts live in
[PRODUCT.md](PRODUCT.md). Fonts are self-hosted in `assets/fonts/`.

## Home-page intro (noise → atoms → cartoon)
On a first visit, [js/main.js](js/main.js) draws ~35,000 points that denoise
into the atoms of the four structures, then fades the cartoon image in over
them. The atom positions come from the same PyMOL session and camera as
`assets/images/ojas.png`, exported to `assets/data/ojas-atoms.bin`
(uint16 x, y, rgb565 per atom), so they land exactly under the cartoon.
It plays on a fresh arrival and on every refresh. It is skipped when arriving
by a link from another page of this site, on back/forward, when the URL points
at a section, and under `prefers-reduced-motion`; any scroll, click or key
press ends it. Timing and the starting noise level are the `T_*` and `NOISE0`
values in `playIntro()`.

## "Arrows and coils" figure
[js/fold-story.js](js/fold-story.js) powers the click-through figure in
`blog/protein-structure-intro.html`. The captions are the `<li>` items in that
post (one per click); `data-scene` picks what the figure shows. Everything is
drawn on one canvas from coordinates embedded in the script: the 21 amino
acids (PyMOL fragment library) and ubiquitin (PDB 1UBQ). Back restarts the
previous step; the ribbon turns slowly on the helix and strand steps
(`SPIN_PERIOD`, seconds per turn).

