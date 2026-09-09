import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('bloodsos_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      setUser(res.data.data.user);
    } catch {
      localStorage.removeItem('bloodsos_token');
      localStorage.removeItem('bloodsos_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = (userData, token) => {
    localStorage.setItem('bloodsos_token', token);
    localStorage.setItem('bloodsos_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try { await authService.logout(); } catch {}
    localStorage.removeItem('bloodsos_token');
    localStorage.removeItem('bloodsos_user');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const isAdmin = user?.role === 'ADMIN';
  const isDonor = user?.role === 'DONOR' || user?.role === 'BOTH';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAdmin, isDonor, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
