'use client'
// app/admin/AdminClient.tsx
import { useState } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Application = {
  id: string; firstName: string; lastName: string; email: string; phone: string
  division: string; motivation: string; contribution: string; referral: string
  profession: string; institution: string; portfolio: string | null
  status: string; adminNote: string | null; createdAt: Date
}

type Member = { id: string; name: string; email: string; division: string | null; joinedAt: Date; clerkId: string }
type Announcement = { id: string; title: string; content: string; createdAt: Date }

type Props = {
  applications: Application[]
  members: Member[]
  announcements: Announcement[]
  stats: { total: number; pending: number; approved: number; rejected: number }
}

const DIVISION_LABELS: Record<string, string> = {
  CREATIVE: 'Creative', TECHNOLOGY: 'Technology', BUSINESS: 'Business',
  OPERATIONS: 'Operations', CONTENT: 'Content', FINANCE: 'Finance',
}

export default function AdminClient({ applications, members, announcements, stats }: Props) {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState<'applications' | 'members' | 'announcements'>('applications')
  const [selected, setSelected] = useState<Application | null>(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState('')
  const [toast, setToast] = useState<{ title: string; desc: string } | null>(null)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' })

  const showToast = (title: string, desc: string) => {
    setToast({ title, desc })
    setTimeout(() => setToast(null), 3500)
  }

  const updateApplication = async (id: string, status: 'APPROVED' | 'REJECTED', note?: string) => {
    setLoading(id)
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: note }),
      })
      if (!res.ok) throw new Error()
      showToast(status === 'APPROVED' ? 'Disetujui ✓' : 'Ditolak', status === 'APPROVED' ? 'Anggota baru telah disetujui dan mendapat role Member.' : 'Permohonan telah ditolak.')
      setSelected(null)
      router.refresh()
    } catch {
      showToast('Error', 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading('')
    }
  }

  const postAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement),
      })
      if (!res.ok) throw new Error()
      showToast('Pengumuman Terposting', 'Anggota dapat melihat pengumuman ini di dashboard mereka.')
      setNewAnnouncement({ title: '', content: '' })
      router.refresh()
    } catch {
      showToast('Error', 'Gagal memposting pengumuman.')
    }
  }

  const filteredApps = statusFilter === 'ALL' ? applications : applications.filter(a => a.status === statusFilter)

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2, padding: '12px 16px', color: 'var(--snow)',
    fontFamily: "'EB Garamond', serif", fontSize: 16, outline: 'none', width: '100%',
  }

  const navItems = [
    { id: 'applications' as const, label: `Permohonan (${stats.pending} pending)` },
    { id: 'members' as const, label: `Anggota (${stats.total})` },
    { id: 'announcements' as const, label: 'Pengumuman' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '270px 1fr', background: 'var(--obsidian)' }}>

      {/* Sidebar */}
      <aside style={{ background: 'var(--dark-2)', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '40px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 28px 24px', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, border: '1px solid rgba(201,169,110,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'radial-gradient(circle, rgba(139,26,26,0.2) 0%, transparent 70%)' }}>
            <Image src="/logo.png" alt="Tenryu" width={30} height={30} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 600, color: 'var(--snow)' }}>TENRYU</div>
        </Link>

        <div style={{ padding: '0 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <UserButton appearance={{ elements: { avatarBox: { width: 40, height: 40, border: '1.5px solid var(--gold)' } } }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--snow)' }}>Admin</div>
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,26,26,0.2)', border: '1px solid rgba(139,26,26,0.4)', padding: '5px 12px', borderRadius: 2, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--crimson-light)', textTransform: 'uppercase' }}>
            ★ Administrator
          </div>
        </div>

        <nav style={{ padding: '0 16px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 16px', borderRadius: 2, marginBottom: 2,
                border: 'none', cursor: 'pointer',
                background: activeNav === item.id ? 'rgba(139,26,26,0.2)' : 'transparent',
                borderLeft: activeNav === item.id ? '2px solid var(--crimson)' : '2px solid transparent',
                fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: activeNav === item.id ? 'var(--snow)' : 'var(--mist)',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ padding: '48px 56px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Panel Kontrol</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: 'var(--snow)' }}>
              Manajemen <em style={{ fontStyle: 'italic', color: 'var(--crimson-light)' }}>Anggota</em>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 48 }}>
          {[
            { label: 'Total Anggota', value: stats.total, color: 'var(--snow)' },
            { label: 'Menunggu Review', value: stats.pending, color: 'var(--gold)' },
            { label: 'Disetujui', value: stats.approved, color: '#6dbf6d' },
            { label: 'Ditolak', value: stats.rejected, color: 'var(--crimson-light)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: 24, position: 'relative', borderRadius: 3 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: 'var(--crimson)' }} />
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--mist)', textTransform: 'uppercase', marginBottom: 10 }}>{s.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: s.color, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Applications Tab */}
        {activeNav === 'applications' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: 'var(--snow)' }}>Permohonan Masuk</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '6px 16px', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', border: `1px solid ${statusFilter === s ? 'var(--crimson)' : 'rgba(255,255,255,0.1)'}`, background: statusFilter === s ? 'rgba(139,26,26,0.15)' : 'transparent', color: statusFilter === s ? 'var(--snow)' : 'var(--mist)', cursor: 'pointer', borderRadius: 2 }}>
                    {s === 'ALL' ? 'Semua' : s === 'PENDING' ? 'Pending' : s === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr', padding: '14px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Nama Pelamar', 'Email', 'Divisi', 'Status', 'Aksi'].map(h => (
                  <div key={h} style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase' }}>{h}</div>
                ))}
              </div>
              {filteredApps.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--mist)', fontStyle: 'italic' }}>Tidak ada permohonan.</div>
              )}
              {filteredApps.map(a => (
                <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1.2fr', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--snow)' }}>{a.firstName} {a.lastName}</div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: 'var(--smoke)', letterSpacing: '0.15em', marginTop: 2 }}>
                      {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--mist)' }}>{a.email}</div>
                  <div style={{ fontSize: 14, color: 'var(--pearl)' }}>{DIVISION_LABELS[a.division] ?? a.division}</div>
                  <div>
                    <span className={`badge-${a.status.toLowerCase()}`}>
                      {a.status === 'PENDING' ? 'Menunggu' : a.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setSelected(a)} style={{ padding: '5px 10px', fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(201,169,110,0.3)', color: 'var(--gold)', background: 'transparent' }}>Detail</button>
                    {a.status === 'PENDING' && (
                      <>
                        <button onClick={() => updateApplication(a.id, 'APPROVED')} disabled={loading === a.id} style={{ padding: '5px 10px', fontFamily: "'Cinzel', serif", fontSize: 9, borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(34,139,34,0.4)', color: '#6dbf6d', background: 'rgba(34,139,34,0.08)' }}>✓</button>
                        <button onClick={() => updateApplication(a.id, 'REJECTED')} disabled={loading === a.id} style={{ padding: '5px 10px', fontFamily: "'Cinzel', serif", fontSize: 9, borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(139,26,26,0.4)', color: 'var(--crimson-light)', background: 'rgba(139,26,26,0.08)' }}>✗</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Members Tab */}
        {activeNav === 'members' && (
          <>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: 'var(--snow)', marginBottom: 20 }}>Daftar Anggota</div>
            <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', padding: '14px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Nama', 'Email', 'Divisi', 'Bergabung'].map(h => (
                  <div key={h} style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase' }}>{h}</div>
                ))}
              </div>
              {members.map(m => (
                <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--snow)' }}>{m.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--mist)' }}>{m.email}</div>
                  <div style={{ fontSize: 14, color: 'var(--pearl)' }}>{m.division ? DIVISION_LABELS[m.division] : '—'}</div>
                  <div style={{ fontSize: 13, color: 'var(--smoke)' }}>{new Date(m.joinedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Announcements Tab */}
        {activeNav === 'announcements' && (
          <>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: 'var(--snow)', marginBottom: 24 }}>Buat Pengumuman</div>
            <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: 32, borderRadius: 3, marginBottom: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.25em', color: 'var(--mist)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Judul Pengumuman</label>
                  <input style={inputStyle} value={newAnnouncement.title} onChange={e => setNewAnnouncement(a => ({ ...a, title: e.target.value }))} placeholder="Judul pengumuman..." />
                </div>
                <div>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.25em', color: 'var(--mist)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Isi Pengumuman</label>
                  <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={newAnnouncement.content} onChange={e => setNewAnnouncement(a => ({ ...a, content: e.target.value }))} placeholder="Isi pengumuman untuk anggota..." />
                </div>
                <button className="btn-primary" onClick={postAnnouncement} style={{ alignSelf: 'flex-start' }}>Posting Pengumuman</button>
              </div>
            </div>

            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: 'var(--snow)', marginBottom: 16 }}>Pengumuman Sebelumnya</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {announcements.map(a => (
                <div key={a.id} style={{ background: 'var(--dark-2)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', borderRadius: 3 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--snow)', marginBottom: 6 }}>{a.title}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.2em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>
                    {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--mist)', fontStyle: 'italic' }}>{a.content}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Application Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelected(null)}>
          <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(201,169,110,0.2)', maxWidth: 620, width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: 48, position: 'relative', borderRadius: 3 }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 20, right: 20, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--mist)', fontSize: 20, background: 'none', border: 'none' }}>×</button>

            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: 'var(--snow)', marginBottom: 4 }}>{selected.firstName} {selected.lastName}</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 28 }}>
              {DIVISION_LABELS[selected.division] ?? selected.division} · Daftar {new Date(selected.createdAt).toLocaleDateString('id-ID')}
            </div>

            {[
              { label: 'Email', value: selected.email },
              { label: 'Telepon', value: selected.phone },
              { label: 'Profesi', value: selected.profession },
              { label: 'Institusi', value: selected.institution },
              { label: 'Referral', value: selected.referral },
              { label: 'Portfolio', value: selected.portfolio },
            ].filter(i => i.value).map(item => (
              <div key={item.label} style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 15, color: 'var(--pearl)' }}>{item.value}</div>
              </div>
            ))}

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Motivasi</div>
              <div style={{ fontSize: 15, color: 'var(--pearl)', lineHeight: 1.7, fontStyle: 'italic', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>"{selected.motivation}"</div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Kontribusi</div>
              <div style={{ fontSize: 15, color: 'var(--pearl)', lineHeight: 1.7, fontStyle: 'italic', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>"{selected.contribution}"</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.3em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8 }}>Status Saat Ini</div>
              <span className={`badge-${selected.status.toLowerCase()}`}>
                {selected.status === 'PENDING' ? 'Menunggu Review' : selected.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
              </span>
            </div>

            {selected.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => updateApplication(selected.id, 'APPROVED')} disabled={loading === selected.id}>
                  {loading === selected.id ? 'Memproses...' : '✓ Setujui Anggota'}
                </button>
                <button className="btn-outline" style={{ flex: 1, borderColor: 'var(--crimson)', color: 'var(--crimson-light)' }} onClick={() => updateApplication(selected.id, 'REJECTED')} disabled={loading === selected.id}>
                  ✗ Tolak
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 40, right: 40, background: 'var(--dark-2)', border: '1px solid rgba(201,169,110,0.3)', borderLeft: '3px solid var(--gold)', padding: '16px 24px', zIndex: 9000, maxWidth: 320, borderRadius: 2 }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 4 }}>{toast.title}</div>
          <div style={{ fontSize: 13, color: 'var(--pearl)' }}>{toast.desc}</div>
        </div>
      )}
    </div>
  )
}
