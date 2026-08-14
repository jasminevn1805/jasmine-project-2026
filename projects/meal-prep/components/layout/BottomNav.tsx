'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Calendar,
  ShoppingCart,
} from 'react-feather'

const NAV_ITEMS = [
  { href: '/library', label: 'Library', Icon: BookOpen },
  { href: '/planner', label: 'Planner', Icon: Calendar },
  { href: '/grocery', label: 'Grocery', Icon: ShoppingCart },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
      style={{
        background: 'rgba(250, 250, 248, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.07)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-1 py-2 transition-all duration-150"
            style={{
              color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}
          >
            <span
              className="flex items-center justify-center w-12 h-8 transition-all duration-150 rounded-lg"
              style={{
                background: isActive ? 'var(--color-background-brand-subtle)' : 'transparent',
              }}
            >
              <item.Icon
                size={20}
                strokeWidth={isActive ? 2.25 : 1.75}
                fill={isActive ? 'var(--color-background-brand-subtle)' : 'none'}
              />
            </span>
            <span
              className="text-[11px] font-medium"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? '600' : '500',
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
