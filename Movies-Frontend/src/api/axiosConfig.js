import axios from 'axios';

/**
 * Axios instance used for all API calls.
 *
 * baseURL comes from the .env file so the same code works
 * in development (localhost:8080) and production (Railway URL).
 *
 * The request interceptor automatically attaches the JWT token
 * from localStorage to every outgoing request.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if the user is logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinescope_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect to home
      localStorage.removeItem('cinescope_token');
      localStorage.removeItem('cinescope_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
