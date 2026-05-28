// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { bio, portfolio, name } = await req.json()

    const updated = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio: bio || null }),
        ...(portfolio !== undefined && { portfolio: portfolio || null }),
      },
    })

    return NextResponse.json({ success: true, user: updated })
  } catch (err) {
    console.error('[PATCH /api/profile]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true, name: true, email: true,
        imageUrl: true, bio: true, portfolio: true,
        division: true, role: true, joinedAt: true,
      },
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json(user)
  } catch (err) {
    console.error('[GET /api/profile]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
