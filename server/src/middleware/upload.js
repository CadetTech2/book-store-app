const multer = require('multer');
const path = require('path');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(env.upload.dir));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const allowed = /jpeg|jpg|png|webp/;
  const extMatch = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeMatch = allowed.test(file.mimetype);

  if (extMatch && mimeMatch) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Only JPEG, PNG, and WebP images are allowed'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.upload.maxFileSize },
});

module.exports = upload;
