const CategoryService = require('../services/categoryService');
const ApiResponse = require('../utils/ApiResponse');

const categoryController = {
  async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAll();
      ApiResponse.success(res, categories);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const category = await CategoryService.create(req.body);
      ApiResponse.created(res, category, 'Category created');
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const category = await CategoryService.update(req.params.id, req.body);
      ApiResponse.success(res, category, 'Category updated');
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await CategoryService.delete(req.params.id);
      ApiResponse.success(res, null, 'Category deleted');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = categoryController;
