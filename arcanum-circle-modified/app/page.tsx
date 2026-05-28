// app/page.tsx
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* BG */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,26,26,0.18) 0%, transparent 70%),
            linear-gradient(180deg, #080808 0%, #0f0808 50%, #080808 100%)
          `,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />

        {/* Rings */}
        {[500, 700, 900].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: '1px solid rgba(201,169,110,0.07)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `rotateSlow ${30 + i * 15}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
          }} />
        ))}

        {/* Orb */}
        <div style={{
          position: 'absolute',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,26,26,0.12) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulseOrb 6s ease-in-out infinite',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 800, padding: '0 40px', animation: 'fadeUp 1.2s ease forwards' }}>

          {/* Logo */}
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 110, height: 110,
              borderRadius: '50%',
              border: '1px solid rgba(201,169,110,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%)',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(139,26,26,0.2), 0 0 80px rgba(139,26,26,0.1)',
            }}>
              <Image
                src="/logo.png"
                alt="Tenryu Circle"
                width={96}
                height={96}
                style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(201,169,110,0.5))' }}
              />
            </div>
          </div>

          <div className="section-eyebrow" style={{ marginBottom: 24 }}>Est. 2024</div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(52px, 8vw, 96px)',
            fontWeight: 300,
            lineHeight: 1.05,
            color: 'var(--snow)',
            letterSpacing: '-0.02em',
          }}>
            <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Tenryu</em>
            <strong style={{ display: 'block', fontWeight: 600 }}>Circle</strong>
          </h1>

          <div className="gold-divider" />

          <p style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 19,
            color: 'var(--pearl)',
            maxWidth: 520,
            margin: '0 auto 48px',
            fontStyle: 'italic',
            lineHeight: 1.8,
          }}>
            Komunitas eksklusif bagi mereka yang percaya bahwa kolaborasi sejati lahir dari kedalaman, bukan keluasan.
          </p>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/pendaftaran" className="btn-primary">Bergabung Sekarang</Link>
            <Link href="/gallery" className="btn-outline">Kenali Anggota</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: 0.5,
          animation: 'bounceScroll 2s ease-in-out infinite',
        }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, var(--gold), transparent)' }} />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ padding: '120px 60px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.5em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            Tentang Kami
            <span style={{ flex: 1, height: 1, background: 'var(--gold)', opacity: 0.3, maxWidth: 60, display: 'block' }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, lineHeight: 1.15, color: 'var(--snow)', marginBottom: 24 }}>
            Lebih dari sekadar <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>komunitas</em>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--pearl)', lineHeight: 1.9, marginBottom: 20 }}>
            Tenryu Circle adalah ruang bagi individu-individu luar biasa untuk tumbuh bersama. Di sini, setiap koneksi punya makna, setiap kolaborasi punya tujuan.
          </p>
          <p style={{ fontSize: 17, color: 'var(--pearl)', lineHeight: 1.9 }}>
            Kami percaya bahwa komunitas terbaik dibangun di atas nilai — bukan sekadar angka.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 40 }}>
            {[
              { num: '47+', label: 'Anggota Aktif' },
              { num: '12', label: 'Program Tahunan' },
              { num: '3', label: 'Tahun Berdiri' },
              { num: '98%', label: 'Tingkat Retensi' },
            ].map(s => (
              <div key={s.label} style={{
                padding: 24,
                border: '1px solid rgba(201,169,110,0.15)',
                background: 'rgba(255,255,255,0.02)',
                position: 'relative',
                paddingLeft: 28,
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'var(--crimson)' }} />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: 'var(--crimson-light)', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', height: 460 }}>
          <div style={{
            position: 'absolute', right: 0, top: 0,
            width: '80%', height: 340,
            background: 'linear-gradient(135deg, var(--dark-2) 0%, var(--dark-3) 100%)',
            border: '1px solid rgba(201,169,110,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 64, fontWeight: 700, color: 'rgba(139,26,26,0.08)', letterSpacing: '0.3em' }}>CIRCLE</span>
          </div>
          <div style={{
            position: 'absolute', left: 0, bottom: 0,
            width: '55%', height: 180,
            background: 'var(--crimson)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', padding: 20, textAlign: 'center' }}>
              "Tempat di mana ambisi bertemu dengan integritas."
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 60px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="section-eyebrow" style={{ marginBottom: 20 }}>Bergabung</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: 'var(--snow)', marginBottom: 20 }}>
          Siap Menjadi Bagian dari <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Tenryu?</em>
        </h2>
        <p style={{ fontSize: 17, color: 'var(--mist)', fontStyle: 'italic', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Pendaftaran dibuka secara selektif. Setiap permohonan ditinjau langsung oleh tim kami.
        </p>
        <Link href="/pendaftaran" className="btn-primary" style={{ fontSize: 13, padding: '16px 56px' }}>
          Daftar Sekarang
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--dark-2)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: 'var(--snow)', marginBottom: 8 }}>Tenryu Circle</div>
          <div style={{ fontSize: 14, color: 'var(--mist)', lineHeight: 1.7, fontStyle: 'italic' }}>Komunitas eksklusif untuk kolaborasi yang bermakna dan pertumbuhan yang autentik.</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>Navigasi</div>
          {['Beranda', 'Anggota', 'Pendaftaran'].map(l => (
            <div key={l} style={{ fontSize: 14, color: 'var(--mist)', marginBottom: 8 }}>{l}</div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>Legal</div>
          {['Syarat & Ketentuan', 'Kebijakan Privasi', 'FAQ', 'Kontak'].map(l => (
            <div key={l} style={{ fontSize: 14, color: 'var(--mist)', marginBottom: 8 }}>{l}</div>
          ))}
        </div>
      </footer>
      <div style={{ background: 'var(--dark-2)', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase' }}>© 2026 Tenryu Circle — All Rights Reserved</p>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase' }}>Crafted with intention</p>
      </div>

      <style>{`
        @keyframes pulseOrb {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }
        @keyframes rotateSlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceScroll {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </>
  )
}
