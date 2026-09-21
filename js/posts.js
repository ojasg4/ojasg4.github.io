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
    slug: 'protein-structure-intro',
    title: 'A quick introduction to protein structure',
    date: '2026-09-21',
    note: 'New to this field? START HERE!!',
    pinned: true
  },
  {
    slug: 'research-journey',
    title: 'My research journey',
    date: '2026-09-16',                          // TODO: real publish date
    note: 'How I got to where I am. ',
    pinned: false
  },
  {
    slug: 'ai-protein-biology',
    title: 'An introduction to AI and protein biology',
    date: '2026-09-21',
    note: 'What I am currently spending all my time working on.',
    pinned: true
  },
  {
    slug: 'protein-name',
    title: 'Protein name visualization',
    date: '2026-09-15',                        
    note: 'Where the protein lettering on the homepage comes from.',
    pinned: false
  },
  {
    slug: 'bioconnect',
    title: 'Building BioConnect',
    date: '2026-09-16',
    note: 'Founding and running a 150+ member biotech student org.',
    pinned: false
  }
  // TODO: add future posts here.
];
