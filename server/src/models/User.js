const pool = require('../config/db');

const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, password }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result.insertId;
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    await pool.execute(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
  },

  async updatePassword(id, hashedPassword) {
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  },

  async findAll({ limit, offset }) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [String(limit), String(offset)]
    );
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM users');
    return { rows, total };
  },

  async updateRole(id, role) {
    await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
  },

  async delete(id) {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  },

  async count() {
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM users');
    return total;
  },
};

module.exports = UserModel;
