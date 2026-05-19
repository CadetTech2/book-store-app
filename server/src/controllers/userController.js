const UserService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');

const userController = {
  async getAll(req, res, next) {
    try {
      const { users, meta } = await UserService.getAll(req.query);
      ApiResponse.success(res, users, 'Users fetched', 200, meta);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const user = await UserService.getById(req.params.id);
      ApiResponse.success(res, user);
    } catch (err) {
      next(err);
    }
  },

  async updateRole(req, res, next) {
    try {
      const user = await UserService.updateRole(req.params.id, req.body.role);
      ApiResponse.success(res, user, 'User role updated');
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await UserService.delete(req.params.id);
      ApiResponse.success(res, null, 'User deleted');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
