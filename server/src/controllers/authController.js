const AuthService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');

const authController = {
  async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      ApiResponse.created(res, result, 'Registration successful');
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      ApiResponse.success(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      ApiResponse.success(res, user);
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const user = await AuthService.updateProfile(req.user.id, req.body);
      ApiResponse.success(res, user, 'Profile updated');
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req, res, next) {
    try {
      await AuthService.changePassword(req.user.id, req.body);
      ApiResponse.success(res, null, 'Password changed successfully');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
