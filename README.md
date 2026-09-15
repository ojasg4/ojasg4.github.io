# website

Ojas Gupta — personal site. Static HTML/CSS/vanilla JS, no build step.

## Structure
```
index.html        markup + content (placeholders marked with TODO)
css/style.css      dark editorial theme, fully responsive
js/main.js         morphing hero-image → header-logo, section reveals
assets/images/     drop the real hero photo here (see TODO in index.html)
assets/video/      reserved for later
```

## The hero
A large image loads on page load in the top half of the screen. As you
scroll, it shrinks and docks into the header bar as a small logo that
links back to the top (home). All geometry is recomputed from the
viewport, so it resizes for any screen. `prefers-reduced-motion` is
respected — the morph is skipped and the image stays docked.

To use a real image, replace the placeholder data-URI on `#brandImg` in
`index.html` with e.g. `src="assets/images/hero.jpg"` (keep it ~square).

## Deploy
Static — deploys on Vercel with zero config (no build command). Push to
`main` to auto-deploy once the repo is connected.
