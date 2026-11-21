import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem('watchhub-auth')) {
      setAuthLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => {
        sessionStorage.removeItem('watchhub-auth');
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    const { data } = await api.get(`/cart/${encodeURIComponent(user.email)}`);
    setCartCount(data.reduce((total, item) => total + item.quantity, 0));
  }, [user]);

  useEffect(() => {
    if (user) refreshCart().catch(() => setCartCount(0));
    else setCartCount(0);
  }, [user, refreshCart]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    sessionStorage.setItem('watchhub-auth', JSON.stringify({ email: data.email, password }));
    setUser(data);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    await api.post('/auth/register', { name, email, password });
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('watchhub-auth');
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, cartCount, authLoading, login, register, logout, refreshCart }), [user, cartCount, authLoading, login, register, logout, refreshCart]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
