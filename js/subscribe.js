/* =============================================================
   Email subscription — appends each signup to a Google Sheet you
   own, via a Google Apps Script "web app" endpoint. No third-party
   account; the Sheet aggregates every address in one place. You then
   email the list manually whenever you publish.

   SETUP (one time — see README for the full walkthrough + script):
     1. Make a Google Sheet.
     2. Extensions → Apps Script, paste the doPost() from the README.
     3. Deploy → New deployment → Web app → Execute as "Me",
        Who has access "Anyone" → copy the web app URL.
     4. Paste that URL into SUBSCRIBE_ENDPOINT below.
   Until the URL is set, the form tells you it isn't wired up yet.
   ============================================================= */
(function () {
  'use strict';

  var SUBSCRIBE_ENDPOINT = ''; // TODO: paste your Apps Script web app URL

  var form = document.getElementById('subForm');
  if (!form) return;
  var input = document.getElementById('subEmail');
  var btn = form.querySelector('.subscribe__btn');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (input.value || '').trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast('Please enter a valid email address.');
      input.focus();
      return;
    }

    if (!SUBSCRIBE_ENDPOINT) {
      // Owner-facing hint during setup; real visitors won't see this
      // once the endpoint is configured.
      toast('Subscriptions aren’t wired up yet — add the Sheet URL (see README).');
      return;
    }

    btn.disabled = true;
    var original = btn.textContent;
    btn.textContent = 'Subscribing…';

    fetch(SUBSCRIBE_ENDPOINT, {
      method: 'POST',
      // Simple content-type + no-cors avoids an Apps Script preflight;
      // the response is opaque, so we confirm optimistically.
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'email=' + encodeURIComponent(email)
    }).then(function () {
      form.reset();
      toast('Thanks — you’re on the list!');
    }).catch(function () {
      toast('Something went wrong — please try again.');
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = original;
    });
  });

  /* Reuses the global .cmt-toast styles from style.css. */
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
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }
})();
