import { notFound } from 'next/navigation'
import { decodeShareToken } from '@/lib/share-token'
import { ShareView } from '@/components/shared/ShareView'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params
  const payload = decodeShareToken(token)

  if (!payload) return notFound()

  if (payload.type === 'grocery-list') {
    if (!payload.snapshot) return notFound()
    return <ShareView type="grocery" list={payload.snapshot} />
  }

  return notFound()
}
