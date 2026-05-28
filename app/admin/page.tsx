import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'
import { getApplications, getMembers, getAnnouncements } from '@/lib/storage'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')
  if (!(await isAdmin())) redirect('/member')

  const applications = getApplications()
  const members = getMembers().filter(m => m.role === 'MEMBER')
  const announcements = getAnnouncements()

  const stats = {
    total: members.length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    approved: applications.filter(a => a.status === 'APPROVED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  }

  return <AdminClient applications={applications} members={members} announcements={announcements} stats={stats} />
}
