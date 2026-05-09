# TaskFlow Backend

Express + TypeScript + Prisma + PostgreSQL.

## Setup

```bash
cp .env.example .env
# isi DATABASE_URL (Neon) dan JWT_SECRET

npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Server jalan di `http://localhost:4000`.

## Scripts

| Command | Untuk |
|---|---|
| `npm run dev` | Dev mode dengan auto-reload (tsx watch) |
| `npm run build` | Compile TypeScript ke `dist/` |
| `npm start` | Jalanin compiled JS dari `dist/` |
| `npm run prisma:migrate` | Buat / apply migration |
| `npm run prisma:studio` | GUI untuk lihat data (port 5555) |
| `npm run typecheck` | Cek TypeScript tanpa build |

## API Endpoints

Semua endpoint `/api/tasks/*` dan `/api/categories/*` butuh header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Auth
| Method | Path | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ nama, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` → returns `{ token, user }` |
| POST | `/api/auth/logout` | — |

### Tasks
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/tasks?categoryId=&deadline=with\|without\|all` | List task milik user |
| POST | `/api/tasks` | `{ judul, deskripsi?, deadline?, categoryId? }` |
| GET | `/api/tasks/:id` | Detail task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/toggle` | Toggle status BELUM ↔ SELESAI |
| DELETE | `/api/tasks/:id` | Delete task |

### Categories
| Method | Path | Keterangan |
|---|---|---|
| GET | `/api/categories` | List kategori user |
| POST | `/api/categories` | `{ namaCategory }` |
| DELETE | `/api/categories/:id` | Delete (gagal kalau masih dipakai task) |

## Struktur Folder

```
backend/
├── prisma/
│   └── schema.prisma       Database schema
├── src/
│   ├── index.ts            Entry — start HTTP server
│   ├── app.ts              Express app factory
│   ├── routes/             Route handlers
│   ├── middleware/         Auth, error handler
│   └── lib/                Prisma client, JWT helpers
└── package.json
```

## Buat Database di Neon (gratis)

1. Daftar di https://neon.tech
2. Create project → copy connection string
3. Paste ke `DATABASE_URL` di `.env`
4. Run `npx prisma migrate dev --name init`
