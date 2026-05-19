const CartModel = require('../models/Cart');
const BookModel = require('../models/Book');
const ApiError = require('../utils/ApiError');

const CartService = {
  async getCart(userId) {
    const cart = await CartModel.findOrCreateByUserId(userId);
    const items = await CartModel.getCartItems(cart.id);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { cartId: cart.id, items, total: parseFloat(total.toFixed(2)) };
  },

  async addItem(userId, { bookId, quantity }) {
    const book = await BookModel.findById(bookId);
    if (!book) throw ApiError.notFound('Book not found');
    if (book.stock < quantity) throw ApiError.badRequest('Insufficient stock');

    const cart = await CartModel.findOrCreateByUserId(userId);
    const existingItem = await CartModel.findCartItem(cart.id, bookId);

    if (existingItem && existingItem.quantity + quantity > book.stock) {
      throw ApiError.badRequest('Quantity exceeds available stock');
    }

    await CartModel.addItem(cart.id, bookId, quantity);
    return CartService.getCart(userId);
  },

  async updateItem(userId, itemId, { quantity }) {
    const cart = await CartModel.findOrCreateByUserId(userId);
    const items = await CartModel.getCartItems(cart.id);
    const item = items.find((i) => i.id === parseInt(itemId));

    if (!item) throw ApiError.notFound('Cart item not found');

    const book = await BookModel.findById(item.book_id);
    if (quantity > book.stock) throw ApiError.badRequest('Quantity exceeds available stock');

    await CartModel.updateItemQuantity(itemId, quantity);
    return CartService.getCart(userId);
  },

  async removeItem(userId, itemId) {
    const cart = await CartModel.findOrCreateByUserId(userId);
    const items = await CartModel.getCartItems(cart.id);
    const item = items.find((i) => i.id === parseInt(itemId));

    if (!item) throw ApiError.notFound('Cart item not found');

    await CartModel.removeItem(itemId);
    return CartService.getCart(userId);
  },

  async clearCart(userId) {
    const cart = await CartModel.findOrCreateByUserId(userId);
    await CartModel.clearCart(cart.id);
  },
};

module.exports = CartService;
