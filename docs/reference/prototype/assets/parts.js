/* Parts explorer — keeps the lifted plate, its label, the mobile picker and
 * the spec panel in sync. Without JavaScript every spec panel is visible and
 * the labels are ordinary links. Budget: under 1.5 KB minified.
 *
 * Markup contract:
 *   [data-parts]                root; gets .is-enhanced
 *   .plate-wrap[data-part="i"]  a plate (pointer only; aria-hidden content)
 *   .part-label[data-part="i"]  the accessible link for part i (desktop)
 *   [data-pick="i"]             picker buttons (compact layout)
 *   .spec[data-part="i"]        spec panel for part i
 */
(function () {
  var root = document.querySelector('[data-parts]');
  if (!root) return;
  var all = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
  var wraps = all('.plate-wrap'), labels = all('.part-label'), picks = all('[data-pick]'), specs = all('.spec');

  function set(i) {
    wraps.forEach(function (w) { w.classList.toggle('is-active', Number(w.getAttribute('data-part')) === i); });
    labels.forEach(function (l) { l.classList.toggle('is-active', Number(l.getAttribute('data-part')) === i); });
    picks.forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-pick')) === i)); });
    specs.forEach(function (s) { s.hidden = Number(s.getAttribute('data-part')) !== i; });
  }

  labels.forEach(function (l) {
    var i = Number(l.getAttribute('data-part'));
    l.addEventListener('mouseenter', function () { set(i); });
    l.addEventListener('focus', function () { set(i); });
  });
  wraps.forEach(function (w) {
    var i = Number(w.getAttribute('data-part'));
    w.addEventListener('mouseenter', function () { set(i); });
    w.addEventListener('click', function () { set(i); });
  });
  picks.forEach(function (b) {
    b.addEventListener('click', function () { set(Number(b.getAttribute('data-pick'))); });
  });

  root.classList.add('is-enhanced');
  set(0);
})();
