import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const requestInterceptorRef = useRef(null);

// Az url a backend regisztrációs és bejelentkezési végpontjára mutat
  const API_BASE = 'https://localhost:7133/api/Registry';

  useEffect(() => {
    if (requestInterceptorRef.current) {
      axios.interceptors.request.eject(requestInterceptorRef.current);
    }

    requestInterceptorRef.current = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      if (requestInterceptorRef.current) {
        axios.interceptors.request.eject(requestInterceptorRef.current);
      }
    };
  }, [token]);

  const login = async (username, password) => {
    try {
      const { data } = await axios.post(`${API_BASE}/login`, { username, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Hibás felhasználónév/jelszó!' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE}/register`, { 
        username, 
        email, 
        password 
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Regisztrációs hiba!' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}