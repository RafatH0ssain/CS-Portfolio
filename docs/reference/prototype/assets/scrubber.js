/* Revision scrubber — the only script that changes page state by revision.
 * Reads the stops from <script type="application/json" id="revisions-data">.
 * Without JavaScript the page stays at the current revision and the
 * controls stay hidden. Budget: keep this file under 3 KB minified.
 *
 * Markup contract (the Astro build must emit exactly these hooks):
 *   [data-scrubber-controls]      wrapper, has `hidden` until this runs
 *   #rev-range                    <input type="range" min=0 max=N-1>
 *   [data-stop="i"]               stop buttons under the track
 *   .scrubber__tick (style --i)   ticks on the track
 *   .scrubber__track              gets --v = selected index
 *   [data-rev-field="rev|era|status|date|head|bio"]  text replaced per stop
 *   [data-lvl="n"]                gets .is-future (n > level) / .is-new (n == level, not locked)
 *   [data-only-lvl="n"]           .is-off unless level == n
 *   [data-max-lvl="n"]            .is-off unless level <= n
 *   [data-locked-only]            .is-on only at the locked stop (v1.0)
 *   [data-release]                every parts-list row; counted for "N of M built"
 *   [data-built]                  receives "N of M"
 *   [data-rev-live]               polite live region for announcements
 */
(function () {
  var dataEl = document.getElementById('revisions-data');
  var range = document.getElementById('rev-range');
  if (!dataEl || !range) return;

  var revs = JSON.parse(dataEl.textContent);
  var controls = document.querySelector('[data-scrubber-controls]');
  var track = document.querySelector('.scrubber__track');
  var live = document.querySelector('[data-rev-live]');
  var builtEl = document.querySelector('[data-built]');
  var q = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var lvlEls = q('[data-lvl]');
  var onlyEls = q('[data-only-lvl]');
  var maxEls = q('[data-max-lvl]');
  var lockedEls = q('[data-locked-only]');
  var fields = q('[data-rev-field]');
  var stops = q('[data-stop]');
  var ticks = q('.scrubber__tick');
  var rows = q('[data-release]');

  var current = 0;
  for (var k = 0; k < revs.length; k++) if (revs[k].current) current = k;

  function apply(i, announce) {
    var r = revs[i];
    var L = r.level;
    var locked = !!r.locked;

    lvlEls.forEach(function (el) {
      var n = Number(el.getAttribute('data-lvl'));
      el.classList.toggle('is-future', n > L);
      el.classList.toggle('is-new', n === L && !locked);
    });
    onlyEls.forEach(function (el) { el.classList.toggle('is-off', Number(el.getAttribute('data-only-lvl')) !== L); });
    maxEls.forEach(function (el) { el.classList.toggle('is-off', L > Number(el.getAttribute('data-max-lvl'))); });
    lockedEls.forEach(function (el) { el.classList.toggle('is-on', locked); });

    fields.forEach(function (el) {
      var v = r[el.getAttribute('data-rev-field')];
      if (v != null) el.textContent = v;
    });

    range.value = String(i);
    range.setAttribute('aria-valuetext', 'Revision ' + r.rev + ', ' + r.era);
    if (track) track.style.setProperty('--v', String(i));
    stops.forEach(function (b) {
      var s = Number(b.getAttribute('data-stop'));
      b.setAttribute('aria-pressed', String(s === i));
      b.classList.toggle('is-past', s < i);
    });
    ticks.forEach(function (t, s) { t.classList.toggle('is-past', s <= i); });

    var built = rows.filter(function (row) { return Number(row.getAttribute('data-lvl')) <= L; }).length;
    if (builtEl) builtEl.textContent = built + ' of ' + rows.length;
    if (announce && live) live.textContent = 'Revision ' + r.rev + ', ' + r.era + ': ' + built + ' of ' + rows.length + ' releases built.';
  }

  range.addEventListener('input', function () { apply(Number(range.value), true); });
  stops.forEach(function (b) {
    b.addEventListener('click', function () { apply(Number(b.getAttribute('data-stop')), true); });
  });

  if (controls) controls.hidden = false;
  apply(current, false);
})();
