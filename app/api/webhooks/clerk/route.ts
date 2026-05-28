// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

type ClerkUserEvent = {
  type: 'user.created' | 'user.updated' | 'user.deleted'
  data: {
    id: string
    email_addresses: { email_address: string; id: string }[]
    first_name: string | null
    last_name: string | null
    image_url: string
    public_metadata: { role?: string }
  }
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  // Verify webhook signature
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const payload = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let event: ClerkUserEvent
  try {
    event = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkUserEvent
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = event

  try {
    if (type === 'user.created') {
      const email = data.email_addresses[0]?.email_address ?? ''
      const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User'
      const role = (data.public_metadata?.role as 'ADMIN' | 'MEMBER') ?? 'MEMBER'

      await prisma.user.upsert({
        where: { clerkId: data.id },
        create: {
          clerkId: data.id,
          email,
          name,
          imageUrl: data.image_url,
          role,
        },
        update: {
          email,
          name,
          imageUrl: data.image_url,
          role,
        },
      })

      console.log(`[Webhook] User created: ${email}`)
    }

    if (type === 'user.updated') {
      const email = data.email_addresses[0]?.email_address ?? ''
      const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'User'
      const role = (data.public_metadata?.role as 'ADMIN' | 'MEMBER') ?? 'MEMBER'

      await prisma.user.upsert({
        where: { clerkId: data.id },
        create: {
          clerkId: data.id,
          email,
          name,
          imageUrl: data.image_url,
          role,
        },
        update: {
          email,
          name,
          imageUrl: data.image_url,
          role,
        },
      })

      console.log(`[Webhook] User updated: ${email}`)
    }

    if (type === 'user.deleted') {
      await prisma.user.deleteMany({ where: { clerkId: data.id } })
      console.log(`[Webhook] User deleted: ${data.id}`)
    }
  } catch (err) {
    console.error('[Webhook] DB error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
