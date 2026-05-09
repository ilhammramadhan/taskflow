import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: number;
  nama: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('taskflow_token');
    const u = localStorage.getItem('taskflow_user');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('taskflow_token', newToken);
    localStorage.setItem('taskflow_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
