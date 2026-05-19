const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const SALT_ROUNDS = 12;

const AuthService = {
  async register({ name, email, password }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw ApiError.conflict('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = await UserModel.create({ name, email, password: hashedPassword });
    const user = await UserModel.findById(userId);
    const token = AuthService.generateToken(user);

    return { user, token };
  },

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = AuthService.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async updateProfile(userId, data) {
    if (data.email) {
      const existing = await UserModel.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw ApiError.conflict('Email is already in use');
      }
    }

    await UserModel.update(userId, data);
    return UserModel.findById(userId);
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await UserModel.findByEmail(
      (await UserModel.findById(userId)).email
    );

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await UserModel.updatePassword(userId, hashedPassword);
  },

  generateToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );
  },
};

module.exports = AuthService;
