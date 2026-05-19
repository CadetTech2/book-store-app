const OrderService = require('../services/orderService');
const ApiResponse = require('../utils/ApiResponse');

const orderController = {
  async placeOrder(req, res, next) {
    try {
      const order = await OrderService.placeOrder(req.user.id, req.body);
      ApiResponse.created(res, order, 'Order placed successfully');
    } catch (err) {
      next(err);
    }
  },

  async getUserOrders(req, res, next) {
    try {
      const { orders, meta } = await OrderService.getUserOrders(req.user.id, req.query);
      ApiResponse.success(res, orders, 'Orders fetched', 200, meta);
    } catch (err) {
      next(err);
    }
  },

  async getOrderDetail(req, res, next) {
    try {
      const order = await OrderService.getOrderDetail(req.user.id, req.params.id);
      ApiResponse.success(res, order);
    } catch (err) {
      next(err);
    }
  },

  async getAllOrders(req, res, next) {
    try {
      const { orders, meta } = await OrderService.getAllOrders(req.query);
      ApiResponse.success(res, orders, 'Orders fetched', 200, meta);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const order = await OrderService.updateStatus(req.params.id, req.body.status);
      ApiResponse.success(res, order, 'Order status updated');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = orderController;
