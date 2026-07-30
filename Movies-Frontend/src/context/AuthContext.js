import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axiosConfig';

/**
 * AuthContext provides authentication state to every component.
 *
 * Instead of passing token/user as props through many components,
 * any component can call useAuth() to get the current user and
 * login/logout functions.
 *
 * Data is persisted in localStorage so the user stays logged in
 * after a page refresh.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore user from localStorage on page load
    const saved = localStorage.getItem('cinescope_user');
    return saved ? JSON.parse(saved) : null;
  });

  // ─── Login ──────────────────────────────────────────────────────────────

  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, name, email: userEmail } = response.data;

    // Save token and user info to localStorage
    localStorage.setItem('cinescope_token', token);
    localStorage.setItem('cinescope_user', JSON.stringify({ name, email: userEmail }));
    setUser({ name, email: userEmail });

    return response.data;
  }, []);

  // ─── Register ────────────────────────────────────────────────────────────

  const register = useCallback(async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token, email: userEmail } = response.data;

    localStorage.setItem('cinescope_token', token);
    localStorage.setItem('cinescope_user', JSON.stringify({ name, email: userEmail }));
    setUser({ name, email: userEmail });

    return response.data;
  }, []);

  // ─── Logout ──────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    localStorage.removeItem('cinescope_token');
    localStorage.removeItem('cinescope_user');
    setUser(null);
  }, []);

  // ─── Check if logged in ──────────────────────────────────────────────────

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — components call useAuth() to access auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};