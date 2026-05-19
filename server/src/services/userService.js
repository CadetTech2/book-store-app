const UserModel = require('../models/User');
const ApiError = require('../utils/ApiError');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const UserService = {
  async getAll(query) {
    const { page, limit, offset } = getPagination(query);
    const { rows, total } = await UserModel.findAll({ limit, offset });
    const meta = getPaginationMeta(page, limit, total);
    return { users: rows, meta };
  },

  async getById(id) {
    const user = await UserModel.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async updateRole(id, role) {
    const user = await UserModel.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    await UserModel.updateRole(id, role);
    return UserModel.findById(id);
  },

  async delete(id) {
    const user = await UserModel.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    await UserModel.delete(id);
  },
};

module.exports = UserService;
