// Small pure functions shared by every page. See docs/BUILD-PLAN.md, step 3.
// They only read content/; nothing here knows about markup.
import type { CollectionEntry } from 'astro:content';
import { experience, profile, revisions, STREAMS } from './content';

type Stop = (typeof revisions)[number];
type Profile = typeof profile;
type Org = (typeof experience)[number];

export type { Stop, Profile, Org };

/** The stop the site opens at: the one with `current: true`. */
export function currentStop(stops: Stop[] = revisions): Stop {
  const found = stops.find((s) => s.current);
  if (!found) throw new Error('content/revisions.json has no stop with "current": true');
  return found;
}

/** Head and bio for a stop. The current stop borrows the profile's. */
export function stopText(stop: Stop, p: Profile = profile): { head: string; bio: string } {
  return { head: stop.head ?? p.head, bio: stop.bio ?? p.bio };
}

/** --chars for .name: the length of the longer of the two name lines. */
export function nameChars(p: Profile = profile): number {
  return Math.max(p.name.first.length, p.name.last.length);
}

/** Projects in `order`, each tagged with its two-digit part number. */
export function numberedProjects(
  projects: CollectionEntry<'projects'>[],
): (CollectionEntry<'projects'> & { partNo: string; n: number })[] {
  return [...projects]
    .sort((a, b) => a.data.order - b.data.order)
    .map((p, i) => ({ ...p, n: i + 1, partNo: String(i + 1).padStart(2, '0') }));
}

/**
 * State of an item that first exists at `level n`, viewed at a stop of `level s`:
 * 'future' (not built yet), 'new' (built at this exact revision) or 'built'.
 */
export function stateAt(n: number, stop: Stop): 'future' | 'new' | 'built' {
  if (n > stop.level) return 'future';
  if (n === stop.level && !stop.locked) return 'new';
  return 'built';
}

/** The initial class list for an element the scrubber drives. */
export function stateClass(n: number, stop: Stop): string {
  const s = stateAt(n, stop);
  return s === 'future' ? 'is-future' : s === 'new' ? 'is-new' : '';
}

/** How many projects exist at a stop, and how many there are in total. */
export function builtCount(projects: CollectionEntry<'projects'>[], stop: Stop): { built: number; total: number } {
  return { built: projects.filter((p) => p.data.level <= stop.level).length, total: projects.length };
}

/** Resolve a list of slugs to projects. Throws on an unknown slug. */
function bySlug(slugs: string[], field: string, projects: CollectionEntry<'projects'>[]) {
  return slugs.map((slug) => {
    const found = projects.find((p) => p.id === slug);
    if (!found) {
      throw new Error(
        `content/profile.json lists "${slug}" in ${field}, but content/projects/${slug}.md does not exist.`,
      );
    }
    return found;
  });
}

/** The featured projects, top card first. Throws on an unknown slug. */
export function featuredProjects(projects: CollectionEntry<'projects'>[]) {
  return bySlug(profile.featured, 'featured', projects);
}

/** The plate stack: profile.deck when the owner set one, else profile.featured. */
export function deckProjects(projects: CollectionEntry<'projects'>[]) {
  return bySlug(profile.deck ?? profile.featured, profile.deck ? 'deck' : 'featured', projects);
}

/** The plate stack, each plate tagged with its deck position as the part number. */
export function numberedDeck(
  projects: CollectionEntry<'projects'>[],
): (CollectionEntry<'projects'> & { partNo: string; n: number })[] {
  return deckProjects(projects).map((p, i) => ({ ...p, n: i + 1, partNo: String(i + 1).padStart(2, '0') }));
}

export interface PartSheetNumber {
  partNo: string;
  sheetNo: number;
  totalParts: number;
}

/**
 * How a project sheet numbers itself: its place in the plate deck when it sits on
 * a plate, otherwise its place in the full parts list, so a sheet never disagrees
 * with the plate stack it was reached from.
 */
export function partSheetNumber(
  project: CollectionEntry<'projects'>,
  projects: CollectionEntry<'projects'>[],
): PartSheetNumber {
  const deck = numberedDeck(projects);
  const onDeck = deck.findIndex((p) => p.id === project.id);
  if (onDeck !== -1) {
    return { partNo: deck[onDeck].partNo, sheetNo: onDeck + 1, totalParts: deck.length };
  }
  const ordered = numberedProjects(projects);
  const i = ordered.findIndex((p) => p.id === project.id);
  return { partNo: ordered[i].partNo, sheetNo: i + 1, totalParts: ordered.length };
}

export type LetteredOrg = Org & { letter: string; latest: boolean; roles: Org['roles'] };

/**
 * Experience rows. Organisations are lettered A, B, C... by the start of their
 * oldest role, oldest first; the newest letter is amber. Rows are newest first
 * inside each stream, and empty streams are dropped.
 */
export function letteredExperience(): { stream: keyof typeof STREAMS; title: string; orgs: LetteredOrg[] }[] {
  const byStart = [...experience].sort((a, b) => oldestStart(a).localeCompare(oldestStart(b)));
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const withLetters: LetteredOrg[] = byStart.map((org, i) => ({
    ...org,
    roles: [...org.roles].sort((a, b) => b.start.localeCompare(a.start)),
    letter: letters[i] ?? String(i + 1),
    latest: i === byStart.length - 1,
  }));

  const order = Object.keys(STREAMS) as (keyof typeof STREAMS)[];
  return order
    .map((stream) => {
      const orgs = withLetters
        .filter((o) => o.stream === stream)
        .sort((a, b) => newestStartRank(b).localeCompare(newestStartRank(a)));
      return { stream, title: STREAMS[stream], orgs };
    })
    .filter((g) => g.orgs.length > 0);
}

/** The date cell for a revisions row. */
export function dateRange(org: LetteredOrg): string {
  const from = oldestStart(org).slice(0, 4);
  const newest = newestEnd(org);
  if (newest === null) return `${from} — present`;
  const to = newest.slice(0, 4);
  return to === from ? from : `${from} — ${to}`;
}

function oldestStart(org: Org): string {
  return org.roles.map((r) => r.start).sort()[0];
}

/** Sort key: the most recent date this organisation was active. */
function newestStartRank(org: Org): string {
  return [newestEnd(org), ...org.roles.map((r) => r.end ?? r.start)]
    .filter((d): d is string => d !== null)
    .sort()
    .at(-1) ?? oldestStart(org);
}

/**
 * The newest end date across an organisation's roles, or null when the role is
 * still current — which the date cell renders as "— present".
 */
function newestEnd(org: Org): string | null {
  if (org.roles.some((r) => r.end === null)) return null;
  const ends = org.roles.map((r) => r.end as string);
  return ends.sort().at(-1) ?? null;
}

/** "Promoted once" / "twice" / "N times", or nothing for a single role. */
export function promotionTag(roleCount: number): string | null {
  if (roleCount < 2) return null;
  if (roleCount === 2) return 'Promoted once';
  if (roleCount === 3) return 'Promoted twice';
  return `Promoted ${roleCount - 1} times`;
}

/** "Previously events lead, then treasurer." Oldest first. */
export function previousTitles(org: LetteredOrg): string | null {
  if (org.roles.length < 2) return null;
  const older = org.roles
    .slice(1)
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((r) => r.title);
  return `Previously ${older.join(', then ')}.`;
}
