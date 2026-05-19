const CategoryModel = require('../models/Category');
const ApiError = require('../utils/ApiError');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

const CategoryService = {
  async getAll() {
    return CategoryModel.findAll();
  },

  async create({ name }) {
    const slug = slugify(name);
    const existing = await CategoryModel.findBySlug(slug);
    if (existing) throw ApiError.conflict('Category already exists');
    const id = await CategoryModel.create({ name, slug });
    return CategoryModel.findById(id);
  },

  async update(id, { name }) {
    const category = await CategoryModel.findById(id);
    if (!category) throw ApiError.notFound('Category not found');
    const slug = slugify(name);
    await CategoryModel.update(id, { name, slug });
    return CategoryModel.findById(id);
  },

  async delete(id) {
    const category = await CategoryModel.findById(id);
    if (!category) throw ApiError.notFound('Category not found');
    await CategoryModel.delete(id);
  },
};

module.exports = CategoryService;
