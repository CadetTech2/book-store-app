const UserModel = require('../models/User');
const BookModel = require('../models/Book');
const OrderModel = require('../models/Order');

const DashboardService = {
  async getStats() {
    const [totalUsers, totalBooks, totalOrders, totalRevenue] = await Promise.all([
      UserModel.count(),
      BookModel.count(),
      OrderModel.count(),
      OrderModel.getRevenueTotal(),
    ]);

    return { totalUsers, totalBooks, totalOrders, totalRevenue };
  },

  async getRecentOrders() {
    return OrderModel.getRecent(10);
  },
};

module.exports = DashboardService;
