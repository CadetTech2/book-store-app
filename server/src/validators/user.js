const Joi = require('joi');

const updateRoleSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required(),
});

module.exports = { updateRoleSchema };
