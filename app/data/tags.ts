/**
 * List of available tags for portfolio works.
 *
 * Each key is an English string used as:
 * - Identifier in projects.ts → tags: ["illustration", "ink"]
 * - Translation key in JSONs → t.tags["illustration"]
 *
 * To add a new tag:
 * 1. Add it here.
 * 2. Add the translation in app/i18n/es.json, ca.json, and en.json under "tags.<key>".
 * 3. Use it in app/data/projects.ts.
 */
export const TAG_KEYS = [
  "illustration",
  "ink",
  "fan_art",
  "anime",
  "manga",
  "portrait",
  "cinema",
  "horror",
  "concept",
  "animals",
  "technique",
  "pointillism",
  "literature",
  "skull",
  "realism",
] as const;

export type TagKey = (typeof TAG_KEYS)[number];
