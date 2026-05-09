import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';

interface Category {
  id: number;
  namaCategory: string;
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nama, setNama] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/categories', { namaCategory: nama });
      setNama('');
      fetchCategories();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Gagal menambah kategori');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin mau hapus kategori ini?')) return;
    setError(null);
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Gagal hapus kategori');
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-primary mb-4">Category</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          required
          placeholder="Category Name"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-secondary text-white px-4 py-2 rounded font-semibold">
          Add
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="bg-white border rounded p-3 flex items-center justify-between"
          >
            <span>{c.namaCategory}</span>
            <button onClick={() => handleDelete(c.id)} className="text-red-600">
              🗑
            </button>
          </li>
        ))}
      </ul>

      <p className="text-xs text-red-500 mt-3">
        *Kategori tidak dapat dihapus jika masih dipakai oleh task.
      </p>
    </div>
  );
}
