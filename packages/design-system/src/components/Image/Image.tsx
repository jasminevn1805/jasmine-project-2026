import React from 'react';
import { Image as ImageIcon } from 'react-feather';
import styles from './Image.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

/**
 * Aspect ratio variant. The landscape set (`4:3` · `5:4` · `16:9` · `16:10`)
 * matches Figma "Image" component (node 75026:34010); the portrait set
 * (`3:4` · `4:5` · `9:16` · `10:16`) is each landscape ratio's vertical
 * mirror, added for portrait sources (screenshots, mobile UI) that would
 * otherwise have to force-fit a landscape box. `1:1` covers both orientations.
 * `Fill` applies no fixed ratio; the image fills whatever box it's placed in.
 */
export type ImageAspectRatio =
  | '1:1'
  | '4:3'
  | '5:4'
  | '16:9'
  | '16:10'
  | '3:4'
  | '4:5'
  | '9:16'
  | '10:16'
  | 'Fill';

/** How the image fills a fixed-ratio box. `cover` crops to fill; `contain`
 *  letterboxes to stay uncropped; `stretch` fills exactly with no crop and no
 *  letterbox by distorting the source to match the box (CSS `object-fit: fill`)
 *  — the right call when a slight distortion reads better than empty space or
 *  lost content, e.g. UI-mockup screenshots whose ratio is already close to
 *  the box's. */
export type ImageObjectFit = 'cover' | 'contain' | 'stretch';

/** Named focal-point presets — the common cases, as plain percentages under
 *  the hood (e.g. 'top-left' → '0% 0%'). Not a closed set: any other string
 *  passes through untouched as a raw CSS `object-position` value, so
 *  arbitrary focal points ('73% 42%') work exactly the same way. */
export type ImageObjectPositionPreset =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

// `& {}` keeps preset autocomplete working in editors while still accepting
// any other string (TS would otherwise widen a plain `| string` union and
// drop the literal suggestions).
export type ImageObjectPosition = ImageObjectPositionPreset | (string & {});

export interface ImageProps {
  /** Image source URL. Omit to render the placeholder fill state. */
  src?: string;
  /** Accessible description. Pass '' only for purely decorative images. */
  alt: string;
  /** Aspect ratio variant. Default: 'Fill' (fills parent, no fixed ratio) */
  aspectRatio?: ImageAspectRatio;
  /** How the image fills its box once an aspect ratio constrains it. Default: 'cover' */
  objectFit?: ImageObjectFit;
  /** Which part of the source image stays visible/anchored when the box's
   *  ratio doesn't match the source's. A named preset ('top-left', 'center',
   *  etc.) or a raw `'x% y%'` string for an arbitrary focal point. Matters
   *  most with `objectFit="cover"` (decides what gets cropped away); also
   *  applies with `"contain"` (decides where the uncropped image sits within
   *  the leftover letterbox space) — it's only a no-op when the box already
   *  matches the source's ratio exactly, since then nothing is cropped or
   *  letterboxed either way. Default: 'center'. */
  objectPosition?: ImageObjectPosition;
  /** Additional CSS class on the outer element */
  className?: string;
  /** Click handler — e.g. to open a caller-owned lightbox/zoom view */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const RATIO_CLASS: Record<ImageAspectRatio, string> = {
  '1:1': 'ratio1to1',
  '4:3': 'ratio4to3',
  '5:4': 'ratio5to4',
  '16:9': 'ratio16to9',
  '16:10': 'ratio16to10',
  '3:4': 'ratio3to4',
  '4:5': 'ratio4to5',
  '9:16': 'ratio9to16',
  '10:16': 'ratio10to16',
  Fill: 'fill',
};

const OBJECT_POSITION_PRESETS: Record<ImageObjectPositionPreset, string> = {
  center: '50% 50%',
  top: '50% 0%',
  bottom: '50% 100%',
  left: '0% 50%',
  right: '100% 50%',
  'top-left': '0% 0%',
  'top-right': '100% 0%',
  'bottom-left': '0% 100%',
  'bottom-right': '100% 100%',
};

/**
 * Image component — Jasmine Design System
 *
 * A fixed-aspect-ratio image frame with a placeholder fill state for when
 * `src` isn't available yet. Landscape variants match Figma "Image" component
 * (node 75026:34010): 1:1 · 4:3 · 5:4 · 16:9 · 16:10 · Fill. Portrait variants
 * (3:4 · 4:5 · 9:16 · 10:16) mirror those ratios vertically.
 *
 * This component is presentational only — no lightbox/zoom behavior. Pass
 * `onClick` to compose that at the call site.
 *
 * Usage:
 * ```tsx
 * <Image src="/board.png" alt="Kickoff board" aspectRatio="1:1" />
 * <Image alt="Coming soon" aspectRatio="16:9" />
 * ```
 */
export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio = 'Fill',
  objectFit = 'cover',
  objectPosition,
  className = '',
  onClick,
}) => {
  const wrapperClasses = [styles.image, styles[RATIO_CLASS[aspectRatio]], className]
    .filter(Boolean)
    .join(' ');

  // Resolve a named preset to its percentage pair; anything else (a raw
  // 'x% y%' string, a CSS keyword like 'top left') passes through as-is.
  const resolvedObjectPosition = objectPosition
    ? (OBJECT_POSITION_PRESETS[objectPosition as ImageObjectPositionPreset] ?? objectPosition)
    : undefined;

  const interactiveProps = onClick
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
          }
        },
      }
    : {};

  return (
    <div className={wrapperClasses} onClick={onClick} {...interactiveProps}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${styles.img} ${styles[objectFit]}`}
          style={resolvedObjectPosition ? { objectPosition: resolvedObjectPosition } : undefined}
        />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={alt || 'Image placeholder'}>
          <ImageIcon size={32} aria-hidden />
        </div>
      )}
    </div>
  );
};

Image.displayName = 'Image';
