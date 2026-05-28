// lib/auth.ts
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export type UserRole = 'ADMIN' | 'MEMBER'

/**
 * Get current user's role from Clerk public metadata
 */
export async function getCurrentRole(): Promise<UserRole | null> {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  const role = user?.publicMetadata?.role as UserRole | undefined
  return role ?? 'MEMBER'
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getCurrentRole()
  return role === 'ADMIN'
}

/**
 * Get or create user in DB from Clerk session
 */
export async function getOrCreateUser() {
  const { userId } = await auth()
  if (!userId) return null

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (existing) return existing

  // Create user on first login
  return prisma.user.create({
    data: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
      imageUrl: clerkUser.imageUrl,
      role: (clerkUser.publicMetadata?.role as UserRole) ?? 'MEMBER',
    },
  })
}

/**
 * Set user role via Clerk Admin API (call from server actions)
 */
export async function setUserRole(clerkUserId: string, role: UserRole) {
  const response = await fetch(
    `https://api.clerk.com/v1/users/${clerkUserId}/metadata`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_metadata: { role } }),
    }
  )
  if (!response.ok) throw new Error('Failed to update Clerk role')
  return response.json()
}
