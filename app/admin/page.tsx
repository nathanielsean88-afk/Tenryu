// app/admin/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')
  if (!(await isAdmin())) redirect('/member')

  const [applications, members, announcements] = await Promise.all([
    prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({ where: { role: 'MEMBER' }, orderBy: { joinedAt: 'desc' } }),
    prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  const stats = {
    total: members.length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    approved: applications.filter(a => a.status === 'APPROVED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  }

  return <AdminClient applications={applications} members={members} announcements={announcements} stats={stats} />
}
