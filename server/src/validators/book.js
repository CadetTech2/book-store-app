const Joi = require('joi');

const createBookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required(),
  author: Joi.string().trim().min(1).max(200).required(),
  isbn: Joi.string().trim().max(20).allow('', null),
  description: Joi.string().trim().max(5000).allow('', null),
  price: Joi.number().precision(2).positive().required(),
  stock: Joi.number().integer().min(0).default(0),
  category_id: Joi.number().integer().positive().allow(null),
  pages: Joi.number().integer().positive().allow(null),
  publisher: Joi.string().trim().max(200).allow('', null),
  published_year: Joi.number().integer().min(1000).max(new Date().getFullYear()).allow(null),
  is_featured: Joi.boolean().default(false),
});

const updateBookSchema = createBookSchema.fork(
  ['title', 'author', 'price'],
  (schema) => schema.optional()
).min(1);

const bookQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  search: Joi.string().trim().max(200).allow(''),
  category: Joi.number().integer().positive(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  sort: Joi.string().valid('title', 'price', 'created_at', 'published_year').default('created_at'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = { createBookSchema, updateBookSchema, bookQuerySchema };
