const BookModel = require('../models/Book');
const ApiError = require('../utils/ApiError');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const BookService = {
  async getAll(query) {
    const { page, limit, offset } = getPagination(query);
    const { rows, total } = await BookModel.findAll({
      limit,
      offset,
      search: query.search,
      category: query.category,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sort: query.sort || 'created_at',
      order: query.order || 'desc',
    });
    const meta = getPaginationMeta(page, limit, total);
    return { books: rows, meta };
  },

  async getById(id) {
    const book = await BookModel.findById(id);
    if (!book) throw ApiError.notFound('Book not found');
    return book;
  },

  async getFeatured() {
    return BookModel.findFeatured();
  },

  async create(data) {
    const id = await BookModel.create(data);
    return BookModel.findById(id);
  },

  async update(id, data) {
    const book = await BookModel.findById(id);
    if (!book) throw ApiError.notFound('Book not found');
    await BookModel.update(id, data);
    return BookModel.findById(id);
  },

  async delete(id) {
    const book = await BookModel.findById(id);
    if (!book) throw ApiError.notFound('Book not found');
    await BookModel.delete(id);
  },

  async uploadCover(id, filename) {
    const book = await BookModel.findById(id);
    if (!book) throw ApiError.notFound('Book not found');
    await BookModel.update(id, { cover_image: filename });
    return BookModel.findById(id);
  },
};

module.exports = BookService;
