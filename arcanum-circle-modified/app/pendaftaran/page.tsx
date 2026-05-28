'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Image from 'next/image'

type Step = 1 | 2 | 3

export default function PendaftaranPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    ccSebelumnya: '',
    alasanKeluar: '',
    alasanMasuk: '',
    tiktok: '',
    discord: '',
    whatsapp: '',
    umur: '',
    asalKota: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      alert('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2, padding: '14px 18px',
    color: 'var(--snow)', fontFamily: "'EB Garamond', serif",
    fontSize: 16, outline: 'none', width: '100%', transition: 'all 0.3s',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Cinzel', serif", fontSize: 10,
    letterSpacing: '0.25em', color: 'var(--mist)',
    textTransform: 'uppercase', display: 'block', marginBottom: 8,
  }

  const steps = ['Informasi', 'Sosial Media', 'Konfirmasi']

  if (submitted) {
    return (
      <>
        <div className="noise-overlay" />
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--obsidian)', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,26,26,0.2) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 560, textAlign: 'center', padding: 60, border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)' }}>
            {/* Logo */}
            <div style={{ width: 80, height: 80, border: '1.5px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', overflow: 'hidden', background: 'radial-gradient(circle, rgba(139,26,26,0.3) 0%, transparent 70%)' }}>
              <Image src="/logo.png" alt="Tenryu" width={64} height={64} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(201,169,110,0.5))' }} />
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>Tenryu Circle</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: 'var(--snow)', marginBottom: 16 }}>
              Permohonan <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Terkirim</em>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--mist)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 40 }}>
              Terima kasih telah mendaftar ke Tenryu Circle. Tim kami akan meninjau permohonanmu dan menghubungi kamu melalui WhatsApp atau Discord dalam 3–5 hari kerja.
            </p>
            <button className="btn-primary" onClick={() => router.push('/menunggu')}>Lihat Status Pendaftaran</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        {/* Header */}
        <div style={{ position: 'relative', padding: '80px 60px 60px', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(139,26,26,0.15) 0%, transparent 70%)' }} />

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, position: 'relative' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%)', boxShadow: '0 0 30px rgba(139,26,26,0.2)' }}>
              <Image src="/logo.png" alt="Tenryu Circle" width={60} height={60} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(201,169,110,0.4))' }} />
            </div>
          </div>

          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.5em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <span style={{ display: 'block', width: 30, height: 1, background: 'var(--gold)', opacity: 0.5 }} />
            Membership
            <span style={{ display: 'block', width: 30, height: 1, background: 'var(--gold)', opacity: 0.5 }} />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: 'var(--snow)', position: 'relative', letterSpacing: '-0.01em' }}>
            Formulir <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Pendaftaran</em>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--mist)', marginTop: 16, fontStyle: 'italic', position: 'relative' }}>
            Langkah pertama menuju komunitas Tenryu Circle
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40, position: 'relative' }}>
            {steps.map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: `1px solid ${i + 1 <= step ? 'var(--crimson)' : 'rgba(255,255,255,0.1)'}`,
                    background: i + 1 < step ? 'var(--crimson)' : i + 1 === step ? 'rgba(139,26,26,0.2)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Cinzel', serif", fontSize: 12,
                    color: i + 1 <= step ? 'var(--snow)' : 'var(--smoke)', transition: 'all 0.3s',
                  }}>
                    {i + 1 < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.15em', color: i + 1 <= step ? 'var(--gold)' : 'var(--smoke)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ width: 60, height: 1, background: i + 1 < step ? 'var(--crimson)' : 'rgba(255,255,255,0.1)', marginBottom: 24, transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px 80px' }}>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 12 }}>
                Informasi Circle
                <span style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.2)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={labelStyle}>CC Sebelumnya</label>
                <input style={inputStyle} value={form.ccSebelumnya} onChange={e => set('ccSebelumnya', e.target.value)} placeholder="Nama CC/komunitas sebelumnya (isi '-' jika tidak ada)" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={labelStyle}>Alasan Keluar dari CC Sebelumnya</label>
                <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.alasanKeluar} onChange={e => set('alasanKeluar', e.target.value)} placeholder="Ceritakan alasanmu keluar dari CC sebelumnya (isi '-' jika tidak ada CC sebelumnya)" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={labelStyle}>Alasan Masuk Tenryu Circle</label>
                <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.alasanMasuk} onChange={e => set('alasanMasuk', e.target.value)} placeholder="Ceritakan alasanmu ingin bergabung dengan Tenryu Circle..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={labelStyle}>Umur</label>
                  <input style={inputStyle} type="number" min="13" max="99" value={form.umur} onChange={e => set('umur', e.target.value)} placeholder="Umur kamu" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={labelStyle}>Asal Kota</label>
                  <input style={inputStyle} value={form.asalKota} onChange={e => set('asalKota', e.target.value)} placeholder="Jakarta, Bandung, Surabaya, dll." />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 12 }}>
                Kontak & Sosial Media
                <span style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.2)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={labelStyle}>Nomor WhatsApp</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--mist)', fontFamily: "'EB Garamond', serif", fontSize: 16 }}>+62</span>
                  <input style={{ ...inputStyle, paddingLeft: 52 }} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="8xx-xxxx-xxxx" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={labelStyle}>Username TikTok</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--mist)', fontFamily: "'EB Garamond', serif", fontSize: 16 }}>@</span>
                  <input style={{ ...inputStyle, paddingLeft: 36 }} value={form.tiktok} onChange={e => set('tiktok', e.target.value)} placeholder="usernamekamu" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={labelStyle}>Username Discord</label>
                <input style={inputStyle} value={form.discord} onChange={e => set('discord', e.target.value)} placeholder="username#0000 atau username" />
              </div>

              {/* Info box */}
              <div style={{ padding: '16px 20px', border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(201,169,110,0.04)', borderRadius: 2 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Info</div>
                <p style={{ fontSize: 14, color: 'var(--mist)', fontStyle: 'italic', lineHeight: 1.7 }}>
                  Nomor WhatsApp dan Discord akan digunakan untuk menghubungi kamu terkait hasil seleksi dan koordinasi circle.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Konfirmasi */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                Konfirmasi Data
                <span style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.2)' }} />
              </div>

              {[
                { label: 'CC Sebelumnya', value: form.ccSebelumnya },
                { label: 'Umur', value: form.umur ? `${form.umur} tahun` : '' },
                { label: 'Asal Kota', value: form.asalKota },
                { label: 'WhatsApp', value: form.whatsapp ? `+62 ${form.whatsapp}` : '' },
                { label: 'TikTok', value: form.tiktok ? `@${form.tiktok}` : '' },
                { label: 'Discord', value: form.discord },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.2em', color: 'var(--mist)', textTransform: 'uppercase' }}>{item.label}</span>
                  <span style={{ fontSize: 16, color: 'var(--pearl)', fontFamily: "'EB Garamond', serif" }}>{item.value || '—'}</span>
                </div>
              ))}

              <div style={{ marginTop: 20, padding: 20, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Alasan Masuk</div>
                <p style={{ fontSize: 15, color: 'var(--pearl)', fontStyle: 'italic', lineHeight: 1.7 }}>{form.alasanMasuk || '—'}</p>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 24 }}>
                <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: 'var(--crimson)', marginTop: 3, cursor: 'pointer', flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: 'var(--mist)', lineHeight: 1.6 }}>
                  Saya menyetujui <span style={{ color: 'var(--gold)' }}>Syarat & Ketentuan</span> serta <span style={{ color: 'var(--gold)' }}>Peraturan</span> Tenryu Circle
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 48 }}>
            {step > 1 && (
              <button className="btn-outline" onClick={() => setStep(s => (s - 1) as Step)}>← Kembali</button>
            )}
            {step < 3 ? (
              <button className="btn-primary" onClick={() => setStep(s => (s + 1) as Step)}>Lanjutkan →</button>
            ) : (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 240 }}
              >
                {loading ? 'Mengirim...' : 'Kirim Permohonan'}
              </button>
            )}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--smoke)', marginTop: 16, fontStyle: 'italic' }}>
            Proses review 3–5 hari kerja
          </p>
        </div>
      </div>
    </>
  )
}
