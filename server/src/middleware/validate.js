const ApiError = require('../utils/ApiError');

function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));
      return next(ApiError.badRequest('Validation failed', errors));
    }

    req[source] = value;
    next();
  };
}

module.exports = validate;
