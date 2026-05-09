import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded ${isActive ? 'bg-primary text-white font-semibold' : 'hover:bg-gray-100'}`;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <Link to="/" className="text-2xl font-bold text-primary">
          TaskFlow
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hello, {user?.nama || 'User'}!</span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded bg-secondary text-white hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-56 bg-secondary/20 p-4 border-r">
          <nav className="space-y-1">
            <NavLink to="/" end className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks/new" className={navClass}>
              Create Task
            </NavLink>
            <NavLink to="/categories" className={navClass}>
              Category
            </NavLink>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
