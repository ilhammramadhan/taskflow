import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export function Register() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post('/auth/register', { nama, email, password });
      navigate('/login');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <input
          type="text"
          required
          placeholder="Username / Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full border-2 border-secondary rounded px-3 py-2"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-secondary rounded px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6 karakter)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-secondary rounded px-3 py-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-secondary text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Register'}
        </button>
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
