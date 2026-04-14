'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('finflow-token');
        if (token) {
          const res = await authAPI.getMe();
          setUser(res.data);
        }
      } catch (error) {
        localStorage.removeItem('finflow-token');
        localStorage.removeItem('finflow-user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('finflow-token', token);
    localStorage.setItem('finflow-user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('finflow-token');
    localStorage.removeItem('finflow-user');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  const value = {
    user,
    loading,
    isAdmin,
    isUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
