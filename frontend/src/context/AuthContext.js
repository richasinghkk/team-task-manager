import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.log('localStorage error:', e);
    }
    setUser(userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
    } catch (e) {
      console.log('localStorage error:', e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);