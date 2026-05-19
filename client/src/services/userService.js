import api from '@/lib/axios';

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/me/password', data),
};
