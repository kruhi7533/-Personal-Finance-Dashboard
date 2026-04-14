import axios from 'axios';

const API = axios.create();

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
  register: (data) => API.post('/api/auth/register', data),
  login: (data) => API.post('/api/auth/login', data),
  getMe: () => API.get('/api/auth/me'),
};

// Transactions API
export const transactionAPI = {
  getAll: () => API.get('/api/transactions'),
  getStats: () => API.get('/api/transactions/stats'),
  create: (data) => API.post('/api/transactions', data),
  update: (id, data) => API.put(`/api/transactions/${id}`, data),
  delete: (id) => API.delete(`/api/transactions/${id}`),
};

// Users API (admin only)
export const userAPI = {
  getAll: () => API.get('/api/users'),
  updateRole: (id, role) => API.patch(`/api/users/${id}/role`, { role }),
  delete: (id) => API.delete(`/api/users/${id}`),
};

export default API;
