/* Parts explorer — keeps the lifted plate, its label, the mobile picker and
 * the spec panel in sync. Ported from docs/reference/prototype/assets/parts.js.
 * Without JavaScript every spec panel is visible and the labels are ordinary
 * links.
 *
 * Markup contract:
 *   [data-parts]                root; gets .is-enhanced
 *   .plate-wrap[data-part="i"]  a plate (pointer only; aria-hidden content)
 *   .part-label[data-part="i"]  the accessible link for part i (desktop)
 *   [data-pick="i"]             picker buttons (compact layout)
 *   .spec[data-part="i"]        spec panel for part i
 */
const root = document.querySelector<HTMLElement>('[data-parts]');
if (root) {
  const all = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
  const wraps = all<HTMLElement>('.plate-wrap');
  const labels = all<HTMLAnchorElement>('.part-label');
  const picks = all<HTMLButtonElement>('[data-pick]');
  const specs = all<HTMLElement>('.spec');

  const set = (i: number) => {
    wraps.forEach((w) => w.classList.toggle('is-active', Number(w.getAttribute('data-part')) === i));
    labels.forEach((l) => l.classList.toggle('is-active', Number(l.getAttribute('data-part')) === i));
    picks.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-pick')) === i)));
    specs.forEach((s) => { s.hidden = Number(s.getAttribute('data-part')) !== i; });
  };

  labels.forEach((l) => {
    const i = Number(l.getAttribute('data-part'));
    l.addEventListener('mouseenter', () => set(i));
    l.addEventListener('focus', () => set(i));
  });
  wraps.forEach((w) => {
    const i = Number(w.getAttribute('data-part'));
    w.addEventListener('mouseenter', () => set(i));
    w.addEventListener('click', () => set(i));
  });
  picks.forEach((b) => {
    b.addEventListener('click', () => set(Number(b.getAttribute('data-pick'))));
  });

  root.classList.add('is-enhanced');
  set(0);
}
