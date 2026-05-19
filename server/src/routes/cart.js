const { Router } = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addCartItemSchema, updateCartItemSchema } = require('../validators/cart');

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', validate(addCartItemSchema), cartController.addItem);
router.put('/items/:id', validate(updateCartItemSchema), cartController.updateItem);
router.delete('/items/:id', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
