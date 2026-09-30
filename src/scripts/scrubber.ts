/* Revision scrubber — the only script that changes page state by revision.
 * Ported from docs/reference/prototype/assets/scrubber.js. Reads the stops from
 * <script type="application/json" id="revisions-data">. Without JavaScript the
 * page stays at the current revision and the controls stay hidden.
 *
 * Markup contract (the Astro build emits exactly these hooks):
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
type Stop = {
  rev: string;
  era: string;
  short: string;
  date: string;
  status: string;
  level: number;
  current?: boolean;
  locked?: boolean;
  head?: string;
  bio?: string;
};

const dataEl = document.getElementById('revisions-data');
const range = document.getElementById('rev-range') as HTMLInputElement | null;
if (dataEl && range) {
  const revs: Stop[] = JSON.parse(dataEl.textContent ?? '[]');
  const controls = document.querySelector<HTMLElement>('[data-scrubber-controls]');
  const track = document.querySelector<HTMLElement>('.scrubber__track');
  const live = document.querySelector<HTMLElement>('[data-rev-live]');
  const builtEl = document.querySelector<HTMLElement>('[data-built]');
  const q = <T extends Element>(sel: string) => Array.from(document.querySelectorAll<T>(sel));

  const lvlEls = q<HTMLElement>('[data-lvl]');
  const onlyEls = q<HTMLElement>('[data-only-lvl]');
  const maxEls = q<HTMLElement>('[data-max-lvl]');
  const lockedEls = q<HTMLElement>('[data-locked-only]');
  const fields = q<HTMLElement>('[data-rev-field]');
  const stops = q<HTMLButtonElement>('[data-stop]');
  const ticks = q<HTMLElement>('.scrubber__tick');
  const rows = q<HTMLElement>('[data-release]');

  let current = 0;
  revs.forEach((r, k) => {
    if (r.current) current = k;
  });

  const apply = (i: number, announce: boolean) => {
    const r = revs[i];
    if (!r) return;
    const L = r.level;
    const locked = !!r.locked;

    lvlEls.forEach((el) => {
      const n = Number(el.getAttribute('data-lvl'));
      el.classList.toggle('is-future', n > L);
      el.classList.toggle('is-new', n === L && !locked);
    });
    onlyEls.forEach((el) => el.classList.toggle('is-off', Number(el.getAttribute('data-only-lvl')) !== L));
    maxEls.forEach((el) => el.classList.toggle('is-off', L > Number(el.getAttribute('data-max-lvl'))));
    lockedEls.forEach((el) => el.classList.toggle('is-on', locked));

    fields.forEach((el) => {
      const v = r[el.getAttribute('data-rev-field') as keyof Stop];
      if (v != null) el.textContent = String(v);
    });

    range.value = String(i);
    range.setAttribute('aria-valuetext', `Revision ${r.rev}, ${r.era}`);
    if (track) track.style.setProperty('--v', String(i));
    stops.forEach((b) => {
      const s = Number(b.getAttribute('data-stop'));
      b.setAttribute('aria-pressed', String(s === i));
      b.classList.toggle('is-past', s < i);
    });
    ticks.forEach((t, s) => t.classList.toggle('is-past', s <= i));

    const built = rows.filter((row) => Number(row.getAttribute('data-lvl')) <= L).length;
    if (builtEl) builtEl.textContent = `${built} of ${rows.length}`;
    if (announce && live) {
      live.textContent = `Revision ${r.rev}, ${r.era}: ${built} of ${rows.length} releases built.`;
    }
  };

  range.addEventListener('input', () => apply(Number(range.value), true));
  stops.forEach((b) => {
    b.addEventListener('click', () => apply(Number(b.getAttribute('data-stop')), true));
  });

  if (controls) controls.hidden = false;
  apply(current, false);
}
