'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useRecipeStore } from '@/store/useRecipeStore'
import { useCategoryStore } from '@/store/useCategoryStore'
import { usePlannerStore } from '@/store/usePlannerStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { ToastProvider } from '@/components/shared/Toast'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((s) => s.session)
  const seedRecipes = useRecipeStore((s) => s.seedRecipes)
  const seedCategories = useCategoryStore((s) => s.seedCategories)
  const seedPlans = usePlannerStore((s) => s.seedPlans)
  const router = useRouter()

  useEffect(() => {
    if (!session.loggedIn) {
      router.replace('/login')
    }
  }, [session.loggedIn, router])

  // Seed sample data on first launch — all three are idempotent (guarded by `seeded` flag)
  useEffect(() => {
    seedRecipes()
    seedCategories()
    seedPlans()
  }, [seedRecipes, seedCategories, seedPlans])

  if (!session.loggedIn) return null

  return (
    <ToastProvider>
      <div className="flex h-screen bg-(--color-background-primary)">
        {/* Desktop sidebar */}
        <Sidebar />

        {/* Main content */}
        <main
          className="flex flex-col flex-1 min-w-0 overflow-y-auto hide-scrollbar pb-24 md:pb-0 md:pl-16"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          } as React.CSSProperties}
        >
          {children}
        </main>

        {/* Mobile bottom nav */}
        <BottomNav />
      </div>
    </ToastProvider>
  )
}
