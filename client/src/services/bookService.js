import api from '@/lib/axios';

export const bookService = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  getFeatured: () => api.get('/books/featured'),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  uploadImage: (id, formData) =>
    api.post(`/books/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
