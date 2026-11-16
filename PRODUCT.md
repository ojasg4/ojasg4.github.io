# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Home page:** PIs and PhD admissions committees, and people in the biotech / AI-for-biology industry, evaluating Ojas as a researcher and collaborator. They skim the research entries, may open the resume, and may get in touch.
- **Blog:** everyone, including the curious general public and students and peers. Posts are written to be understandable without a specialist background.

## Product Purpose

The personal site of Ojas Gupta, a biomedical engineering senior at Georgia Tech working in computational structural biology. It presents who he is, his research across four labs, his projects, and a blog that explains protein science in plain language. Success is balanced: a visitor understands the research and reads the writing; neither dominates.

## Positioning

A working structural biologist who also explains the field to non-specialists. The site itself demonstrates the subject: the name is spelled in real crystal structures (Howarth's protein alphabet), and posts teach with interactive structure animations.

## Operating Context

Static site on GitHub Pages (`ojasg4.github.io`), edited by hand by the owner in plain HTML. Read on laptops by evaluators and on phones by blog readers.

## Capabilities and Constraints

- Plain HTML, CSS, and vanilla JS. No framework, no build step, no bundler. No localStorage or sessionStorage.
- Home page section order is fixed: About, Research, Projects, Resume, Contact.
- All existing text content is preserved as written.
- Blog: manifest-driven index (`js/posts.js`) with pinning and newest-first sorting; one HTML file per post; highlight-to-comment that emails the owner; subscribe box that appends to a Google Sheet.
- The protein-name opening stays: the OJAS protein wordmark leads the home page and shrinks into the top-left of the nav bar on scroll, where it links home.
- The opening plays a noise-to-structure "denoising" intro on a dark screen on first visit; after it, the site may be light.
- Placeholders still open: resume PDF, GitHub link, several post bodies.

## Brand Commitments

- The OJAS wordmark built from real protein crystal structures (PDB 2wcd, 1b3u, 3ifz, 2ot8), in PyMOL rainbow cartoon rendering.
- Must not feel corporate or startup-like, and must not feel stiff or academic.

## Evidence on Hand

- Research entries from the Porter Lab (NIH/NLM), Douglas Lab (UCSF), Quiroz Lab (Emory), Kane Lab (Georgia Tech), and Kim Lab (University of Tokyo).
- One published paper: npj Viruses (PubMed 40295895).
- BioConnect: founder and executive director, 150+ members.
- PyMOL session for the wordmark (`name.pse`) and the rendered wordmark images in `assets/images/`.
- No testimonials, metrics, or press; none should be invented.

## Product Principles

1. The science is the showpiece: real structures and real data over decoration.
2. Explain like a person: anything on the blog should be followable by a non-specialist.
3. Credible to a PI without reading like a faculty page.
4. The owner edits it by hand, so the markup stays simple and readable.

## Accessibility & Inclusion

Respect `prefers-reduced-motion`: the intro and scroll-linked motion must have a static fallback. Fully usable from a 375px phone to a wide desktop.
