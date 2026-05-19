import api from '@/lib/axios';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
};
