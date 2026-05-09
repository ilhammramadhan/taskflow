# TaskFlow API Specification

API spec lengkap untuk tim Frontend. Semua endpoint sudah deployed dan ready dipakai.

> **Postman collection**: file `docs/postman_collection.json` di repo ini. Import ke Postman → langsung bisa test semua endpoint.

---

## Base URL

| Environment | URL |
|---|---|
| **Production** | `https://taskflow-e0yh.onrender.com/api` |
| Local dev | `http://localhost:4000/api` |

> ⚠️ Production di Render free tier — kalau tidak ada request 15 menit, service sleep. Request pertama setelah sleep delay 30-60 detik (cold start). Setelah itu normal.

---

## Authentication

Semua endpoint **kecuali** `/auth/register` dan `/auth/login` butuh JWT token di header:

```
Authorization: Bearer <token>
```

Token didapat dari response `/auth/login`. Token expired setelah **7 hari** — user harus login ulang setelah itu.

### Cara Pakai di Frontend (Axios)

Buat axios instance di `src/api/client.js`:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

// Auto-attach token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect ke login kalau token expired/invalid
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('taskflow_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
```

Lalu di component, panggil:
```js
import api from './api/client';

const res = await api.get('/tasks');
console.log(res.data);
```

### Setup di `frontend/.env`

```
VITE_API_URL=https://taskflow-e0yh.onrender.com/api
```

---

## Response Format

Semua endpoint pakai format konsisten:

**Success (single resource):**
```json
{ "data": { ... } }
```

**Success (list):**
```json
{ "data": [ { ... }, { ... } ] }
```

**Success (action only — register, logout, delete):**
```json
{ "message": "Login berhasil" }
```

**Error:**
```json
{ "message": "Email sudah terdaftar" }
```

**Validation Error (Zod):**
```json
{
  "message": "Validasi gagal",
  "errors": {
    "email": ["Format email tidak valid"],
    "password": ["Password minimal 6 karakter"]
  }
}
```

---

## Status Codes

| Code | Arti |
|---|---|
| `200` | Success (GET, PUT, PATCH, DELETE) |
| `201` | Created (POST) |
| `400` | Validation error (body tidak sesuai schema) |
| `401` | Unauthorized (token tidak ada/expired/invalid) |
| `404` | Resource tidak ditemukan |
| `409` | Conflict (email duplicate, kategori masih dipakai) |
| `500` | Server error (laporkan ke backend dev) |

---

# Endpoints

## 🔐 Auth

### POST `/auth/register`

**Auth:** ❌ Tidak perlu

**Request body:**
```json
{
  "nama": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Validation:**
- `nama`: string, min 1, max 100 char
- `email`: string, format email valid, harus unik
- `password`: string, min 6 char

**Success (201):**
```json
{
  "message": "Registrasi berhasil",
  "user": { "id": 1, "nama": "John Doe", "email": "john@example.com" }
}
```

**Errors:**
- `400` — validation gagal
- `409` — email sudah terdaftar

**Axios:**
```js
const handleRegister = async (form) => {
  try {
    await api.post('/auth/register', form);
    navigate('/login');
  } catch (err) {
    setError(err.response?.data?.message);
  }
};
```

---

### POST `/auth/login`

**Auth:** ❌ Tidak perlu

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success (200):**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "nama": "John Doe", "email": "john@example.com" }
}
```

> Setelah login berhasil, **simpan token dan user di localStorage**.

**Errors:**
- `401` — email atau password salah

**Axios:**
```js
const handleLogin = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('taskflow_token', res.data.token);
  localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
  navigate('/');
};
```

---

### POST `/auth/logout`

**Auth:** ❌ Tidak perlu (tapi biasanya dipanggil saat logout)

**Request body:** kosong

**Success (200):**
```json
{ "message": "Logout berhasil" }
```

> JWT itu stateless — backend tidak menyimpan session. Logout sebenarnya cuma client hapus token dari localStorage. Endpoint ini sebagai placeholder kalau mau extend ke server-side blacklist nanti.

**Axios:**
```js
const handleLogout = async () => {
  await api.post('/auth/logout'); // optional
  localStorage.removeItem('taskflow_token');
  localStorage.removeItem('taskflow_user');
  navigate('/login');
};
```

---

## 📝 Tasks

Semua endpoint butuh JWT. Task user A tidak bisa diakses user B (auto-filter by `userId` dari token).

### Task Object Shape

```ts
{
  id: number,
  judul: string,
  deskripsi: string | null,
  deadline: string | null,         // ISO date string, e.g. "2026-04-01T00:00:00.000Z"
  status: "BELUM" | "SELESAI",
  userId: number,
  categoryId: number | null,
  createdAt: string,                // ISO timestamp
  updatedAt: string,                // ISO timestamp
  category: {                       // object lengkap, atau null
    id: number,
    namaCategory: string,
    userId: number
  } | null
}
```

---

### GET `/tasks`

**Auth:** ✅

**Query params:**
| Param | Type | Default | Effect |
|---|---|---|---|
| `categoryId` | number | — | Filter tasks pada kategori tertentu |
| `deadline` | `with` \| `without` | — | `with` = task yang punya deadline; `without` = task tanpa deadline |

**Examples:**
```
GET /tasks                                  # semua task
GET /tasks?categoryId=2                     # task di kategori 2
GET /tasks?deadline=with                    # task yang ada deadline
GET /tasks?categoryId=2&deadline=without    # combo
```

**Success (200):**
```json
{
  "data": [
    {
      "id": 1,
      "judul": "Belajar Matematika",
      "deskripsi": "Review Bab 1-3",
      "deadline": null,
      "status": "BELUM",
      "userId": 1,
      "categoryId": 2,
      "createdAt": "2026-05-09T10:00:00.000Z",
      "updatedAt": "2026-05-09T10:00:00.000Z",
      "category": { "id": 2, "namaCategory": "School", "userId": 1 }
    }
  ]
}
```

**Axios:**
```js
const fetchTasks = async (filterCategory, filterDeadline) => {
  const params = {};
  if (filterCategory) params.categoryId = filterCategory;
  if (filterDeadline) params.deadline = filterDeadline; // "with" | "without"
  const res = await api.get('/tasks', { params });
  setTasks(res.data.data);
};
```

---

### POST `/tasks`

**Auth:** ✅

**Request body:**
```json
{
  "judul": "Tugas Melukis",
  "deskripsi": "Tugas seni lukis bab 4",
  "deadline": "2026-04-01T00:00:00.000Z",
  "categoryId": 2
}
```

**Validation:**
- `judul`: required, string, min 1, max 200
- `deskripsi`: optional, string
- `deadline`: optional, ISO 8601 datetime string atau `null`
- `categoryId`: optional, integer positif atau `null`

> Default `status` = `"BELUM"` (otomatis di backend).

**Success (201):**
```json
{ "data": { ... task object ... } }
```

**Errors:**
- `400` — validation gagal

**Axios:**
```js
const handleSubmit = async (form) => {
  await api.post('/tasks', {
    judul: form.title,
    deskripsi: form.description || undefined,
    deadline: form.hasDeadline ? new Date(form.date).toISOString() : null,
    categoryId: form.categoryId ? Number(form.categoryId) : null,
  });
  navigate('/');
};
```

---

### GET `/tasks/:id`

**Auth:** ✅

**Success (200):**
```json
{ "data": { ... task object ... } }
```

**Errors:**
- `404` — task tidak ditemukan (atau bukan punya user ini)

**Axios:**
```js
const res = await api.get(`/tasks/${id}`);
const task = res.data.data;
```

---

### PUT `/tasks/:id`

**Auth:** ✅

**Request body:** sama dengan POST `/tasks`

**Success (200):**
```json
{ "data": { ... updated task ... } }
```

**Errors:**
- `400` — validation gagal
- `404` — task tidak ditemukan

**Axios:**
```js
await api.put(`/tasks/${id}`, {
  judul, deskripsi, deadline, categoryId
});
```

---

### PATCH `/tasks/:id/toggle`

**Auth:** ✅

**Request body:** kosong

Toggle status: `BELUM` → `SELESAI` atau sebaliknya.

**Success (200):**
```json
{ "data": { ... task with status flipped ... } }
```

**Errors:**
- `404` — task tidak ditemukan

**Axios:**
```js
const handleToggle = async (id) => {
  await api.patch(`/tasks/${id}/toggle`);
  fetchTasks(); // refresh list
};
```

---

### DELETE `/tasks/:id`

**Auth:** ✅

**Success (200):**
```json
{ "message": "Task berhasil dihapus" }
```

**Errors:**
- `404` — task tidak ditemukan

**Axios:**
```js
const handleDelete = async (id) => {
  if (!confirm('Yakin mau hapus?')) return;
  await api.delete(`/tasks/${id}`);
  fetchTasks();
};
```

---

## 🏷️ Categories

Semua endpoint butuh JWT. Per-user (user A tidak lihat kategori user B).

### Category Object Shape

```ts
{
  id: number,
  namaCategory: string,
  userId: number
}
```

---

### GET `/categories`

**Auth:** ✅

**Success (200):**
```json
{
  "data": [
    { "id": 1, "namaCategory": "School", "userId": 1 },
    { "id": 2, "namaCategory": "Personal", "userId": 1 }
  ]
}
```

**Axios:**
```js
const res = await api.get('/categories');
setCategories(res.data.data);
```

---

### POST `/categories`

**Auth:** ✅

**Request body:**
```json
{ "namaCategory": "Work" }
```

**Validation:**
- `namaCategory`: required, string, min 1, max 100

**Success (201):**
```json
{ "data": { "id": 3, "namaCategory": "Work", "userId": 1 } }
```

**Errors:**
- `400` — validation gagal

**Axios:**
```js
await api.post('/categories', { namaCategory: 'Work' });
```

---

### DELETE `/categories/:id`

**Auth:** ✅

**Success (200):**
```json
{ "message": "Kategori berhasil dihapus" }
```

**Errors:**
- `404` — kategori tidak ditemukan
- `409` — kategori masih dipakai oleh task (lihat pesan: `"Kategori tidak dapat dihapus karena masih digunakan oleh task"`)

**Axios:**
```js
const handleDelete = async (id) => {
  try {
    await api.delete(`/categories/${id}`);
    fetchCategories();
  } catch (err) {
    if (err.response?.status === 409) {
      alert('Kategori masih dipakai task — hapus task-nya dulu');
    }
  }
};
```

---

## Quick Reference

| Method | Path | Auth | Action |
|---|---|---|---|
| POST | `/auth/register` | — | Daftar user baru |
| POST | `/auth/login` | — | Login, dapat JWT |
| POST | `/auth/logout` | — | Logout (placeholder) |
| GET | `/tasks` | ✅ | List task (filter via query) |
| POST | `/tasks` | ✅ | Create task |
| GET | `/tasks/:id` | ✅ | Detail task |
| PUT | `/tasks/:id` | ✅ | Update task |
| PATCH | `/tasks/:id/toggle` | ✅ | Toggle BELUM ↔ SELESAI |
| DELETE | `/tasks/:id` | ✅ | Hapus task |
| GET | `/categories` | ✅ | List kategori |
| POST | `/categories` | ✅ | Create kategori |
| DELETE | `/categories/:id` | ✅ | Hapus kategori (gagal kalau dipakai) |

---

## Common Error Cases & Cara Handle

```js
try {
  const res = await api.post('/tasks', form);
  // success
} catch (err) {
  const status = err.response?.status;
  const message = err.response?.data?.message;
  const errors = err.response?.data?.errors;

  if (status === 400) {
    // Validation error — show field-level errors
    setFieldErrors(errors); // { judul: ["..."], deadline: ["..."] }
  } else if (status === 401) {
    // Token expired/invalid — interceptor akan auto-redirect ke /login
  } else if (status === 404) {
    alert('Task tidak ditemukan');
  } else if (status === 409) {
    alert(message); // pesan dari backend, e.g. "Email sudah terdaftar"
  } else {
    alert('Terjadi kesalahan, coba lagi');
  }
}
```

---

## Catatan

- Semua field nama Indonesia (`judul`, `deskripsi`, `nama`, `namaCategory`) sesuai ERD di laporan proyek
- Status enum: `BELUM` dan `SELESAI` (uppercase) — pakai persis ini di filter UI
- Deadline format: ISO 8601 string (misal `"2026-04-01T00:00:00.000Z"`), atau `null` untuk task tanpa deadline
- Tanggal di-convert ke ISO sebelum kirim: `new Date(form.dateInput).toISOString()`
- Jangan kirim `userId` di request body — backend ambil dari JWT token

Untuk pertanyaan atau bug, kontak BE owner di group chat.
