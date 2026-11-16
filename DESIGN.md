# Design system: Structure Atlas

Proteins charted the way a star atlas charts the sky. Recorded from the built site (`css/style.css`); edit the tokens there.

## Colour

| Token | Value | Job |
|---|---|---|
| `--sky` | `#0a1224` | Chart ground (every page is dark) |
| `--indigo` | `#111c36` | Raised plates: project plates, subscribe box, popovers |
| `--chart` | `#263a57` | Coordinate grid and quiet rules |
| `--chalk` | `#f2f0e6` | Primary type and plotted points |
| `--dim` | `#b3bdd0` | Secondary type |
| `--amber` | `#ffb36b` | Annotations: links, coordinate labels, dates |
| `--red` | `#ff5a36` | The object under the eye: hover rings, primary action, current page |
| `--helix` / `--strand` | `#ffb36b` / `#8cc4f0` | Alpha helices / beta strands in figures |

Strategy: restrained. Amber annotates, red is reserved for whatever the visitor is pointing at or about to do. The only saturated colour at scale is the rainbow protein render itself.

## Type

- **Names** (page titles, section headings, entry titles): Gentium Book Plus italic, weight 400.
- **Blog body**: Gentium Book Plus regular, 1.15 to 1.3rem, line-height 1.7.
- **Coordinates and labels** (nav, dates, lab names, buttons) and home-page body: Albert Sans, small sizes tracked 0.12 to 0.16em in capitals, tabular figures.
- Fonts are self-hosted in `assets/fonts/`.

## Form

- Ground: a faint 96px coordinate grid over `--sky`.
- Frames: 1px hairlines in `--frame` with a small ringed node point at each end (section dividers).
- Hierarchy by dot size: nav items, research entries and blog posts each carry a chalk point; bigger means weightier, a ring means pinned or pointed at.
- Research entries are plotted along one dashed line, with the lab as an amber coordinate label to the left.
- Corners 4px; no shadows except floating popovers.
- No small uppercase label above a heading: headings stand alone, with any date or note beneath.

## Motion

- One authored moment: the first-visit intro, where noise denoises into the atoms of the wordmark and the cartoon fades in over them (`js/main.js`).
- The wordmark docks into the header as the page scrolls. Nothing else animates on scroll.
- Hover and focus changes take 0.2s; reduced motion disables the intro and transitions.
