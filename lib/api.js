import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Safety net: ensure all API requests are prefixed with /api
API.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith('/api/')) {
    config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
  }
  return config;
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('finflow-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('finflow-token');
      localStorage.removeItem('finflow-user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// Transactions API
export const transactionAPI = {
  getAll: () => API.get('/transactions'),
  getStats: () => API.get('/transactions/stats'),
  create: (data) => API.post('/transactions', data),
  update: (id, data) => API.put(`/transactions/${id}`, data),
  delete: (id) => API.delete(`/transactions/${id}`),
};

// Users API (admin only)
export const userAPI = {
  getAll: () => API.get('/users'),
  updateRole: (id, role) => API.patch(`/users/${id}/role`, { role }),
  delete: (id) => API.delete(`/users/${id}`),
};

export default API;
