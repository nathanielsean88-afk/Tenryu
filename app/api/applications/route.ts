import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getApplications, saveApplication, getMemberByClerkId } from '@/lib/storage'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, birthDate, city, profession, institution, division, motivation, contribution, referral, portfolio } = body

    if (!firstName || !lastName || !email || !division || !motivation) {
      return NextResponse.json({ error: 'Field wajib belum lengkap' }, { status: 400 })
    }

    const existing = getApplications().find(a => a.email === email)
    if (existing) return NextResponse.json({ error: 'Email sudah pernah mendaftar' }, { status: 409 })

    const { userId } = await auth()
    const app = {
      id: randomUUID(),
      firstName, lastName, email, phone: phone ?? '', birthDate: birthDate ?? '',
      city: city ?? '', profession: profession ?? '', institution: institution ?? '',
      division, motivation, contribution: contribution ?? '', referral: referral ?? '',
      portfolio: portfolio ?? '', status: 'PENDING' as const,
      adminNote: '', reviewedBy: '', reviewedAt: '',
      createdAt: new Date().toISOString(),
      userId: userId ?? '',
    }

    saveApplication(app)
    return NextResponse.json({ success: true, id: app.id }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const member = getMemberByClerkId(userId)
    if (!member || member.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json(getApplications())
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
