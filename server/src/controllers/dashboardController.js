const DashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/ApiResponse');

const dashboardController = {
  async getStats(req, res, next) {
    try {
      const stats = await DashboardService.getStats();
      ApiResponse.success(res, stats);
    } catch (err) {
      next(err);
    }
  },

  async getRecentOrders(req, res, next) {
    try {
      const orders = await DashboardService.getRecentOrders();
      ApiResponse.success(res, orders);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = dashboardController;
