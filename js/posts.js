/* =============================================================
   BLOG POST MANIFEST — the single source of truth for the blog
   index (js/blog.js renders from this).

   To publish a new post:
     1. Create blog/<slug>.html (copy an existing post as a template).
     2. Add an entry to the TOP of this array (order here doesn't
        matter for sorting, but it's a nice changelog).
     3. Set `date` (YYYY-MM-DD). The index sorts newest-first.
     4. Optional `note` — a one-line description shown under the title.
     5. `pinned: true` keeps a post at the very top regardless of date.

   Dates below are PLACEHOLDERS — edit them to the real publish dates.
   ============================================================= */
window.BLOG_POSTS = [
  {
    slug: 'research-journey',
    title: 'My research journey',
    date: '2025-08-15',                          // TODO: real publish date
    note: 'What I took away from each lab — fold-switching at NIH/NLM, ' +
          'DNA–protein hybrids at UCSF, IDPs at Emory, and nanobodies in the Kane Lab.',
    pinned: true
  },
  {
    slug: 'ai-protein-biology',
    title: 'An introduction to AI and protein biology',
    date: '2026-09-17',                          // TODO: confirm publish date
    note: 'What I am currently spending all my time working on.',
    pinned: false
  },
  {
    slug: 'bioconnect',
    title: 'Building BioConnect',
    date: '2025-06-01',                          // TODO: real publish date
    note: 'Founding and running a 150+ member biotech student org.',
    pinned: false
  }
  // TODO: add future posts here.
];
