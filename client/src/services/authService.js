import api from './api';

export const authService = {
  login: async (email, password) => {
    return await api.post('/api/auth/login', { email, password });
  },

  register: async (userData) => {
    return await api.post('/api/auth/register', userData);
  },

  logout: () => {
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  }
};
