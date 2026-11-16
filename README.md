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

## Home-page intro (particles → atoms → cartoon)
[js/main.js](js/main.js) opens the home page as a sparse field of drifting
particles. Hovering pushes them away and dragging carries them along. A click
(or tap, Space, Enter) starts the denoising: ~35,000 points settle into the
atoms of the four structures, then the cartoon image fades in over them. A
second click, or any scroll, skips straight to the site. The atom positions
come from the same PyMOL session and camera as `assets/images/ojas.png`,
exported to `assets/data/ojas-atoms.bin` (uint16 x, y, rgb565 per atom), so
they land exactly under the cartoon.
It appears on a fresh arrival and on every refresh. It is skipped when arriving
by a link from another page of this site, on back/forward, when the URL points
at a section, and under `prefers-reduced-motion`. The tunables (`T_*`,
`IDLE_DENSITY`, `FAST_START`, `REACH`, `PUSH`, `STIR`) are at the top of
`run()` in `playIntro()`.

## "Arrows and coils" figure
[js/fold-story.js](js/fold-story.js) powers the click-through figure in
`blog/protein-structure-intro.html`. The captions are the `<li>` items in that
post (one per click); `data-scene` picks what the figure shows. Everything is
drawn on one canvas from coordinates embedded in the script: the 21 amino
acids (PyMOL fragment library) and ubiquitin (PDB 1UBQ). Back restarts the
previous step; the ribbon turns slowly on the helix and strand steps
(`SPIN_PERIOD`, seconds per turn).

## "From one structure to an ensemble" figure
[js/model-story.js](js/model-story.js) powers the click-through figure in
`blog/ai-protein-biology.html`, built the same way as the one above (captions
are the `<li>` items in the post). Real data: ubiquitin's sequence, C-alpha
trace and distance map (PDB 1UBQ) and the ten NMR models of PDB 1D3Z.
Schematic: the sequence alignment, the co-folding grid and the free-energy
curve. Working rules for figures are in [CLAUDE.md](CLAUDE.md).
