const Joi = require('joi');

const createOrderSchema = Joi.object({
  shippingAddress: Joi.string().trim().min(10).max(500).required(),
  paymentMethod: Joi.string().trim().valid('credit_card', 'debit_card', 'cod').required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required(),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
