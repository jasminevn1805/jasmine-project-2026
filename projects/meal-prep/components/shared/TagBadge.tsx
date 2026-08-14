import type { Tag } from '@/types'

const TAG_COLORS: Record<Tag, { bg: string; text: string }> = {
  'quick-win':   { bg: 'bg-emerald-100',  text: 'text-emerald-800' },
  'batch':       { bg: 'bg-blue-100',     text: 'text-blue-800' },
  'freezer':     { bg: 'bg-cyan-100',     text: 'text-cyan-800' },
  'high-protein':{ bg: 'bg-orange-100',   text: 'text-orange-800' },
  'vegetarian':  { bg: 'bg-green-100',    text: 'text-green-800' },
  'vegan':       { bg: 'bg-lime-100',     text: 'text-lime-800' },
  'dairy-free':  { bg: 'bg-yellow-100',   text: 'text-yellow-800' },
  'gluten-free': { bg: 'bg-amber-100',    text: 'text-amber-800' },
  'budget':      { bg: 'bg-teal-100',     text: 'text-teal-800' },
  'kid-friendly':{ bg: 'bg-pink-100',     text: 'text-pink-800' },
  'low-carb':    { bg: 'bg-purple-100',   text: 'text-purple-800' },
  'one-pan':     { bg: 'bg-rose-100',     text: 'text-rose-800' },
}

const TAG_LABELS: Record<Tag, string> = {
  'quick-win':    '⚡ Quick win',
  'batch':        '📦 Batch',
  'freezer':      '🧊 Freezer',
  'high-protein': '💪 High protein',
  'vegetarian':   '🥦 Vegetarian',
  'vegan':        '🌱 Vegan',
  'dairy-free':   '🥛 Dairy-free',
  'gluten-free':  '🌾 Gluten-free',
  'budget':       '💸 Budget',
  'kid-friendly': '👶 Kid-friendly',
  'low-carb':     '🥗 Low carb',
  'one-pan':      '🍳 One pan',
}

interface TagBadgeProps {
  tag: Tag
  size?: 'sm' | 'md'
}

export function TagBadge({ tag, size = 'sm' }: TagBadgeProps) {
  const { bg, text } = TAG_COLORS[tag] ?? { bg: 'bg-gray-100', text: 'text-gray-700' }
  const label = TAG_LABELS[tag] ?? tag

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${bg} ${text} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {label}
    </span>
  )
}
