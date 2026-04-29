import { TagKey } from "./tags";

export type ImageDisplay = "cover" | "contain" | "top";
export type AspectRatio = "fourthirds" | "square" | "portrait";

export interface Project {
  id: string;
  image: string;
  date: string;
  altImages: string[];
  tags: TagKey[];
  imageDisplay?: ImageDisplay;
  aspectRatio?: AspectRatio;
  /** Pre-translated title from API (when available) */
  title?: string;
  /** Pre-translated short description from API (when available) */
  shortDescription?: string;
}

