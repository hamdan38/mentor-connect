import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use(cfg => {
  try {
    const u = JSON.parse(localStorage.getItem('mcUser') || 'null');
    if (u?.token) cfg.headers.Authorization = `Bearer ${u.token}`;
  } catch(e) {}
  return cfg;
});

export { API };

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('mcUser') || 'null');
      if (u) setUser(u);
    } catch(e) { localStorage.removeItem('mcUser'); }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('mcUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (form) => {
    const { data } = await API.post('/auth/register', form);
    localStorage.setItem('mcUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mcUser');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
