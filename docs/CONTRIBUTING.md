# Contributing Guide — TaskFlow

Panduan kerja sama untuk Tim Kelompok 1.

## Sebelum Mulai

1. Pastikan sudah `git pull origin main` untuk dapat versi terbaru.
2. Buat branch baru dari `main` (jangan kerja langsung di `main`).
3. Diskusi dulu di grup chat kalau mau ngerjain fitur yang besar — biar ga overlap dengan anggota lain.

## Branch Naming

Lihat detail di [`BRANCHING.md`](./BRANCHING.md). Format singkat:

```
feat/login-page
fix/task-delete-confirmation
docs/update-readme
refactor/auth-middleware
```

## Commit Message — Conventional Commits

Format: `<type>(<scope>): <description>`

| Type | Kapan dipakai |
|---|---|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `docs` | Update dokumentasi saja |
| `style` | Format/whitespace, tidak ubah logic |
| `refactor` | Restruktur code, tidak ubah behavior |
| `test` | Tambah/edit test |
| `chore` | Build, config, dependency update |

**Contoh bagus:**
```
feat(auth): add JWT login endpoint
fix(task): handle empty deadline correctly
docs(readme): add Neon DB setup instructions
```

**Contoh jelek (jangan):**
```
update                  ← terlalu vague
fix bug                 ← bug apa?
WIP                     ← squash dulu sebelum push
```

## Pull Request Rules

1. **Satu PR = satu fitur/bug.** Jangan campur banyak hal.
2. Title PR ikuti format Conventional Commits.
3. Description PR wajib isi (template otomatis muncul):
   - Apa yang diubah
   - Kenapa diubah
   - Cara test-nya
   - Screenshot (kalau perubahan UI)
4. Minimal **1 reviewer approve** sebelum merge.
5. Pastikan tidak ada conflict dengan `main` sebelum minta review.

## Code Style

- Indent 2 spaces, LF line endings (sudah diatur di `.editorconfig`).
- TypeScript strict mode aktif di FE & BE.
- Nama variabel/fungsi pakai `camelCase`, komponen React pakai `PascalCase`.
- Hindari `any` — pakai tipe yang spesifik.

## Yang Wajib Dicek Sebelum Push

- [ ] Code jalan tanpa error (`npm run dev`)
- [ ] TypeScript ga ada error (`npm run build` atau `tsc --noEmit`)
- [ ] Tidak commit file `.env` atau credential
- [ ] Tidak ada `console.log` debugging yang lupa dihapus
- [ ] Branch sudah up-to-date dengan `main`

## Pembagian Tugas (Saran)

| Anggota | Fokus utama |
|---|---|
| Frontend Lead | Komponen React, halaman, styling Tailwind |
| Backend Lead | Express routes, Prisma schema, middleware |
| Auth Owner | Register, Login, Logout, JWT handling |
| Database Owner | ERD, migration, seed data |
| QA / Testing | Postman collection, UAT, bug report |

> Boleh tukar peran sesuai kesepakatan tim. Yang penting setiap orang tau ownership-nya.
