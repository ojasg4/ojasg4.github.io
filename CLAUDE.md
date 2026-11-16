# Working rules for this site

Rules learned while building the site. They apply to any new page, figure or
animation. The look itself is in [DESIGN.md](DESIGN.md); who the site is for is
in [PRODUCT.md](PRODUCT.md); the file layout is in [README.md](README.md).

## Site
- Plain HTML, CSS and vanilla JS. No framework, no build step, no dependencies.
- No `localStorage` or `sessionStorage`. Decide "first visit vs. refresh" with
  the Navigation Timing API and `document.referrer`, never with storage.
- All paths are relative. The site deploys from `main` on GitHub Pages.
- Every edit to a CSS or JS file bumps its `?v=N` in **every** HTML file that
  loads it. Browsers cache by URL, so a stale `?v=` hides the change.
- Ojas writes the content. Do not reword his text; ask before changing a
  claim. Placeholder text is labelled "Placeholder:" and marked with a
  `<!-- TODO -->` so he can find and replace it.
- Text he will edit lives in the HTML, never inside a script.
- Blog dates must match between the post file and `js/posts.js`.
- Everything works from 375px wide to a wide desktop. Home content caps at
  1200px; blog pages use 85% of the width on desktop.

## Colour and type
- Use the tokens in `css/style.css` (`--sky`, `--chalk`, `--dim`, `--amber`,
  `--red`, `--helix`, `--strand`). No new colours without a reason.
- Colour carries one meaning across the whole site: **orange = alpha helix,
  blue = beta strand, grey = unassigned, red = the thing being pointed at.**
  A new representation of the same object (ribbon, spheres, a matrix) keeps
  the same colours.
- Names and captions are serif (often italic); labels and controls are small
  uppercase sans. No eyebrow label above a heading.

## Animation: general
- Slow is better than fast here. These are explanations, not transitions.
  If a step feels right to me, it is probably too quick for a first-time reader.
- Start from a state the reader can already half-read (the intro starts with
  the letters faintly visible, not from pure noise).
- Do not label things the reader does not need (PDB IDs were removed).
- Draw from real data where possible (real coordinates, real sequence), and
  say in the README where the data came from.
- Only call something what it is. Turns are not helices; a schematic is not
  a prediction. If a picture is illustrative, make it look like a schematic.
- 3D shape is hard to read from a still picture. Rotate slowly (about one turn
  per 30 s) when the point of the step is "see where this is".
- Always honour `prefers-reduced-motion`: show the end state, no motion.
- Animate on a canvas or with `transform`/`opacity`. Cap canvas pixel count
  and device pixel ratio (2) so phones keep up.
- Any intent to move on (scroll, key, click) ends an intro at once.
- The home intro plays on a fresh arrival and on every refresh, and is skipped
  when arriving from another page of this site or at a `#section`.

## Animation: click-through figures (`.story`)
- One figure lives inside the scrolling page, never taller than the screen
  (`max-width: min(100%, calc(62vh * 1.5))`, stage 3:2, 1:1 on phones).
- The captions are an `<ol class="story__steps">` in the post, one `<li>` per
  click, with `data-scene` choosing the picture. Without JS the list still
  reads as plain text.
- One idea per step. If two captions describe one picture, merge them.
- Click anywhere, Space or → goes forward. **Back restarts the previous step
  from its beginning; it never plays an animation in reverse.**
- A step keeps what the reader needs from the step before on screen (the
  dogma stays up while one word of it is highlighted) instead of replacing it.
- The last step shows "Scroll down to keep reading".
- Keep each figure minimal: one focal object, few labels, lots of dark space.
- A new figure reuses the `.story` markup and CSS, and gets its own script.

## Checking work
- Preview with the `site` server in `.claude/launch.json` (port 8000).
- The preview pane throttles animation, so timing cannot be judged there;
  check layout and end states there and say that speed was not verified.
- Check 1440px and 375px before calling a figure done.
- Commit only when asked.
