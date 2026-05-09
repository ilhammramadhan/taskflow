# TaskFlow

Aplikasi manajemen tugas berbasis web. Tugas Kelompok 1 — Software Engineering, Binus University Online Learning.

> 📘 **Spesifikasi**: [`docs/Laporan Proyek.pdf`](./docs/Laporan%20Proyek.pdf)
> 🔌 **API spec untuk tim FE**: [`docs/API.md`](./docs/API.md) + [`docs/postman_collection.json`](./docs/postman_collection.json)
> 🚀 **Deploy guide**: [`docs/DEPLOY.md`](./docs/DEPLOY.md)
> 🌐 **Production backend**: https://taskflow-e0yh.onrender.com

---

## Tim Kelompok 1

| Nama | NIM |
|------|-----|
| Hanif Roykhan Sukma | 2702505556 |
| M. Erick Mahaputra Asril | 2702495580 |
| Mochammad Ilham Ramadhan | 2702506956 |
| Muhammad Zaky Fathurrohman | 2702502062 |
| Nisrina Qurratu'Ain | 2702492944 |

---

## Struktur Repo (Monorepo)

```
taskflow/
├── backend/        Express + TypeScript + Prisma + PostgreSQL
├── frontend/       React + Vite + TypeScript + Tailwind CSS
├── docs/           Laporan proyek + dokumentasi tambahan
└── .github/        PR & issue templates
```

---

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL (Neon — cloud) |
| Auth | JWT + bcrypt |
| Deploy | Vercel (FE) + Railway (BE) |

---

## Quick Start

### 1. Clone

```bash
git clone git@github.com:ilhammramadhan/taskflow.git
cd taskflow
```

### 2. Setup database (Neon)

Salah satu anggota tim buat database gratis di [neon.tech](https://neon.tech) → copy `DATABASE_URL` → share ke tim via grup chat (jangan commit ke repo).

### 3. Backend

```bash
cd backend
cp .env.example .env       # isi DATABASE_URL & JWT_SECRET
npm install
npx prisma migrate dev     # buat tabel di Neon
npm run dev                # http://localhost:4000
```

### 4. Frontend

```bash
cd frontend
cp .env.example .env       # isi VITE_API_URL
npm install
npm run dev                # http://localhost:5173
```

---

## Fitur (sesuai laporan)

- [x] Auth: register, login, logout
- [ ] Task CRUD (create, read, update, delete)
- [ ] Toggle status task (selesai / belum)
- [ ] Category management (add, list, delete dengan guard)
- [ ] Deadline opsional pada task
- [ ] Filter task by category & deadline

---

## Workflow Kolaborasi

Lihat [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) dan [`docs/BRANCHING.md`](./docs/BRANCHING.md).

Singkatnya:
1. Pull latest `main`
2. Buat branch dari `main`: `feat/nama-fitur` atau `fix/nama-bug`
3. Commit pakai [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, dst)
4. Push branch → buka Pull Request → minimal 1 reviewer approve → merge ke `main`
5. **Jangan push langsung ke `main`**

---

## Deployment

| Service | Free tier? | Setting |
|---|---|---|
| **Vercel** (FE) | ✅ | Import repo, set Root Directory = `frontend`, env: `VITE_API_URL` |
| **Railway** (BE) | ✅ ($5/mo trial) | Import repo, set Root Directory = `backend`, env: `DATABASE_URL`, `JWT_SECRET` |
| **Neon** (DB) | ✅ | Copy `DATABASE_URL` ke Railway env |
