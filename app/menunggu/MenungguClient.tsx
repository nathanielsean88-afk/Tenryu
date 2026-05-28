'use client'
// app/menunggu/MenungguClient.tsx
import Link from 'next/link'
import Image from 'next/image'
import { SignOutButton } from '@clerk/nextjs'

type Props = {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | null
  hasApplied: boolean
}

export default function MenungguClient({ status, hasApplied }: Props) {
  const content = {
    null: {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      title: 'Lengkapi Pendaftaran',
      subtitle: 'Kamu belum mengisi form pendaftaran',
      desc: 'Untuk bergabung dengan Tenryu Circle, kamu perlu mengisi form pendaftaran terlebih dahulu. Tim kami akan meninjau permohonanmu.',
      action: (
        <Link href="/pendaftaran" style={{ display: 'inline-block', background: 'var(--crimson)', color: 'var(--snow)', border: 'none', padding: '16px 48px', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, textDecoration: 'none' }}>
          Isi Form Pendaftaran
        </Link>
      ),
    },
    PENDING: {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      ),
      title: 'Sedang Ditinjau',
      subtitle: 'Permohonanmu sedang diproses',
      desc: 'Tim Tenryu Circle sedang meninjau permohonan kamu. Proses ini memakan waktu 3–5 hari kerja. Kami akan menghubungi kamu via email setelah keputusan dibuat.',
      action: null,
    },
    APPROVED: {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6dbf6d" strokeWidth="1.5">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      ),
      title: 'Selamat, Diterima!',
      subtitle: 'Permohonanmu telah disetujui',
      desc: 'Kamu resmi menjadi anggota Tenryu Circle. Silakan login ulang untuk mengakses dashboard member.',
      action: (
        <SignOutButton redirectUrl="/login">
          <button style={{ background: 'var(--crimson)', color: 'var(--snow)', border: 'none', padding: '16px 48px', fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
            Login Ulang
          </button>
        </SignOutButton>
      ),
    },
    REJECTED: {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--crimson-light)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
      title: 'Permohonan Ditolak',
      subtitle: 'Maaf, permohonanmu tidak dapat kami terima saat ini',
      desc: 'Terima kasih atas minatmu untuk bergabung dengan Tenryu Circle. Sayangnya permohonanmu tidak dapat kami terima pada batch ini. Kamu dapat mencoba kembali di batch berikutnya.',
      action: null,
    },
  }

  const c = content[status as keyof typeof content] ?? content[null as any]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--obsidian)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,26,26,0.15) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 560, width: '90%',
        textAlign: 'center',
        padding: 56,
        border: '1px solid rgba(201,169,110,0.2)',
        background: 'rgba(24,24,24,0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: 3,
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%)' }}>
            <Image src="/logo.png" alt="Tenryu" width={44} height={44} style={{ objectFit: 'contain' }} />
          </div>
        </div>

        {/* Icon status */}
        <div style={{ width: 80, height: 80, border: '1.5px solid rgba(201,169,110,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', background: 'rgba(255,255,255,0.03)' }}>
          {c.icon}
        </div>

        {/* Text */}
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 12 }}>
          {c.subtitle}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: 'var(--snow)', marginBottom: 20, lineHeight: 1.1 }}>
          {c.title}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--mist)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 40 }}>
          {c.desc}
        </p>

        {/* Action */}
        {c.action && <div style={{ marginBottom: 28 }}>{c.action}</div>}

        {/* Steps kalau belum daftar */}
        {!hasApplied && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32 }}>
            {['Daftar Akun', 'Isi Form', 'Tunggu Review', 'Jadi Member'].map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: `1px solid ${i < 1 ? 'var(--crimson)' : 'rgba(255,255,255,0.1)'}`,
                  background: i < 1 ? 'var(--crimson)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Cinzel', serif", fontSize: 11,
                  color: i < 1 ? 'white' : 'var(--smoke)',
                }}>
                  {i < 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.1em', color: i < 1 ? 'var(--gold)' : 'var(--smoke)', textTransform: 'uppercase', textAlign: 'center' }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 0 24px' }} />

        {/* Footer links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <Link href="/" style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', color: 'var(--mist)', textDecoration: 'none', textTransform: 'uppercase' }}>
            Beranda
          </Link>
          <Link href="/gallery" style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', color: 'var(--mist)', textDecoration: 'none', textTransform: 'uppercase' }}>
            Galeri
          </Link>
          <SignOutButton redirectUrl="/">
            <button style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em', color: 'var(--mist)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>
              Keluar
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  )
}
