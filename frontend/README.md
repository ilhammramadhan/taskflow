# TaskFlow Frontend

React + Vite + TypeScript + Tailwind CSS.

## Setup

```bash
cp .env.example .env       # set VITE_API_URL (default: http://localhost:4000/api)
npm install
npm run dev
```

App jalan di `http://localhost:5173`.

> Pastikan backend (`/backend`) sudah jalan di port 4000 sebelum start frontend.

## Scripts

| Command | Untuk |
|---|---|
| `npm run dev` | Vite dev server dengan HMR |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Preview build hasil compile |
| `npm run typecheck` | Cek TypeScript tanpa build |

## Struktur Folder

```
frontend/
├── index.html
├── src/
│   ├── main.tsx              Entry — mount app
│   ├── App.tsx               Routing
│   ├── index.css             Tailwind base
│   ├── api/client.ts         Axios instance + auth interceptor
│   ├── contexts/AuthContext  User & token state
│   ├── components/
│   │   ├── Layout.tsx        Header + sidebar
│   │   └── ProtectedRoute.tsx
│   └── pages/
│       ├── Login.tsx
│       ├── Register.tsx
│       ├── Dashboard.tsx     Task list + filter
│       ├── CreateTask.tsx
│       ├── EditTask.tsx
│       └── Categories.tsx
├── tailwind.config.js
└── vite.config.ts
```

## Color Palette (sesuai mockup di laporan)

- `primary` — `#F47B3F` (oranye, untuk title & accent)
- `secondary` — `#7FB6CC` (biru muda, untuk button & border)
- `cream` — `#FAF3E0` (background)

Pakai class Tailwind: `bg-primary`, `text-secondary`, `border-cream`, dst.
