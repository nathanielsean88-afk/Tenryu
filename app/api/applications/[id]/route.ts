// app/api/applications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { setUserRole } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Hanya admin yang bisa approve/reject
    const admin = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { status, adminNote } = body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
    }

    const application = await prisma.application.findUnique({
      where: { id: params.id },
    })

    if (!application) {
      return NextResponse.json({ error: 'Permohonan tidak ditemukan' }, { status: 404 })
    }

    // Update status aplikasi
    const updated = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: status as any,
        adminNote: adminNote || null,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
    })

    // Jika APPROVED: set role MEMBER di Clerk + update DB user
    if (status === 'APPROVED' && application.userId) {
      const dbUser = await prisma.user.findUnique({ where: { id: application.userId } })
      if (dbUser) {
        await setUserRole(dbUser.clerkId, 'MEMBER')
        await prisma.user.update({
          where: { id: application.userId },
          data: {
            role: 'MEMBER',
            division: application.division,
          },
        })
      }
    }

    return NextResponse.json({ success: true, application: updated })
  } catch (err) {
    console.error('[PATCH /api/applications/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const application = await prisma.application.findUnique({
      where: { id: params.id },
    })

    if (!application) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch (err) {
    console.error('[GET /api/applications/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
