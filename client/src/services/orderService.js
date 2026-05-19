import api from '@/lib/axios';

export const orderService = {
  create: (data) => api.post('/orders', data),
  getUserOrders: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders/admin/all', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};
