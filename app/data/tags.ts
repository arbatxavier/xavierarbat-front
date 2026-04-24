/**
 * Lista de tags disponibles para las obras del portfolio.
 *
 * Cada key es un string en inglés que se usa como:
 * - Identificador en projects.ts → tags: ["illustration", "ink"]
 * - Clave de traducción en los JSONs → t.tags["illustration"]
 *
 * Para añadir un tag nuevo:
 * 1. Añádelo aquí.
 * 2. Añade la traducción en app/i18n/es.json, ca.json y en.json dentro de "tags.<key>".
 * 3. Úsalo en app/data/projects.ts.
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
