# Tenryu Circle 🔴

Website komunitas eksklusif berbasis Next.js 14 + Clerk + PostgreSQL (Railway).

---

## 🛠 Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Clerk |
| Database | PostgreSQL via Railway |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Deploy | Railway |

---

## 🚀 Setup Step-by-Step

### 1. Clone & Install

```bash
git clone https://github.com/username/tenryu-circle.git
cd tenryu-circle
npm install
```

### 2. Setup Clerk

1. Buat akun di [clerk.com](https://clerk.com)
2. Buat application baru
3. Di **API Keys**, copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Di **Webhooks** → Add Endpoint:
   - URL: `https://your-app.railway.app/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
   - Copy `Signing Secret` → `CLERK_WEBHOOK_SECRET`

### 3. Setup Database (Railway)

1. Buka [railway.app](https://railway.app)
2. New Project → **Add PostgreSQL**
3. Klik PostgreSQL → **Variables** → copy `DATABASE_URL`

### 4. Set Admin Pertama

Setelah deploy, buka Clerk Dashboard → **Users** → klik user kamu → **Metadata** → tambahkan:
```json
{
  "role": "ADMIN"
}
```

### 5. Env Variables

Buat file `.env` (lokal) atau set di Railway Dashboard → Variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/member
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/pendaftaran
CLERK_WEBHOOK_SECRET=whsec_xxx
DATABASE_URL=postgresql://user:pass@host:port/dbname
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

### 6. Database Migration

```bash
npx prisma db push
npx prisma generate
```

### 7. Deploy ke Railway

1. Push ke GitHub:
```bash
git add .
git commit -m "initial commit"
git push origin main
```

2. Railway → New Project → **Deploy from GitHub repo**
3. Pilih repo → Railway otomatis detect Next.js
4. Tambahkan semua env variables di Railway → **Variables**
5. Deploy!

---

## 📁 Struktur Project

```
tenryu-circle/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Clerk SignIn
│   ├── register/page.tsx     # Clerk SignUp
│   ├── pendaftaran/page.tsx  # Form pendaftaran (3 steps)
│   ├── gallery/              # Galeri anggota
│   ├── member/               # Dashboard member
│   ├── admin/                # Admin panel
│   └── api/
│       ├── applications/     # CRUD permohonan
│       ├── announcements/    # Pengumuman
│       └── webhooks/clerk/   # Sync Clerk → DB
├── components/
│   └── layout/Navbar.tsx
├── lib/
│   ├── prisma.ts             # Prisma client
│   └── auth.ts               # Auth helpers + role utils
├── prisma/
│   └── schema.prisma         # Database schema
└── middleware.ts             # Route protection
```

---

## 🔐 Role System

| Role | Akses |
|---|---|
| Guest | Landing, Gallery, Form Pendaftaran |
| Member | Dashboard member, lihat anggota |
| Admin | Admin panel, approve/reject, buat pengumuman |

**Flow pendaftaran:**
1. User isi form pendaftaran → masuk DB sebagai `PENDING`
2. Admin review di panel → klik Setujui/Tolak
3. Jika disetujui → role user otomatis jadi `MEMBER` di Clerk + DB

---

## 🎨 Kustomisasi

- **Nama circle**: Ganti `TENRYU` di `Navbar.tsx` dan `app/page.tsx`
- **Warna**: Edit `--crimson` di `app/globals.css`
- **Logo**: Ganti SVG di `components/layout/Navbar.tsx`
- **Divisi**: Edit enum `Division` di `prisma/schema.prisma`

---

## 📞 Troubleshooting

**Webhook tidak jalan?**
→ Pastikan URL webhook di Clerk sudah benar dan `CLERK_WEBHOOK_SECRET` sudah di-set.

**Prisma error saat build?**
→ Pastikan `DATABASE_URL` sudah di-set di Railway Variables.

**User tidak masuk DB?**
→ Cek webhook Clerk sudah aktif dan endpoint bisa diakses Railway.
