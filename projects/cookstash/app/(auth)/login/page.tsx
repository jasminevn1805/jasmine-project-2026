'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Calendar, ShoppingCart } from 'react-feather'
import { useAuthStore } from '@/store/useAuthStore'
import { Button, Input } from '@jasmine/design-system'

const FEATURE_PILLS = [
  { Icon: BookOpen, label: 'Recipe library' },
  { Icon: Calendar, label: 'Weekly planner' },
  { Icon: ShoppingCart, label: 'Smart grocery lists' },
]

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore((s) => s.login)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim()) {
      setError('Please enter your name to continue.')
      return
    }
    login(username.trim())
    router.push('/library')
  }

  /**
   * Portfolio demo shortcut — skips the name step so reviewers can land
   * inside a fully populated app in one click.
   */
  function handleDemo() {
    login('Maya')
    router.push('/library')
  }

  return (
    <main className="min-h-screen flex">

      {/* ── Left: brand panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, var(--color-brand-gradient-dark) 0%, var(--color-brand-gradient-mid) 50%, var(--color-brand-gradient-light) 100%)' }}
      >
        {/* Subtle texture circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-3xl">🍱</span>
          <span className="text-white font-bold text-xl tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}>
            Cookstash
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <h2 className="text-white text-4xl font-bold leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}>
            Your meals,<br />beautifully organised.
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-xs">
            Save recipes from anywhere, plan your week, and build your grocery list — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {FEATURE_PILLS.map(({ Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                <Icon size={12} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom credit */}
        <p className="relative z-10 text-white/40 text-xs">
          A portfolio project by Jasmine Hoang
        </p>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12"
        style={{ background: 'var(--color-background-primary)' }}>

        {/* Mobile logo (hidden on lg) */}
        <div className="flex items-center gap-2 mb-12 lg:hidden">
          <span className="text-2xl">🍱</span>
          <span className="font-bold text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
            Cookstash
          </span>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1.5"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Welcome back 👋
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Enter your name to pick up where you left off.
            </p>
          </div>

          {/* Demo shortcut — primary CTA for portfolio reviewers */}
          <div
            className="mb-6 p-4 rounded-xl border"
            style={{
              borderColor: 'var(--color-border-default, rgba(0,0,0,0.08))',
              background: 'var(--color-background-secondary, rgba(0,0,0,0.02))',
            }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              👀 Reviewing this as a portfolio piece?
            </p>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
              Skip the sign-in — explore a fully populated demo with sample recipes and a pre-built week.
            </p>
            <Button
              type="Secondary"
              size="M"
              className="w-full"
              onClick={handleDemo}
            >
              Try the demo as Maya →
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border-default, rgba(0,0,0,0.08))' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>or use your own name</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border-default, rgba(0,0,0,0.08))' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="username"
              label="Your name"
              type="text"
              placeholder="e.g. Maya"
              value={username}
              autoFocus
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as never)}
              error={error || undefined}
            />

            <Button htmlType="submit" type="Primary" size="L" className="w-full">
              Get started →
            </Button>
          </form>

          <p className="mt-8 text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
            No account needed — your data is saved locally.
          </p>
        </div>
      </div>
    </main>
  )
}

