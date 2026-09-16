/* =============================================================
   Reader comments — Google-Docs-style inline commenting.
   Select text in a post → a "Comment" button appears → type →
   send. The highlight stays visible for the rest of the visit and
   re-opens the comment when clicked. Submitting emails the comment
   to Ojas and shows a confirmation toast.

   NOTE: highlights live only for the current page visit. Persisting
   them across reloads / for other visitors would need a database;
   this is a static site (and the project rules bar localStorage).

   EMAIL DELIVERY: static sites can't send mail directly, so this
   POSTs to FormSubmit.co, which relays it to the address below.
   FormSubmit requires a ONE-TIME activation: the first comment sent
   triggers a confirmation email to that address — click the link in
   it once and all future comments arrive automatically.
   To change address, edit COMMENT_EMAIL. To swap providers, replace
   sendComment() with your endpoint.
   ============================================================= */
(function () {
  'use strict';

  var COMMENT_EMAIL = 'ojasgupta1000@gmail.com';               // TODO: change if needed
  var COMMENT_ENDPOINT = 'https://formsubmit.co/ajax/' + COMMENT_EMAIL;

  var postBody = document.querySelector('.post__body');
  if (!postBody) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var savedRange = null;   // cloned Range of the current selection
  var pop = null;          // the open popover element
  var btn = null;          // the floating "Comment" button
  var seq = 0;             // highlight id counter
  var comments = {};       // id -> { text, quote }

  /* ---- helpers ------------------------------------------------------- */
  function docRect(range) {
    var r = range.getBoundingClientRect();
    return {
      top: r.top + window.scrollY,
      bottom: r.bottom + window.scrollY,
      cx: r.left + r.width / 2 + window.scrollX
    };
  }

  function clampLeft(x, width) {
    var min = 8 + window.scrollX;
    var max = window.scrollX + document.documentElement.clientWidth - width - 8;
    return Math.max(min, Math.min(max, x));
  }

  function removeButton() {
    if (btn) { btn.remove(); btn = null; }
  }

  function closePopover() {
    if (pop) { pop.remove(); pop = null; }
  }

  /* ---- floating "Comment" button on selection ------------------------ */
  function onSelectionChange() {
    if (pop) return;   // don't re-show the button while a popover is open
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) { removeButton(); return; }

    var range = sel.getRangeAt(0);
    var text = sel.toString().trim();
    // Selection must be non-empty and live inside the post body.
    if (!text || !postBody.contains(range.commonAncestorContainer)) {
      removeButton();
      return;
    }

    savedRange = range.cloneRange();
    var rect = docRect(range);

    removeButton();
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cmt-btn';
    btn.textContent = '💬 Comment';
    btn.style.top = (rect.top - 44) + 'px';
    btn.style.left = clampLeft(rect.cx - 60, 120) + 'px';
    btn.addEventListener('mousedown', function (e) {
      // mousedown (not click) so the text selection isn't lost first.
      // stopPropagation so the document "click-outside" handler below
      // doesn't close the popover we're about to open.
      e.preventDefault();
      e.stopPropagation();
      openWritePopover(rect);
    });
    document.body.appendChild(btn);
  }

  /* ---- write-a-comment popover --------------------------------------- */
  function openWritePopover(rect) {
    removeButton();
    closePopover();

    pop = document.createElement('div');
    pop.className = 'cmt-pop';
    pop.innerHTML =
      '<textarea class="cmt-input" rows="3" placeholder="Add a comment…" ' +
      'aria-label="Your comment"></textarea>' +
      '<div class="cmt-pop__row">' +
      '<span class="cmt-hint">Enter to send</span>' +
      '<button type="button" class="cmt-send">Comment</button>' +
      '</div>';

    positionPopover(pop, rect);
    document.body.appendChild(pop);

    var input = pop.querySelector('.cmt-input');
    var send = pop.querySelector('.cmt-send');
    input.focus();

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
      if (e.key === 'Escape') { closePopover(); }
    });
    send.addEventListener('click', submit);

    function submit() {
      var text = input.value.trim();
      if (!text) { input.focus(); return; }
      var quote = savedRange ? savedRange.toString() : '';
      applyHighlight(text, quote);
      deliver(text, quote);
      closePopover();
      window.getSelection().removeAllRanges();
    }
  }

  /* ---- read-an-existing-comment popover ------------------------------ */
  function openReadPopover(mark) {
    closePopover();
    var data = comments[mark.dataset.commentId] || { text: '' };
    var r = mark.getBoundingClientRect();
    var rect = { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY,
                 cx: r.left + r.width / 2 + window.scrollX };

    pop = document.createElement('div');
    pop.className = 'cmt-pop cmt-pop--read';
    var body = document.createElement('div');
    body.className = 'cmt-read';
    body.textContent = data.text;           // textContent = no HTML injection
    var label = document.createElement('p');
    label.className = 'cmt-read__label';
    label.textContent = 'Reader comment';
    pop.appendChild(label);
    pop.appendChild(body);

    positionPopover(pop, rect);
    document.body.appendChild(pop);
  }

  function positionPopover(el, rect) {
    el.style.visibility = 'hidden';
    el.style.top = '0px';
    document.body.appendChild(el);
    var w = el.offsetWidth, h = el.offsetHeight;
    el.remove();
    el.style.visibility = '';
    var top = rect.bottom + 10;
    // Flip above if it would run past the selection sitting high on screen.
    if (rect.top - h - 10 > window.scrollY && rect.bottom + h > window.scrollY + window.innerHeight) {
      top = rect.top - h - 10;
    }
    el.style.top = top + 'px';
    el.style.left = clampLeft(rect.cx - w / 2, w) + 'px';
  }

  /* ---- highlight the selected range ---------------------------------- */
  function applyHighlight(text, quote) {
    if (!savedRange) return;
    var id = String(++seq);
    comments[id] = { text: text, quote: quote };

    var mark = document.createElement('mark');
    mark.className = 'comment-highlight';
    mark.dataset.commentId = id;
    mark.title = 'Click to see the comment';
    try {
      savedRange.surroundContents(mark);
    } catch (e) {
      // Selection crosses element boundaries — extract & wrap instead.
      mark.appendChild(savedRange.extractContents());
      savedRange.insertNode(mark);
    }
    savedRange = null;
  }

  /* ---- deliver the comment by email ---------------------------------- */
  function deliver(text, quote) {
    fetch(COMMENT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'New comment on your site',
        _template: 'table',
        page: document.title,
        url: window.location.href,
        highlighted_text: quote,
        comment: text
      })
    }).then(function (res) {
      toast(res.ok
        ? 'Your comment has been sent to Ojas!'
        : "Comment saved, but delivery failed — please try again.");
    }).catch(function () {
      toast("Couldn't reach the server — check your connection.");
    });
  }

  /* ---- confirmation toast -------------------------------------------- */
  var toastTimer;
  function toast(msg) {
    var t = document.querySelector('.cmt-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'cmt-toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    // reflow so the transition re-fires
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); },
      reduceMotion ? 4000 : 3200);
  }

  /* ---- wiring -------------------------------------------------------- */
  document.addEventListener('mouseup', function () { setTimeout(onSelectionChange, 0); });
  document.addEventListener('touchend', function () { setTimeout(onSelectionChange, 0); });

  // Click an existing highlight to re-read its comment.
  postBody.addEventListener('click', function (e) {
    var mark = e.target.closest ? e.target.closest('.comment-highlight') : null;
    if (mark) { e.preventDefault(); openReadPopover(mark); }
  });

  // Click / scroll elsewhere dismisses the popover & button.
  document.addEventListener('mousedown', function (e) {
    if (pop && !pop.contains(e.target) && !(e.target.closest && e.target.closest('.comment-highlight'))) {
      closePopover();
    }
    if (btn && e.target !== btn) removeButton();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closePopover(); removeButton(); }
  });
})();
