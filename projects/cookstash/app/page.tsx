import { redirect } from 'next/navigation'

/**
 * Root redirect:
 * - Auth check happens client-side via useAuthStore
 * - Default to /library (app shell handles redirect to /login if not authed)
 */
export default function RootPage() {
  redirect('/library')
}
