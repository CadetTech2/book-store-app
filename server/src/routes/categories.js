const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createCategorySchema, updateCategorySchema } = require('../validators/category');

const router = Router();

router.get('/', categoryController.getAll);
router.post('/', authenticate, authorize('admin'), validate(createCategorySchema), categoryController.create);
router.put('/:id', authenticate, authorize('admin'), validate(updateCategorySchema), categoryController.update);
router.delete('/:id', authenticate, authorize('admin'), categoryController.delete);

module.exports = router;
