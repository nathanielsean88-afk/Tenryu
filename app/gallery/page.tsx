import { getMembers } from '@/lib/storage'
import Navbar from '@/components/layout/Navbar'
import GalleryClient from './GalleryClient'

export const dynamic = 'force-dynamic'

export default function GalleryPage() {
  const members = getMembers()
    .filter(m => m.role === 'MEMBER')
    .map(m => ({
      ...m,
      joinedAt: new Date(m.joinedAt),
    }))

  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <GalleryClient members={members} />
    </>
  )
}
