const OrderModel = require('../models/Order');
const CartModel = require('../models/Cart');
const BookModel = require('../models/Book');
const ApiError = require('../utils/ApiError');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const OrderService = {
  async placeOrder(userId, { shippingAddress, paymentMethod }) {
    const cart = await CartModel.findOrCreateByUserId(userId);
    const items = await CartModel.getCartItems(cart.id);

    if (items.length === 0) {
      throw ApiError.badRequest('Cart is empty');
    }

    for (const item of items) {
      if (item.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for "${item.title}"`);
      }
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderId = await OrderModel.create({
      userId,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      shippingAddress,
      paymentMethod,
    });

    const orderItems = items.map((item) => ({
      book_id: item.book_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderModel.createItems(orderId, orderItems);

    for (const item of items) {
      await BookModel.updateStock(item.book_id, item.quantity);
    }

    await CartModel.clearCart(cart.id);

    const order = await OrderModel.findById(orderId);
    const orderItemDetails = await OrderModel.findOrderItems(orderId);

    return { ...order, items: orderItemDetails };
  },

  async getUserOrders(userId, query) {
    const { page, limit, offset } = getPagination(query);
    const { rows, total } = await OrderModel.findByUserId(userId, { limit, offset });
    const meta = getPaginationMeta(page, limit, total);
    return { orders: rows, meta };
  },

  async getOrderDetail(userId, orderId, isAdmin = false) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');

    if (!isAdmin && order.user_id !== userId) {
      throw ApiError.forbidden('Access denied');
    }

    const items = await OrderModel.findOrderItems(orderId);
    return { ...order, items };
  },

  async getAllOrders(query) {
    const { page, limit, offset } = getPagination(query);
    const { rows, total } = await OrderModel.findAll({
      limit,
      offset,
      status: query.status,
    });
    const meta = getPaginationMeta(page, limit, total);
    return { orders: rows, meta };
  },

  async updateStatus(orderId, status) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found');
    await OrderModel.updateStatus(orderId, status);
    return OrderModel.findById(orderId);
  },
};

module.exports = OrderService;
