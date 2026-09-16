/* =============================================================
   Blog index — renders the post list from window.BLOG_POSTS
   (see js/posts.js). Pinned posts first, then newest-first by date.
   ============================================================= */
(function () {
  'use strict';

  var list = document.getElementById('postList');
  if (!list) return;

  var posts = (window.BLOG_POSTS || []).slice();

  posts.sort(function (a, b) {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;  // pinned first
    return parseDate(b.date) - parseDate(a.date);            // then newest first
  });

  if (!posts.length) {
    var empty = document.createElement('p');
    empty.className = 'page__intro';
    empty.textContent = 'No posts yet — check back soon.';
    list.appendChild(empty);
    return;
  }

  posts.forEach(function (p) {
    list.appendChild(renderItem(p));
  });

  /* ---- helpers ------------------------------------------------------- */
  function parseDate(s) {
    // Parse YYYY-MM-DD as a local date (avoids UTC off-by-one).
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : 0;
  }

  function formatDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || '');
    if (!m) return '';
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[+m[2] - 1] + ' ' + (+m[3]) + ', ' + m[1];
  }

  function renderItem(p) {
    var a = document.createElement('a');
    a.className = 'post-item';
    a.href = 'blog/' + p.slug + '.html';

    var meta = document.createElement('p');
    meta.className = 'post-item__date';
    meta.textContent = formatDate(p.date);
    if (p.pinned) {
      var badge = document.createElement('span');
      badge.className = 'post-item__pin';
      badge.textContent = 'Pinned';
      meta.appendChild(document.createTextNode(' '));
      meta.appendChild(badge);
    }

    var title = document.createElement('h2');
    title.className = 'post-item__title';
    title.textContent = p.title;

    a.appendChild(meta);
    a.appendChild(title);

    if (p.note) {
      var note = document.createElement('p');
      note.className = 'post-item__excerpt';
      note.textContent = p.note;
      a.appendChild(note);
    }
    return a;
  }
})();
