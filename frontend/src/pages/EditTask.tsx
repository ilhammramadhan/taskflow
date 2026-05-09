import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';

interface Category {
  id: number;
  namaCategory: string;
}

export function EditTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get(`/tasks/${id}`)]).then(([cat, task]) => {
      setCategories(cat.data.data);
      const t = task.data.data;
      setJudul(t.judul);
      setDeskripsi(t.deskripsi || '');
      setCategoryId(t.categoryId ? String(t.categoryId) : '');
      if (t.deadline) {
        setHasDeadline(true);
        setDeadline(new Date(t.deadline).toISOString().slice(0, 10));
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.put(`/tasks/${id}`, {
        judul,
        deskripsi: deskripsi || undefined,
        categoryId: categoryId ? Number(categoryId) : null,
        deadline: hasDeadline && deadline ? new Date(deadline).toISOString() : null,
      });
      navigate('/');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Gagal update task');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold text-primary mb-4">Edit Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <label className="block">
          <span className="text-sm">Title</span>
          <input
            type="text"
            required
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm">Description</span>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            rows={4}
          />
        </label>
        <label className="block">
          <span className="text-sm">Category</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value="">— pilih kategori (opsional) —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.namaCategory}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasDeadline}
            onChange={(e) => setHasDeadline(e.target.checked)}
          />
          <span className="text-sm">Pakai deadline</span>
        </label>
        {hasDeadline && (
          <label className="block">
            <span className="text-sm">Date</span>
            <input
              type="date"
              required={hasDeadline}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </label>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-secondary text-white px-4 py-2 rounded font-semibold">
          Update
        </button>
      </form>
    </div>
  );
}
