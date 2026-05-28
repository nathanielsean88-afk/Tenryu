import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/lib/auth'
import { getApplications } from '@/lib/storage'
import ProfileClient from './ProfileClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const user = await getOrCreateUser()
  if (!user) redirect('/login')

  const application = getApplications().find(a => (a as any).userId === userId) ?? null

  return <ProfileClient user={user} application={application} />
}
