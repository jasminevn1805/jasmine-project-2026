import type { GroceryCategory, GroceryItem as GroceryItemType } from '@/types'
import { GroceryItem } from './GroceryItem'
import {
  Sun, Droplet, Zap, Archive, Thermometer, Star, Coffee, Package,
} from 'react-feather'
import type { Icon } from 'react-feather'

const CATEGORY_META: Record<GroceryCategory, { icon: Icon; label: string }> = {
  produce:   { icon: Sun,         label: 'Produce' },
  dairy:     { icon: Droplet,     label: 'Dairy' },
  meat:      { icon: Zap,         label: 'Meat & Protein' },
  pantry:    { icon: Archive,     label: 'Pantry' },
  frozen:    { icon: Thermometer, label: 'Frozen' },
  bakery:    { icon: Star,        label: 'Bakery' },
  beverages: { icon: Coffee,      label: 'Beverages' },
  other:     { icon: Package,     label: 'Other' },
}

interface CategorySectionProps {
  category: GroceryCategory
  items: GroceryItemType[]
  onToggle: (itemId: string) => void
  onDelete: (itemId: string) => void
}

export function CategorySection({
  category,
  items,
  onToggle,
  onDelete,
}: CategorySectionProps) {
  const checked = items.filter((i) => i.checked).length
  const meta = CATEGORY_META[category]
  const IconComp = meta.icon

  return (
    <div
      style={{
        background: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-l)',
        padding: 'var(--space-l)',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        marginBottom: 'var(--space-l)',
        display: 'inline-block',
        width: '100%',
      }}
    >
      {/* Category header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-s)',
          paddingBottom: 'var(--space-m)',
          marginBottom: 'var(--space-s)',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: 'var(--border-radius-s)',
            background: 'var(--color-background-primary)',
            color: 'var(--color-text-brand)',
            flexShrink: 0,
          }}
        >
          <IconComp size={14} />
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
            fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
            lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--color-text-primary)',
            margin: 0,
          }}
        >
          {meta.label}
        </h3>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px',
            height: '20px',
            padding: '0 var(--space-xs)',
            borderRadius: 'var(--border-radius-pill)',
            background: 'var(--color-background-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--typography-desktop-text-xs-regular-size)',
            fontWeight: 'var(--typography-desktop-text-xs-regular-weight)',
            lineHeight: '1',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {checked}/{items.length}
        </span>
      </div>

      {/* Items — vertical list (one per row) */}
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {items.map((item) => (
          <GroceryItem
            key={item.id}
            item={item}
            onToggle={() => onToggle(item.id)}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </ul>
    </div>
  )
}
