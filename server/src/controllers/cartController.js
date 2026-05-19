const CartService = require('../services/cartService');
const ApiResponse = require('../utils/ApiResponse');

const cartController = {
  async getCart(req, res, next) {
    try {
      const cart = await CartService.getCart(req.user.id);
      ApiResponse.success(res, cart);
    } catch (err) {
      next(err);
    }
  },

  async addItem(req, res, next) {
    try {
      const cart = await CartService.addItem(req.user.id, req.body);
      ApiResponse.success(res, cart, 'Item added to cart');
    } catch (err) {
      next(err);
    }
  },

  async updateItem(req, res, next) {
    try {
      const cart = await CartService.updateItem(req.user.id, req.params.id, req.body);
      ApiResponse.success(res, cart, 'Cart updated');
    } catch (err) {
      next(err);
    }
  },

  async removeItem(req, res, next) {
    try {
      const cart = await CartService.removeItem(req.user.id, req.params.id);
      ApiResponse.success(res, cart, 'Item removed from cart');
    } catch (err) {
      next(err);
    }
  },

  async clearCart(req, res, next) {
    try {
      await CartService.clearCart(req.user.id);
      ApiResponse.success(res, null, 'Cart cleared');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = cartController;
