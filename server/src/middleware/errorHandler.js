const env = require('../config/env');

function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'A record with this value already exists';
  }

  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size exceeds the allowed limit';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field';
  }

  if (!env.isProd) {
    console.error('[Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(env.isDev && { stack: err.stack }),
  });
}

module.exports = errorHandler;
