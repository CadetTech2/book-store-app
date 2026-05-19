const pool = require('../config/db');

const BookModel = {
  async findAll({ limit, offset, search, category, minPrice, maxPrice, sort, order }) {
    let query = 'SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id';
    let countQuery = 'SELECT COUNT(*) as total FROM books b';
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      conditions.push('b.category_id = ?');
      params.push(String(category));
    }

    if (minPrice !== undefined) {
      conditions.push('b.price >= ?');
      params.push(String(minPrice));
    }

    if (maxPrice !== undefined) {
      conditions.push('b.price <= ?');
      params.push(String(maxPrice));
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    const allowedSorts = ['title', 'price', 'created_at', 'published_year'];
    const sortColumn = allowedSorts.includes(sort) ? `b.${sort}` : 'b.created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;

    const countParams = [...params];
    params.push(String(limit), String(offset));

    const [rows] = await pool.execute(query, params);
    const [[{ total }]] = await pool.execute(countQuery, countParams);

    return { rows, total };
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE b.id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findFeatured() {
    const [rows] = await pool.execute(
      'SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE b.is_featured = TRUE ORDER BY b.created_at DESC LIMIT 8'
    );
    return rows;
  },

  async create(data) {
    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(data);
    const [result] = await pool.execute(
      `INSERT INTO books (${fields.join(', ')}) VALUES (${placeholders})`,
      values.map(String)
    );
    return result.insertId;
  },

  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    await pool.execute(`UPDATE books SET ${setClause} WHERE id = ?`, [...values.map(String), id]);
  },

  async delete(id) {
    await pool.execute('DELETE FROM books WHERE id = ?', [id]);
  },

  async updateStock(id, quantity) {
    await pool.execute('UPDATE books SET stock = stock - ? WHERE id = ? AND stock >= ?', [
      String(quantity), id, String(quantity),
    ]);
  },

  async count() {
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM books');
    return total;
  },
};

module.exports = BookModel;
