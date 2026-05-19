const pool = require('../config/db');

const CartModel = {
  async findOrCreateByUserId(userId) {
    let [rows] = await pool.execute('SELECT * FROM carts WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      const [result] = await pool.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      return { id: result.insertId, user_id: userId };
    }
    return rows[0];
  },

  async getCartItems(cartId) {
    const [rows] = await pool.execute(
      `SELECT ci.id, ci.quantity, ci.book_id,
              b.title, b.author, b.price, b.cover_image, b.stock
       FROM cart_items ci
       JOIN books b ON ci.book_id = b.id
       WHERE ci.cart_id = ?
       ORDER BY ci.created_at DESC`,
      [cartId]
    );
    return rows;
  },

  async findCartItem(cartId, bookId) {
    const [rows] = await pool.execute(
      'SELECT * FROM cart_items WHERE cart_id = ? AND book_id = ?',
      [cartId, bookId]
    );
    return rows[0] || null;
  },

  async addItem(cartId, bookId, quantity) {
    await pool.execute(
      `INSERT INTO cart_items (cart_id, book_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [cartId, bookId, quantity, quantity]
    );
  },

  async updateItemQuantity(itemId, quantity) {
    await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
  },

  async removeItem(itemId) {
    await pool.execute('DELETE FROM cart_items WHERE id = ?', [itemId]);
  },

  async clearCart(cartId) {
    await pool.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  },
};

module.exports = CartModel;
