import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, logout } from '../lib/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on page load
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await loginUser({ email, password });
      if (result.success) {
        const userData = await getCurrentUser();
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const result = await registerUser({ name, email, password });
      if (result.success) {
        const userData = await getCurrentUser();
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'superAdmin');
  };

  const isSuperAdmin = () => {
    return user && user.role === 'superAdmin';
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    isAdmin,
    isSuperAdmin,
    isAuthenticated,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
