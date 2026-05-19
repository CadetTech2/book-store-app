const BookService = require('../services/bookService');
const ApiResponse = require('../utils/ApiResponse');

const bookController = {
  async getAll(req, res, next) {
    try {
      const { books, meta } = await BookService.getAll(req.query);
      ApiResponse.success(res, books, 'Books fetched', 200, meta);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const book = await BookService.getById(req.params.id);
      ApiResponse.success(res, book);
    } catch (err) {
      next(err);
    }
  },

  async getFeatured(req, res, next) {
    try {
      const books = await BookService.getFeatured();
      ApiResponse.success(res, books);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const book = await BookService.create(req.body);
      ApiResponse.created(res, book, 'Book created');
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const book = await BookService.update(req.params.id, req.body);
      ApiResponse.success(res, book, 'Book updated');
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await BookService.delete(req.params.id);
      ApiResponse.success(res, null, 'Book deleted');
    } catch (err) {
      next(err);
    }
  },

  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.success(res, null, 'No file uploaded', 400);
      }
      const book = await BookService.uploadCover(req.params.id, req.file.filename);
      ApiResponse.success(res, book, 'Cover image uploaded');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = bookController;
