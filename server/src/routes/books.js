const { Router } = require('express');
const bookController = require('../controllers/bookController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createBookSchema, updateBookSchema, bookQuerySchema } = require('../validators/book');
const upload = require('../middleware/upload');

const router = Router();

router.get('/', validate(bookQuerySchema, 'query'), bookController.getAll);
router.get('/featured', bookController.getFeatured);
router.get('/:id', bookController.getById);
router.post('/', authenticate, authorize('admin'), validate(createBookSchema), bookController.create);
router.put('/:id', authenticate, authorize('admin'), validate(updateBookSchema), bookController.update);
router.delete('/:id', authenticate, authorize('admin'), bookController.delete);
router.post('/:id/image', authenticate, authorize('admin'), upload.single('cover'), bookController.uploadImage);

module.exports = router;
