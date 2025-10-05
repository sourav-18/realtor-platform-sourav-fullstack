import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getProfile()
        .then(response => setUser(response.statusCode === 200 ? response.data : null))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const ownerLogin = async (email, password) => {
    const response = await authService.ownerLogin(email, password);
    setUser(response.statusCode === 200 ? response.data : null);
    return response;
  };

  const customerLogin = async (email, password) => {
    const response = await authService.customerLogin(email, password);
    setUser(response.statusCode === 200 ? response.data : null);
    return response;
  };

  const ownerRegister = async (userData) => {
    const response = await authService.ownerRegister(userData);
    setUser(response.statusCode === 200 ? response.data : null);
    return response;
  };


  const customerRegister = async (userData) => {
    const response = await authService.customerRegister(userData);
    setUser(response.statusCode === 200 ? response.data : null);
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    ownerRegister,
    ownerLogin,
    logout,
    customerRegister,
    customerLogin,
    loading,
    isAuthenticated: !!user,
    isOwner: user?.role === 'owner',
    isCustomer: user?.role === 'customer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};