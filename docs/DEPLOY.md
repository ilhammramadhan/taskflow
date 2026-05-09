# Deployment Guide — TaskFlow Backend

Panduan deploy backend TaskFlow ke production. Frontend bisa connect langsung ke URL production tanpa jalanin local backend.

> **Default platform: Render** (gratis permanen, no credit card).
> Railway juga didukung sebagai alternatif — tapi free trial-nya terbatas.

---

## Bagian 1 — Setup Database (Neon)

Neon = PostgreSQL gratis, cloud-hosted, no credit card.

### Langkah

1. Buka https://neon.tech → Sign up pakai GitHub
2. Klik **"Create project"**:
   - Name: `taskflow`
   - Region: pilih yang terdekat (Singapore: `ap-southeast-1`)
   - Postgres version: 16 (default)
3. Setelah project dibuat, copy **"Connection string (Pooled connection)"**:
   ```
   postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/taskflow?sslmode=require
   ```
4. Simpan string ini — akan dipakai sebagai `DATABASE_URL` di hosting platform

> ⚠️ **Penting**: Pakai yang **"Pooled connection"** (ada `-pooler` di hostname) — bukan "Direct connection". Pooled lebih stabil untuk serverless/short-lived connections.

---

## Bagian 2A — Deploy ke Render (Recommended, Gratis Permanen)

### Karakteristik Render Free Tier
- ✅ Gratis permanen, tidak butuh kartu kredit
- ✅ 750 jam runtime/bulan (cukup untuk 1 service running 24/7)
- ✅ Auto-deploy dari GitHub push
- ✅ Auto-HTTPS
- ⚠️ Service "sleep" setelah **15 menit idle**. Request pertama setelah sleep = **30-60 detik delay** (cold start). Setelah aktif, normal speed.

> **Tips untuk demo dosen:** "warm-up" service 5 menit sebelum demo dengan akses URL sekali. Service akan aktif selama 15 menit ke depan.

### Langkah

1. Buka https://render.com → **Sign up dengan GitHub**
2. Di dashboard, klik **"New +"** → **"Blueprint"**
3. Connect repo `ilhammramadhan/taskflow`
4. Render auto-detect file `backend/render.yaml` dan show preview service yang akan dibuat
5. Klik **"Apply"** untuk deploy

### Set Environment Variables

Render akan minta isi variable yang `sync: false`:

| Key | Value | Cara isi |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | Paste dari Neon (Bagian 1 step 3) |
| `JWT_SECRET` | `<random 32+ char>` | Generate via: `openssl rand -base64 32` |

`CORS_ORIGIN` dan `NODE_ENV` sudah ada default value di `render.yaml`.

### Verifikasi Deploy

1. Tunggu build selesai (~3-5 menit, build pertama paling lama)
2. URL service Anda: `https://taskflow-backend.onrender.com` (atau dengan suffix random)
3. Test:
   ```bash
   curl https://taskflow-backend.onrender.com/health
   # → {"status":"ok"}
   ```
4. Test register:
   ```bash
   curl -X POST https://taskflow-backend.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"nama":"Test","email":"test@test.com","password":"123456"}'
   # → {"message":"Registrasi berhasil","user":{...}}
   ```

Kalau dua-duanya jalan → ✅ Backend live.

> Kalau test pertama lambat (>30 detik), itu cold start — wajar. Test ulang setelah service aktif.

---

## Bagian 2B — Deploy ke Railway (Alternatif, Butuh Trial / Paid)

### Prasyarat
- Akun Railway: https://railway.com (login pakai GitHub)
- $5 trial credit di akun baru — kalau trial habis, harus pakai kartu kredit (~$5/bulan)

### Langkah

1. Di Railway dashboard, klik **"New Project"** → **"Deploy from GitHub repo"**
2. Pilih repo `ilhammramadhan/taskflow`
3. Saat ditanya **Root Directory**, set: `backend`
   > Penting karena ini monorepo — Railway harus tau folder mana yang mau di-deploy
