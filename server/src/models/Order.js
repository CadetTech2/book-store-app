const pool = require('../config/db');

const OrderModel = {
  async create({ userId, totalAmount, shippingAddress, paymentMethod }) {
    const [result] = await pool.execute(
      'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
      [userId, totalAmount, shippingAddress, paymentMethod]
    );
    return result.insertId;
  },

  async createItems(orderId, items) {
    const values = items.map((item) =>
      `(${pool.escape(orderId)}, ${pool.escape(item.book_id)}, ${pool.escape(item.quantity)}, ${pool.escape(item.price)})`
    ).join(', ');

    await pool.query(
      `INSERT INTO order_items (order_id, book_id, quantity, price_at_purchase) VALUES ${values}`
    );
  },

  async findByUserId(userId, { limit, offset }) {
    const [rows] = await pool.execute(
      `SELECT o.*, COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, String(limit), String(offset)]
    );
    const [[{ total }]] = await pool.execute(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [userId]
    );
    return { rows, total };
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findOrderItems(orderId) {
    const [rows] = await pool.execute(
      `SELECT oi.*, b.title, b.author, b.cover_image
       FROM order_items oi
       JOIN books b ON oi.book_id = b.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  },

  async findAll({ limit, offset, status }) {
    let query = `SELECT o.*, u.name as user_name, u.email as user_email, COUNT(oi.id) as item_count
                 FROM orders o
                 JOIN users u ON o.user_id = u.id
                 LEFT JOIN order_items oi ON o.id = oi.order_id`;
    let countQuery = 'SELECT COUNT(*) as total FROM orders o';
    const params = [];
    const countParams = [];

    if (status) {
      query += ' WHERE o.status = ?';
      countQuery += ' WHERE o.status = ?';
      params.push(status);
      countParams.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(String(limit), String(offset));

    const [rows] = await pool.execute(query, params);
    const [[{ total }]] = await pool.execute(countQuery, countParams);
    return { rows, total };
  },

  async updateStatus(id, status) {
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  },

  async getRevenueTotal() {
    const [[{ total }]] = await pool.execute(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != 'cancelled'"
    );
    return parseFloat(total);
  },

  async count() {
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM orders');
    return total;
  },

  async getRecent(limit = 10) {
    const [rows] = await pool.execute(
      `SELECT o.*, u.name as user_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT ?`,
      [String(limit)]
    );
    return rows;
  },
};

module.exports = OrderModel;
