import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

interface Task {
  id: number;
  judul: string;
  deskripsi: string | null;
  deadline: string | null;
  status: 'BELUM' | 'SELESAI';
  category: { id: number; namaCategory: string } | null;
}

interface Category {
  id: number;
  namaCategory: string;
}

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDeadline, setFilterDeadline] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filterCategory) params.categoryId = filterCategory;
    if (filterDeadline) params.deadline = filterDeadline;
    const res = await api.get('/tasks', { params });
    setTasks(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterDeadline]);

  const toggleStatus = async (id: number) => {
    await api.patch(`/tasks/${id}/toggle`);
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Yakin mau hapus task ini?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-primary mb-4">Task List</h1>

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <span className="text-sm">Category</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.namaCategory}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm">Deadline</span>
          <select
            value={filterDeadline}
            onChange={(e) => setFilterDeadline(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="with">Ada deadline</option>
            <option value="without">Tanpa deadline</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">Belum ada task. Klik "Create Task" untuk mulai.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-white border-2 border-secondary rounded p-3 flex items-center gap-3"
            >
              <input
                type="checkbox"
                checked={task.status === 'SELESAI'}
                onChange={() => toggleStatus(task.id)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className={`font-semibold text-primary ${task.status === 'SELESAI' ? 'line-through' : ''}`}>
                  {task.judul}
                </p>
                <p className="text-xs text-gray-600">
                  Category: {task.category?.namaCategory ?? '-'} | Deadline:{' '}
                  {task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>
              <Link
                to={`/tasks/${task.id}/edit`}
                className="text-sm text-secondary hover:underline"
                title="Edit"
              >
                ✎
              </Link>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-sm text-red-600 hover:underline"
                title="Hapus"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