4. Railway otomatis detect Node + jalankan `npm install` (dan `postinstall` → `prisma generate`)

### Set Environment Variables

Di Railway dashboard → tab **"Variables"**, tambahkan:

| Key | Value | Cara isi |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` | Paste dari Neon (Bagian 1 step 3) |
| `JWT_SECRET` | `<random 32+ char>` | Generate via: `openssl rand -base64 32` |
| `CORS_ORIGIN` | `http://localhost:5173` | Sementara — tambah URL Vercel nanti |
| `NODE_ENV` | `production` | Untuk disable Prisma debug log |

`PORT` **tidak perlu** di-set — Railway auto-inject `PORT` env saat runtime.

### Verifikasi Deploy

1. Tunggu build selesai (~2-3 menit)
2. Klik tab **"Settings"** → scroll ke **"Networking"** → klik **"Generate Domain"**
3. Anda dapat URL seperti: `https://taskflow-production-xxxx.up.railway.app`
4. Test pakai curl yang sama seperti di Bagian 2A.

---

## Bagian 3 — Update CORS untuk Frontend Production

Setelah frontend deploy ke Vercel (panduan di file lain), Anda akan dapat URL seperti `https://taskflow-fe.vercel.app`.

Update `CORS_ORIGIN` di hosting platform (Render atau Railway):

```
CORS_ORIGIN=http://localhost:5173,https://taskflow-fe.vercel.app
```

> Pisahkan multiple origin dengan koma. Spasi tidak masalah, akan di-trim otomatis.

Service akan auto-redeploy setelah env var diubah (~1-2 menit).

---

## Bagian 4 — Share URL ke Tim

Kasih tau tim FE URL production. Mereka tinggal set di `frontend/.env`:

```
# Render:
VITE_API_URL=https://taskflow-backend.onrender.com/api

# Atau Railway:
VITE_API_URL=https://taskflow-production-xxxx.up.railway.app/api
```

Lalu mereka bisa develop frontend tanpa jalanin backend lokal. Semua API call akan ke production.

---

## Troubleshooting

### "Cannot find module '@prisma/client'"
Pastikan `postinstall` script jalan saat deploy. Cek build log. Kalau tidak jalan, override build command:
```
npm install && npx prisma generate && npm run build
```

### "P1001: Can't reach database server"
- Cek `DATABASE_URL` benar (ada `?sslmode=require` di akhir)
- Pastikan pakai **Pooled** connection dari Neon, bukan Direct
- Cek Neon dashboard — apakah project status "Active"?

### Migration tidak jalan
Cek "Deploy Logs". Kalau `prisma migrate deploy` error, coba run manual:
```bash
# Render: pakai Shell tab di service dashboard
npx prisma migrate deploy

# Railway: pakai Railway CLI
railway run npx prisma migrate deploy
```

### "CORS error" dari frontend
- Pastikan FE URL sudah ada di `CORS_ORIGIN` env var di hosting platform
- Pastikan tidak ada trailing slash (`https://foo.vercel.app/` ❌, `https://foo.vercel.app` ✅)
- Restart service setelah ubah env var

### Render: Cold start lambat banget setelah idle
Itu wajar di free tier. Mitigasi:
1. **Untuk demo**: warm-up dengan akses URL 5 menit sebelum demo
2. **Untuk production**: upgrade ke paid tier ($7/bulan) — no cold start
3. **Jangan** pakai uptime ping (cron-job.org dll) untuk fake-aktif — melanggar Render ToS, akun bisa di-suspend

### Build gagal: "JWT_SECRET is not set"
Backend crash di startup kalau `JWT_SECRET` kosong. Pastikan sudah set di Variables/Environment.

---

## Cost Estimate

| Stack | Bulanan |
|---|---|
| Neon free + Render free | **$0** (selamanya, ada cold start) |
| Neon free + Render paid | **$7** (no cold start) |
| Neon free + Railway | **~$5** setelah trial habis |

Untuk student project / demo dosen, **Neon + Render free = $0** sudah cukup.
