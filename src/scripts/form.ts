/* Contact form enhancement. Ported from docs/reference/prototype/assets/form.js.
 * Without JavaScript the form posts to Formspree and Formspree shows its own
 * confirmation page. With it, the message is sent in place and the result is
 * written into [data-form-status]. Errors appear inline, never in an alert().
 */
const form = document.querySelector<HTMLFormElement>('form[data-enhance]');
if (form && typeof window.fetch === 'function') {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (button) button.disabled = true;
    if (status) status.textContent = 'Sending…';
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (res.ok) {
          form.reset();
          if (status) status.textContent = 'Received. I will reply by email.';
        } else if (status) {
          status.textContent = 'That did not send. Please email me directly instead.';
        }
      })
      .catch(() => {
        if (status) status.textContent = 'That did not send. Please email me directly instead.';
      })
      .then(() => {
        if (button) button.disabled = false;
      });
  });
}
