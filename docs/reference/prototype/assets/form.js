/* Contact form enhancement. Without JavaScript the form posts to Formspree
 * and Formspree shows its own confirmation page. With it, the message is
 * sent in place and the result is written into [data-form-status].
 * Budget: under 1 KB minified. */
(function () {
  var form = document.querySelector('form[data-enhance]');
  if (!form || !window.fetch) return;
  var status = form.querySelector('[data-form-status]');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    button.disabled = true;
    status.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (res.ok) { form.reset(); status.textContent = 'Received. I will reply by email.'; }
        else { status.textContent = 'That did not send. Please email me directly instead.'; }
      })
      .catch(function () { status.textContent = 'That did not send. Please email me directly instead.'; })
      .then(function () { button.disabled = false; });
  });
})();
