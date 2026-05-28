import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Route yang bisa diakses siapa saja (tanpa login)
const isPublicRoute = createRouteMatcher([
  '/',
  '/gallery(.*)',
  '/pendaftaran(.*)',
  '/menunggu(.*)',
  '/api/webhooks(.*)',
  '/api/applications',
])

// Route khusus admin
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// Route khusus member (termasuk dashboard, announcement, dsb.)
const isMemberRoute = createRouteMatcher(['/member(.*)'])

// Route yang butuh sudah di-ACC (login & register hanya untuk yang sudah APPROVED)
const isAuthRoute = createRouteMatcher(['/login(.*)', '/register(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // Public routes — siapapun boleh akses
  if (isPublicRoute(req)) return NextResponse.next()

  // Login & Register — hanya untuk user yang sudah di-ACC (MEMBER/ADMIN)
  // Jika belum login → redirect ke pendaftaran
  // Jika sudah login tapi belum di-ACC → redirect ke menunggu
  // Jika sudah login dan sudah di-ACC → boleh akses (misal mau ganti akun)
  if (isAuthRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/pendaftaran', req.url))
    }
    const role = (sessionClaims?.metadata as any)?.role as string | undefined
    if (role !== 'MEMBER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/menunggu', req.url))
    }
    return NextResponse.next()
  }

  // Semua route lainnya butuh login
  if (!userId) {
    return NextResponse.redirect(new URL('/pendaftaran', req.url))
  }

  const role = (sessionClaims?.metadata as any)?.role as string | undefined

  // Admin routes
  if (isAdminRoute(req)) {
    if (role !== 'ADMIN') return NextResponse.redirect(new URL('/menunggu', req.url))
    return NextResponse.next()
  }

  // Member routes — butuh role MEMBER atau ADMIN
  if (isMemberRoute(req)) {
    if (role === 'ADMIN') return NextResponse.next()
    if (role !== 'MEMBER') return NextResponse.redirect(new URL('/menunggu', req.url))
    return NextResponse.next()
  }

  // User sudah login tapi belum di-ACC → redirect ke menunggu
  if (role !== 'MEMBER' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/menunggu', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
