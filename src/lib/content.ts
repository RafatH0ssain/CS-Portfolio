// Loads and validates every JSON file in content/. A missing required file or
// an invalid value stops the build with a message naming the file and field.
// The rules are the contract in docs/SPEC.md, "Content model".
// Verified against Astro 7.3.5. Ask the owner before loosening any rule here.
import { z } from 'astro/zod';

const files = import.meta.glob<unknown>('../../content/*.json', { eager: true, import: 'default' });

function load<T extends z.ZodType>(name: string, schema: T, required: true): z.infer<T>;
function load<T extends z.ZodType>(name: string, schema: T, required: false): z.infer<T> | undefined;
function load<T extends z.ZodType>(name: string, schema: T, required: boolean) {
  const raw = files[`../../content/${name}.json`];
  if (raw === undefined) {
    if (!required) return undefined;
    throw new Error(`content/${name}.json is missing. Copy content/${name}.example.json and fill it in with the owner.`);
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`);
    throw new Error(`content/${name}.json is invalid:\n${lines.join('\n')}`);
  }
  return result.data;
}

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM');
const level = z.number().int().min(0).max(4);
const noPhone = (s: string) => !/(\+?\d[\d\s().-]{8,}\d)/.test(s);

// ---------- profile.json ----------
export const Profile = z.object({
  name: z.object({
    first: z.string().min(1).max(14),
    last: z.string().min(1).max(14),
  }),
  email: z.email(),
  location: z.string().max(40).optional(), // shown only if the owner wants it
  links: z.object({
    github: z.url(),
    linkedin: z.url().optional(),
    resume: z.string().regex(/^\/[\w.-]+\.pdf$/, 'a path like /resume.pdf, served from public/'),
  }),
  // Optional while building. When absent, the form's action must be
  // https://formspree.io/f/FORMSPREE_ID so that `check-content --dist` blocks shipping.
  formspreeId: z.string().regex(/^[A-Za-z0-9]{6,12}$/, 'the ID from the Formspree form URL, e.g. xyzabcde').optional(),
  drawingNo: z.string().regex(/^[A-Z]{2}-\d{4}-\d{3}$/),
  program: z.string().min(2).max(24), // short, for the title block: "BCS, Dalhousie"
  programLong: z.string().min(2).max(80), // "Bachelor of Computer Science, Dalhousie University"
  shipsOn: z.string().regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 20\d{2}$/, 'like "May 2027"'), // graduation month
  openTo: z.string().min(2).max(40),
  updated: yearMonth,
  head: z.string().min(2).max(40), // headline at the current revision
  bio: z.string().min(20).max(220), // bio at the current revision
  featured: z.array(z.string()).min(3).max(4), // project slugs for the hero cards, top card first
  deck: z.array(z.string()).min(3).max(10).optional(), // project slugs for the exploded plate stack, top plate first; falls back to featured
  shortVersion: z
    .array(z.object({ lead: z.string().min(5).max(70), rest: z.string().min(5).max(180) }))
    .min(2)
    .max(3),
  figure: z.object({
    // FIG. 1 module labels, in pairs that appear at levels 1 and 2.
    modules: z.tuple([
      z.tuple([z.string().max(10), z.string().max(10)]),
      z.tuple([z.string().max(10), z.string().max(10)]),
      z.tuple([z.string().max(8), z.string().max(8)]),
    ]),
  }),
}).refine((p) => noPhone(JSON.stringify(p)), { message: 'looks like it contains a phone number; phone numbers are never published' });

// ---------- revisions.json ----------
const Stop = z.object({
  rev: z.string().regex(/^\d\.\d$/),
  era: z.string().min(2).max(12),
  short: z.string().min(2).max(6),
  date: yearMonth,
  status: z.enum(['Draft', 'In review', 'Release candidate', 'Release pending']),
  level,
  current: z.boolean().optional(),
  locked: z.boolean().optional(),
  head: z.string().min(2).max(40).optional(), // omitted on the current stop: it uses profile.head
  bio: z.string().min(10).max(220).optional(), // omitted on the current stop: it uses profile.bio
});
export const Revisions = z
  .array(Stop)
  .min(3)
  .max(6)
  .superRefine((stops, ctx) => {
    const last = stops.length - 1;
    if (stops.filter((s) => s.current).length !== 1) ctx.addIssue({ code: 'custom', message: 'exactly one stop has "current": true' });
    if (!stops[last].locked || stops.slice(0, last).some((s) => s.locked)) ctx.addIssue({ code: 'custom', message: 'only the last stop has "locked": true' });
    stops.forEach((s, i) => {
      if (i > 0 && s.level < stops[i - 1].level) ctx.addIssue({ code: 'custom', path: [i, 'level'], message: 'levels never go down' });
      if (!s.current && (!s.head || !s.bio)) ctx.addIssue({ code: 'custom', path: [i], message: 'head and bio are required on every stop except the current one' });
    });
  });

// ---------- skills.json ----------
export const Skills = z.array(z.object({ name: z.string().min(1).max(20), level })).min(4).max(24);

// ---------- experience.json ----------
const Role = z.object({
  title: z.string().min(2).max(60),
  start: yearMonth,
  end: yearMonth.nullable(), // null = current
  summary: z.string().min(5).max(160),
  bullets: z.array(z.string().min(5).max(160)).max(6).default([]),
  tags: z.array(z.string().max(24)).max(5).default([]),
  approvedBy: z.string().max(60).optional(),
  link: z.object({ label: z.string().max(30), href: z.url() }).optional(),
});
export const STREAMS = {
  development: 'Software development',
  research: 'Research',
  leadership: 'Leadership and teaching',
  awards: 'Hackathons and awards',
} as const;
export const Experience = z
  .array(
    z.object({
      org: z.string().min(2).max(60),
      location: z.string().max(40).optional(),
      stream: z.enum(['development', 'research', 'leadership', 'awards']),
      roles: z.array(Role).min(1).max(5), // newest first; more than one role = promotions
    }),
  )
  .min(1)
  .refine((orgs) => noPhone(JSON.stringify(orgs)), { message: 'looks like it contains a phone number' });

// ---------- certifications.json (optional file) ----------
export const Certifications = z
  .array(
    z.object({
      title: z.string().min(2).max(70),
      issuer: z.string().min(2).max(40),
      year: z.number().int().min(2015).max(2030),
      credentialId: z.string().max(60).optional(),
      verifyUrl: z.url().optional(), // shown as "On request" when the issuer has no public verify page
      verifyLabel: z.string().max(30).optional(), // default: "Verify on <issuer>"
    }),
  )
  .min(1);

// ---------- academics.json (optional file; shown only when show is true) ----------
export const Academics = z.object({
  show: z.boolean(),
  standing: z.string().max(60).optional(),
  gpa: z.string().max(20).optional(), // publish only if the owner explicitly said so
  awards: z.array(z.string().max(60)).max(6).default([]),
});

export const profile = load('profile', Profile, true);
export const revisions = load('revisions', Revisions, true);
export const skills = load('skills', Skills, true);
export const experience = load('experience', Experience, true);
export const certifications = load('certifications', Certifications, false);
export const academics = load('academics', Academics, false);
