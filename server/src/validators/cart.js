const Joi = require('joi');

const addCartItemSchema = Joi.object({
  bookId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).max(99).default(1),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(99).required(),
});

module.exports = { addCartItemSchema, updateCartItemSchema };
