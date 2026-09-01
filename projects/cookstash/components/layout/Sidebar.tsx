'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Calendar,
  ShoppingCart,
  LogOut,
} from 'react-feather'
import { useAuthStore } from '@/store/useAuthStore'

const NAV_ITEMS = [
  { href: '/library', label: 'Library',  Icon: BookOpen },
  { href: '/planner', label: 'Planner',  Icon: Calendar },
  { href: '/grocery', label: 'Grocery',  Icon: ShoppingCart },
]

export function Sidebar() {
  const pathname = usePathname()
  const { session, logout } = useAuthStore()
  const [userOpen, setUserOpen] = useState(false)

  return (
    <aside
      className="fixed left-0 top-0 hidden h-full w-16 flex-col md:flex"
      style={{
        zIndex: 30,
        background: 'var(--color-background-primary)',
        borderRight: '1px solid var(--color-border-default)',
      }}
    >
      {/* Logo mark */}
      <div className="flex items-center justify-center py-5 mb-6">
        <span className="text-4xl leading-none">🍱</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-6 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <div key={item.href} className="relative group w-full flex justify-center">
              <Link
                href={item.href}
                className="relative flex items-center justify-center w-12 h-12 rounded-lg transition-all"
                style={{
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background: isActive ? 'var(--color-background-brand-subtle)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--color-background-hover)'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <item.Icon
                  size={24}
                  strokeWidth={isActive ? 2.25 : 1.75}
                  fill={isActive ? 'var(--color-background-brand-subtle)' : 'none'}
                />
              </Link>

              {/* Tooltip */}
              <div
                className="pointer-events-none absolute left-full ml-2.5 top-1/2 -translate-y-1/2 z-50
                           whitespace-nowrap rounded-lg px-3.5 py-2 text-body-sm
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{
                  background: 'var(--color-background-inverse)',
                  color: 'var(--color-text-primary-inverse)',
                  boxShadow: 'var(--shadow-md)',
                  fontWeight: 500,
                }}
              >
                {item.label}
              </div>
            </div>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="relative flex flex-col items-center mb-4 px-2">
        {/* Sign-out popover — anchored to the left of the sidebar so it's fully in viewport */}
        {userOpen && (
          <div
            className="absolute bottom-full mb-2 left-full ml-2 z-50
                       rounded-xl shadow-lg overflow-hidden w-36"
            style={{
              background: 'var(--color-background-primary)',
              border: '1px solid var(--color-border-default)',
            }}
          >
            <button
              onClick={() => { logout(); setUserOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors"
              style={{ color: 'var(--color-text-danger)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--color-background-danger-subtle)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <LogOut size={14} strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        )}

        <button
          onClick={() => setUserOpen(v => !v)}
          className="flex items-center justify-center w-10 h-10 rounded-full transition-all"
          style={{
            background: userOpen ? 'var(--color-background-brand)' : 'var(--color-background-brand)',
            outline: userOpen ? '2px solid var(--color-border-brand)' : '2px solid transparent',
            outlineOffset: '2px',
          }}
        >
          <span className="text-sm font-bold text-white">
            {session.username?.[0]?.toUpperCase()}
          </span>
        </button>
      </div>
    </aside>
  )
}
