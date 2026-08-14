'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserSession } from '@/types'

interface AuthStore {
  session: UserSession
  login: (username: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: { username: '', loggedIn: false },

      login: (username) =>
        set({ session: { username, loggedIn: true } }),

      logout: () =>
        set({ session: { username: '', loggedIn: false } }),
    }),
    { name: 'meal-prep-auth' }
  )
)
