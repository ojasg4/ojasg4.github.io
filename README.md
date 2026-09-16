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

## Blog comments
Each post ([js/comments.js](js/comments.js)) lets readers highlight text,
type a comment, and send it. The highlight stays visible for that visit and
re-opens the comment on click. (Highlights are per-visit only — persisting
them across reloads / for all visitors would need a database.)

Comments are emailed to you via **FormSubmit.co** (no account, no API key).
**One-time activation:** the first comment sent triggers a confirmation
email to `ojasgupta1000@gmail.com` — click the link in it once, and every
comment after that arrives automatically. To test it yourself, leave a
comment on any post, then check your inbox for the FormSubmit confirmation.

- Change the destination by editing `COMMENT_EMAIL` in `js/comments.js`.
- The `?v=` on the `comments.js` tag is a cache-buster; bump the number
  whenever you change that file so returning visitors get the update.

## Blog index & publishing
The blog list ([blog.html](blog.html)) is rendered from a manifest
([js/posts.js](js/posts.js)) by [js/blog.js](js/blog.js): pinned posts
first, then newest-first by `date`.

To publish a new post:
1. Create `blog/<slug>.html` (copy an existing post as a template).
2. Add an entry to `js/posts.js` with `slug`, `title`, `date`
   (`YYYY-MM-DD`), optional `note`, and optional `pinned: true`.
3. Set the visible date in the post's `.post__date` to match.

Dates in `js/posts.js` and in the post files are **placeholders** — edit
them to the real publish dates.

## Email subscriptions → Google Sheet
The Subscribe box on the blog page appends each address to a Google Sheet
you own, via a Google Apps Script web app. Setup (one time):

1. Create a Google Sheet (the first tab is fine).
2. **Extensions → Apps Script**, replace the contents with:
   ```js
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     var email = ((e.parameter && e.parameter.email) || '').trim();
     if (email) {
       var rows = sheet.getDataRange().getValues();
       var seen = rows.some(function (r) {
         return String(r[1]).toLowerCase() === email.toLowerCase();
       });
       if (!seen) sheet.appendRow([new Date(), email]);
     }
     return ContentService.createTextOutput('ok');
   }
   ```
3. **Deploy → New deployment → Web app**. Execute as **Me**, Who has
   access **Anyone**. Authorize, then copy the web app URL.
4. Paste that URL into `SUBSCRIBE_ENDPOINT` in
   [js/subscribe.js](js/subscribe.js).

New signups then land in the Sheet automatically (deduplicated). When you
publish, email the list yourself from the Sheet. Until the URL is set, the
form shows a "not wired up yet" message.

## Deploy
Static — deploys on Vercel with zero config (no build command). Push to
`main` to auto-deploy once the repo is connected.
