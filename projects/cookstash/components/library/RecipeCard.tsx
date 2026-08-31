'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Image as ImageIcon } from 'react-feather'
import type { Recipe } from '@/types'
import { TAG_LABELS, PLATFORM_ICONS } from '@/lib/library-labels'

interface RecipeCardProps {
  recipe: Recipe
}

/**
 * RecipeCard — premium-minimal variant with richer scanning meta.
 *
 * Visual contract:
 *  - 4:5 portrait thumbnail (cookbook proportion)
 *  - Platform glyph chip top-right
 *  - Title + cuisine sit below the image
 *  - Footer meta row: cook time (Clock icon) · #primary tag chip
 *  - --shadow-sm at rest, --shadow-md on hover, 1px lift
 */
export function RecipeCard({ recipe }: RecipeCardProps) {
  const PlatformIcon = PLATFORM_ICONS[recipe.platform]
  const primaryTag = recipe.tags[0]
  const hasMeta = !!recipe.estimatedCookTime || !!primaryTag

  return (
    <Link
      href={`/library/${recipe.id}`}
      className="group flex flex-col overflow-hidden"
      style={{
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-background-primary)',
        boxShadow: 'var(--shadow-sm)',
        transition:
          'box-shadow var(--motion-duration-base) var(--motion-easing-out), ' +
          'transform var(--motion-duration-base) var(--motion-easing-out)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = 'var(--shadow-md)'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = 'var(--shadow-sm)'
        el.style.transform = 'translateY(0)'
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '4 / 5',
          background: 'var(--color-background-secondary)',
        }}
      >
        {recipe.thumbnail ? (
          <Image
            src={recipe.thumbnail}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            style={{ opacity: 0.25 }}
          >
            <ImageIcon size={40} />
          </div>
        )}

        {/* Platform glyph chip */}
        <span
          className="absolute flex items-center justify-center"
          style={{
            top: 'var(--space-s)',
            right: 'var(--space-s)',
            width: 'var(--space-xl)',
            height: 'var(--space-xl)',
            background: 'var(--color-background-veil)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-pill)',
            color: 'var(--color-text-primary)',
          }}
        >
          <PlatformIcon size={12} />
        </span>

        {/* Cook time chip — bottom-left, glassy */}
        {recipe.estimatedCookTime != null && (
          <span
            className="text-body-sm absolute"
            style={{
              bottom: 'var(--space-s)',
              left: 'var(--space-s)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              paddingInline: 'var(--space-s)',
              paddingBlock: '4px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-background-veil)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: 'var(--color-text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <Clock size={11} strokeWidth={2.25} />
            {recipe.estimatedCookTime} min
          </span>
        )}
      </div>

      <div
        style={{
          padding: 'var(--space-l)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xs)',
        }}
      >
        <h3 className="line-clamp-2 text-body-strong text-ink">
          {recipe.title}
        </h3>
        {recipe.cuisine && (
          <p className="line-clamp-1 text-body-sm text-tertiary">
            {recipe.cuisine}
          </p>
        )}
        {hasMeta && primaryTag && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              marginTop: 'var(--space-xs)',
            }}
          >
            <span
              className="text-body-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                paddingInline: 'var(--space-s)',
                paddingBlock: '2px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-background-secondary)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {TAG_LABELS[primaryTag]}
            </span>
            {recipe.tags.length > 1 && (
              <span
                className="text-body-sm"
                style={{
                  color: 'var(--color-text-tertiary)',
                  paddingInline: 'var(--space-xs)',
                  paddingBlock: '2px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                +{recipe.tags.length - 1}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
