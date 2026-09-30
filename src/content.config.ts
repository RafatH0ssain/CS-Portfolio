// Content collection for projects (content/projects/*.md).
// The schema is the contract described in docs/SPEC.md, "Content model".
// Verified against Astro 7.3.5. Ask the owner before loosening any rule here.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM');

// The four drawn schematics that exist in the reference prototype. Adding a new
// one is a design decision: ask the owner first.
export const SCHEMATICS = ['grid', 'chart', 'nodes', 'pipeline'] as const;

const projects = defineCollection({
  loader: glob({ base: './content/projects', pattern: ['*.md', '!*.example.md'] }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1).max(40),
        // Shorter title for the isometric plate. Required when title is over 18 characters.
        plateTitle: z.string().min(1).max(18).optional(),
        version: z.string().regex(/^v\d+\.\d+\.\d+(-[a-z0-9.]+)?$/, 'use a semantic version like v1.2.0'),
        level: z.number().int().min(0).max(4), // first scrubber level at which it existed
        order: z.number().int().min(1), // position in the parts list (1 = first)
        kind: z.string().min(2).max(14), // e.g. Product, ML, Systems, Web, Algorithms
        summary: z.string().min(10).max(160),
        role: z.string().min(2).max(80),
        team: z.string().min(2).max(40),
        duration: z.string().min(2).max(30),
        status: z.enum(['In production', 'Stable', 'In progress', 'Archived']),
        users: z.string().max(40).optional(),
        stack: z.array(z.string().min(1).max(24)).min(1).max(6),
        links: z
          .object({
            live: z.url().optional(),
            repo: z.url().optional(),
            writeup: z.url().optional(),
          })
          .default({}),
        figure: z.object({
          // A real screenshot, stored in src/assets/projects/. Never a generated image.
          image: image().optional(),
          alt: z.string().min(10).max(200).optional(),
          schematic: z.enum(SCHEMATICS),
          callouts: z
            .array(
              z.object({
                x: z.number().min(0).max(1),
                y: z.number().min(0).max(1),
                title: z.string().min(2).max(40),
                note: z.string().min(2).max(120),
              }),
            )
            .min(1)
            .max(4),
        }),
        added: z.array(z.string().min(5).max(160)).min(1).max(4),
        changed: z.array(z.string().min(5).max(160)).max(4).default([]),
        issues: z.array(z.string().min(5).max(160)).min(1).max(3), // every project has a known issue
        decisions: z
          .array(
            z.object({
              title: z.string().min(2).max(60),
              chose: z.string().min(2).max(160),
              instead: z.string().min(2).max(160),
              because: z.string().min(2).max(200),
            }),
          )
          .min(1)
          .max(3),
        history: z
          .array(z.object({ version: z.string(), date: yearMonth, note: z.string().min(2).max(160) }))
          .min(1)
          .max(8),
      })
      .refine((p) => p.title.length <= 18 || p.plateTitle, {
        message: 'title is longer than 18 characters, so plateTitle is required',
        path: ['plateTitle'],
      })
      .refine((p) => !p.figure.image || p.figure.alt, {
        message: 'a screenshot needs alt text',
        path: ['figure', 'alt'],
      }),
});

export const collections = { projects };
