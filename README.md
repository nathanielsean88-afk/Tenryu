# Tenryu Circle 🔴

Website komunitas eksklusif — Next.js 14 + Clerk Auth.
**Tanpa database eksternal** — data disimpan di file JSON lokal.

---

## 🛠 Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Clerk |
| Storage | JSON file lokal (di Railway filesystem) |
| Styling | Tailwind CSS |
| Deploy | Railway |

> ⚠️ Data (member, pendaftaran, pengumuman) akan reset setiap kali redeploy. Ini normal dan by design.

---

## 🚀 Setup

### 1. Clone & Install
```bash
git clone https://github.com/username/tenryu-circle.git
cd tenryu-circle
npm install
```

### 2. Setup Clerk
1. Buat akun di clerk.com → buat application
2. Copy API Keys
3. Buat Webhook → URL: `https://tenryu-production.up.railway.app/api/webhooks/clerk`
4. Events: `user.created`, `user.updated`, `user.deleted`

### 3. Set Env Variables di Railway
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/member
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/pendaftaran
CLERK_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=https://tenryu-production.up.railway.app
```

### 4. Build Command di Railway
```
next build
```
(Tidak perlu prisma generate lagi!)

### 5. Set Admin
Clerk Dashboard → Users → klik user → Public Metadata:
```json
{ "role": "ADMIN" }
```

---

## 📁 Struktur
```
tenryu-circle/
├── app/               # Semua halaman
├── components/        # Navbar
├── lib/
│   ├── auth.ts        # Clerk auth helpers
│   └── storage.ts     # JSON file storage
├── data/              # File JSON data (auto-created)
│   ├── members.json
│   ├── applications.json
│   └── announcements.json
└── public/
    └── logo.png
```
