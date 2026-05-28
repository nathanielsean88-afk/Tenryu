'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { user } = useUser()

  // Cek role dari public metadata Clerk
  const role = (user?.publicMetadata?.role as string) ?? null
  const isApproved = role === 'MEMBER' || role === 'ADMIN'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Cinzel', serif",
    fontSize: 11,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: active ? 'var(--gold)' : 'var(--pearl)',
    transition: 'color 0.3s',
  })

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '20px 60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(8,8,8,0.97)' : 'linear-gradient(180deg, rgba(8,8,8,0.95) 0%, transparent 100%)',
      borderBottom: scrolled ? '1px solid rgba(201,169,110,0.1)' : 'none',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.4s',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
        <div style={{ width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(139,26,26,0.25) 0%, transparent 70%)', border: '1px solid rgba(201,169,110,0.3)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          <Image src="/logo.png" alt="Tenryu Circle Logo" width={40} height={40} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(201,169,110,0.4))' }} />
        </div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 600, letterSpacing: '0.15em', color: 'var(--snow)' }}>TENRYU</div>
          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase' }}>Circle</div>
        </div>
      </Link>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }}>

        {/* Beranda & Gallery — selalu tampil */}
        <Link href="/" style={linkStyle(pathname === '/')}>Beranda</Link>
        <Link href="/gallery" style={linkStyle(pathname === '/gallery')}>Anggota</Link>

        {/* ── Belum login: tampilkan Pendaftaran saja ── */}
        <SignedOut>
          <Link href="/pendaftaran" style={linkStyle(pathname === '/pendaftaran')}>
            Pendaftaran
          </Link>
          {/* TIDAK ada tombol Login/Register untuk user belum login */}
          {/* Mereka harus daftar dulu, tunggu ACC, baru bisa login */}
        </SignedOut>

        {/* ── Sudah login ── */}
        <SignedIn>
          {/* Belum di-ACC: tampilkan Pendaftaran + Status */}
          {!isApproved && (
            <>
              <Link href="/pendaftaran" style={linkStyle(pathname === '/pendaftaran')}>
                Pendaftaran
              </Link>
              <Link href="/menunggu" style={linkStyle(pathname === '/menunggu')}>
                Status
              </Link>
            </>
          )}

          {/* Sudah di-ACC: tampilkan menu member */}
          {isApproved && (
            <Link href="/member" style={linkStyle(pathname.startsWith('/member'))}>
              Dashboard
            </Link>
          )}

          {/* Admin extra */}
          {role === 'ADMIN' && (
            <Link href="/admin" style={linkStyle(pathname.startsWith('/admin'))}>
              Admin
            </Link>
          )}

          {/* Avatar user */}
          <UserButton appearance={{ elements: { avatarBox: { width: 36, height: 36, border: '1.5px solid var(--crimson)' } } }} />
        </SignedIn>
      </nav>
    </header>
  )
}
