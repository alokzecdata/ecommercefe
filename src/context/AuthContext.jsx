import React, { createContext, useState, useEffect } from 'react';
import { userService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await userService.login(credentials);
    // Assuming backend returns { token, user } or something similar
    if (data.token) {
      localStorage.setItem('token', data.token);
      await fetchProfile();
    }
    return data;
  };

  const signup = async (userData) => {
    const data = await userService.signup(userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      await fetchProfile();
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
