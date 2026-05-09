# Branching Strategy

Kita pakai **GitHub Flow** yang sederhana — cocok untuk tim kecil & sprint pendek.

## Branch Utama

- **`main`** — branch produksi. Selalu deployable. **Dilarang push langsung.**

## Branch Kerja

Buat branch dari `main` setiap mau kerja sesuatu:

```bash
git checkout main
git pull origin main
git checkout -b feat/nama-fitur
```

### Format Penamaan

```
<type>/<deskripsi-singkat-pakai-dash>
```

| Prefix | Untuk |
|---|---|
| `feat/` | Fitur baru |
| `fix/` | Bug fix |
| `docs/` | Dokumentasi |
| `refactor/` | Restruktur code |
| `chore/` | Setup, config, dependency |

**Contoh:**
```
feat/register-page
feat/task-crud-api
fix/login-redirect
docs/api-spec
chore/setup-prisma
```

## Workflow Standard

```
1. git pull origin main
2. git checkout -b feat/login-page
3. (kerja, commit beberapa kali)
4. git push -u origin feat/login-page
5. Buka Pull Request di GitHub → main
6. Tunggu review & approval
7. Merge via GitHub UI (Squash & Merge)
8. Branch otomatis dihapus → checkout main → pull
```

## Aturan Penting

- **Jangan rebase branch yang sudah di-push & dipakai orang lain.** Pakai `merge` saja.
- **Selesaikan conflict di branch sendiri**, jangan di `main`.
- Branch lama yang sudah di-merge → boleh dihapus (`git branch -d <nama>`).

## Sinkronisasi dengan main (saat branch panjang)

Kalau branch sudah lama dan `main` udah jauh maju, sync dulu:

```bash
git checkout main
git pull origin main
git checkout feat/branch-saya
git merge main
# resolve conflict kalau ada
git push
```
