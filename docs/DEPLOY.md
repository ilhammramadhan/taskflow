# Deployment Guide — TaskFlow Backend

Panduan deploy backend TaskFlow ke production. Frontend bisa connect langsung ke URL production tanpa jalanin local backend.

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
4. Simpan string ini — akan dipakai di Railway sebagai `DATABASE_URL`

> ⚠️ **Penting**: Pakai yang **"Pooled connection"** (ada `-pooler` di hostname) — bukan "Direct connection". Pooled lebih stabil untuk serverless/short-lived connections.

---

## Bagian 2 — Deploy ke Railway

### Prasyarat
- Akun Railway: https://railway.com (login pakai GitHub)
- $5 trial credit otomatis di akun baru

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
4. Test:
   ```bash
   curl https://taskflow-production-xxxx.up.railway.app/health
   # → {"status":"ok"}
   ```
5. Test register:
   ```bash
   curl -X POST https://taskflow-production-xxxx.up.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"nama":"Test","email":"test@test.com","password":"123456"}'
   # → {"message":"Registrasi berhasil","user":{...}}
   ```

Kalau dua-duanya jalan → ✅ Backend live di production.

---

## Bagian 3 — Update CORS untuk Frontend Production

Setelah frontend deploy ke Vercel (panduan di file lain), Anda akan dapat URL seperti `https://taskflow-fe.vercel.app`.

Update `CORS_ORIGIN` di Railway:

```
CORS_ORIGIN=http://localhost:5173,https://taskflow-fe.vercel.app
```

> Pisahkan multiple origin dengan koma. Spasi tidak masalah, akan di-trim otomatis.

Railway akan auto-redeploy setelah env var diubah (~1 menit).

---

## Bagian 4 — Share URL ke Tim

Kasih tau tim FE URL Railway production-nya. Mereka tinggal set di `frontend/.env`:

```
VITE_API_URL=https://taskflow-production-xxxx.up.railway.app/api
```

Lalu mereka bisa develop frontend tanpa jalanin backend lokal. Semua API call akan ke Railway.

---

## Troubleshooting

### "Cannot find module '@prisma/client'"
Pastikan `postinstall` script jalan saat deploy. Cek build log di Railway. Kalau tidak jalan, tambah ini di Railway "Settings" → "Build Command":
```
npm install && npx prisma generate && npm run build
```

### "P1001: Can't reach database server"
- Cek `DATABASE_URL` benar (ada `?sslmode=require` di akhir)
- Pastikan pakai **Pooled** connection dari Neon, bukan Direct
- Cek Neon dashboard — apakah project status "Active"?

### Migration tidak jalan
Cek "Deploy Logs" di Railway. Kalau `prisma migrate deploy` error:
```bash
# Run manual sekali via Railway CLI
railway run npx prisma migrate deploy
```

### "CORS error" dari frontend
- Pastikan FE URL sudah ada di `CORS_ORIGIN` Railway env
- Pastikan tidak ada trailing slash (`https://foo.vercel.app/` ❌, `https://foo.vercel.app` ✅)
- Restart Railway service setelah ubah env

### Cold start lambat
Railway free tier seharusnya tidak ada cold start. Kalau lambat, kemungkinan database query slow — cek Neon region (pilih yang dekat Indonesia: Singapore).

---

## Cost Estimate

- **Neon**: $0/bulan (free tier — cukup untuk demo & development)
- **Railway**: $5 trial credit, lalu sekitar $5/bulan untuk usage normal student project
- **Total**: ~$5/bulan setelah trial habis

> Kalau mau benar-benar gratis selamanya: ganti Railway → **Render** (free tier). Trade-off: cold start ~30 detik kalau idle 15 menit.
