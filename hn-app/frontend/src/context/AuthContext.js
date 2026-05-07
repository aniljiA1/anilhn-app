import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('hn_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
    } catch {
      localStorage.removeItem('hn_token');
      localStorage.removeItem('hn_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('hn_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('hn_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('hn_token');
    localStorage.removeItem('hn_user');
    setUser(null);
  };

  const updateBookmarks = (bookmarks) => {
    setUser((prev) => ({ ...prev, bookmarks }));
  };

  const isBookmarked = (storyId) => {
    return user?.bookmarks?.some((id) => id === storyId || id?._id === storyId || id?.toString() === storyId);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateBookmarks, isBookmarked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
