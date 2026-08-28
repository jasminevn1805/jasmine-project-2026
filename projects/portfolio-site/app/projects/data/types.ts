export interface StatItem {
  value: string;
  label: string;
  note?: string;
}

export interface JourneyStep {
  stage: string;
  action: string;
  feeling: string;
  friction?: boolean; // true = a pain point / emotional low
}

export interface JourneyScenario {
  title: string;
  context?: string;
  steps: JourneyStep[];
}

export interface ListItem {
  summary: string;
  body: string | string[];
}

// Re-exported from the design system rather than redefined here — it's the
// actual variant set of the Figma "Image" component (node 75026:34010), the
// single source of truth. Previously this was a locally-invented preset list;
// that's gone now that a real DS component exists to draw from instead.
export type { ImageAspectRatio, ImageObjectFit, ImageObjectPosition } from '@jasmine/design-system';
import type { ImageAspectRatio, ImageObjectFit, ImageObjectPosition } from '@jasmine/design-system';

/** Shared shape for the three "how should this image render" knobs —
 *  reused as `ContentSection.imageDefaults` (every image-bearing section
 *  type: 'image', 'text-image', 'list-image', 'image-grid'), `ProjectData.imageDefaults`
 *  (the final gallery), and the overridable fields on `ImageGridItem` (per-tile). */
export interface ImageRenderOptions {
  /** Fixed aspect ratio (from the DS Image component's variant set). Omit
   *  (default + every tile) to keep raw-<img>, natural-aspect-ratio
   *  rendering — required when tiles don't share a common ratio, since the
   *  DS component has no "natural/intrinsic" variant. */
  aspectRatio?: ImageAspectRatio;
  /** How the image fills its box once it resolves to a fixed ratio. Default: 'contain'. */
  objectFit?: ImageObjectFit;
  /** Focal point kept in frame when `objectFit: 'cover'` crops the image
   *  (also affects where an uncropped `'contain'` image sits within leftover
   *  letterbox space). Default: 'center'. See `ImageObjectPosition` for the
   *  preset list and arbitrary-value passthrough. */
  objectPosition?: ImageObjectPosition;
}

/** One tile in an 'image-grid'. `src` plus any of `imageDefaults`'s fields,
 *  each overriding the section-wide default for just this tile — e.g. two
 *  same-size containers where one image can be safely cropped (cover) and
 *  the other can't (contain), or where a cropped tile needs a specific focal
 *  point kept in frame. A plain string in `images` is shorthand for
 *  `{ src }` (inherit every default). */
export interface ImageGridItem extends ImageRenderOptions {
  src: string;
}

export interface ContentSection {
  type: 'text' | 'image' | 'text-image' | 'image-grid' | 'quote' | 'stats' | 'journey' | 'list' | 'list-image' | 'section-group';
  heading?: string;
  groupNumber?: number;
  content?: string | string[];
  items?: ListItem[];
  stats?: StatItem[];
  scenarios?: JourneyScenario[];
  insights?: string[];
  image?: string;
  /** Plain strings and `ImageGridItem` objects can mix freely — use a string
   *  for "inherit every `imageDefaults` field," an object when a specific
   *  tile needs to override one or more of them. */
  images?: (string | ImageGridItem)[];
  captions?: string[];
  layout?: 'left' | 'right' | 'split';
  /** `aspectRatio` / `objectFit` / `objectPosition` for this section's image(s).
   *  For 'image', 'text-image', 'list-image': applies to the single `image`.
   *  For 'image-grid': grid-wide default, used by every tile that doesn't
   *  override that field via its own `ImageGridItem` entry. Whenever a fixed
   *  ratio resolves (here, or per-tile in a grid), rendering goes through the
   *  real DS `Image` component. Omit `aspectRatio` (here, and per-tile for a
   *  grid) to keep raw-<img>, natural-aspect-ratio rendering — required when
   *  there's no sensible fixed box (e.g. grid tiles that don't share a common
   *  ratio). Ignored when `arrangement: 'row'` (always natural ratio there). */
  imageDefaults?: ImageRenderOptions;
  /** Force an 'image-grid' to a specific number of columns per row (2, 3, or 4),
   *  independent of how many images are in the grid — e.g. 4 images at columns: 2
   *  renders as 2 rows of 2; 4 images at columns: 4 renders as one row of 4; 3
   *  images at columns: 2 renders as a row of 2 + a row of 1. Omit to keep the
   *  default auto behavior (2 images → 2 cols, 3 images → 3 cols, otherwise 2 cols).
   *  Ignored when `arrangement: 'row'`. */
  columns?: 2 | 3 | 4;
  /** 'grid' (default): equal-WIDTH tiles — every image forced into the same box
   *  (via a resolved `aspectRatio`) or its own natural ratio if none resolves.
   *  'row': equal-HEIGHT tiles instead — each image capped to one shared height,
   *  width flows from its own natural ratio. Use this when tiles are different-
   *  width crops of the same source at the same scale (e.g. wide vs. narrow
   *  crops of one board) and forcing equal width would shrink the narrower one's
   *  content — that's letterboxing pretending to be sizing. `imageDefaults` /
   *  `columns` are ignored in this mode; always renders raw-<img> (natural
   *  ratio is exactly what the DS Image component's fixed variants can't do). */
  arrangement?: 'grid' | 'row';
}

export interface ProjectData {
  slug: string;
  title: string;
  overviewHeadline?: string;
  services: string[];
  platforms: string[];
  industry: string;
  /** Single string renders as one paragraph; string[] renders one <p> per entry. */
  description: string | string[];
  sections: ContentSection[];
  /** Top-of-page hero image, rendered through the DS `Image` component at a
   *  fixed 16:10 ratio (same everywhere — not per-project configurable, by
   *  design, so every case study's hero looks consistent). Omit to keep the
   *  DS component's own placeholder state. */
  heroImage?: string;
  images: string[];
  imageLabels?: string[];
  /** `aspectRatio` / `objectFit` / `objectPosition` for the final gallery
   *  (`images`). Same opt-in rule as `ContentSection.imageDefaults`: set
   *  `aspectRatio` to render gallery tiles through the real DS `Image`
   *  component, omit it to keep raw-<img>, natural-aspect-ratio rendering. */
  imageDefaults?: ImageRenderOptions;
  link?: string;
  github?: string;
}
