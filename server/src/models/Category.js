const pool = require('../config/db');

const CategoryModel = {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findBySlug(slug) {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  async create({ name, slug }) {
    const [result] = await pool.execute(
      'INSERT INTO categories (name, slug) VALUES (?, ?)',
      [name, slug]
    );
    return result.insertId;
  },

  async update(id, { name, slug }) {
    await pool.execute('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
  },

  async delete(id) {
    await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
  },
};

module.exports = CategoryModel;
