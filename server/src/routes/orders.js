const { Router } = require('express');
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/order');

const router = Router();

router.use(authenticate);

router.post('/', validate(createOrderSchema), orderController.placeOrder);
router.get('/', orderController.getUserOrders);
router.get('/admin/all', authorize('admin'), orderController.getAllOrders);
router.get('/:id', orderController.getOrderDetail);
router.put('/:id/status', authorize('admin'), validate(updateOrderStatusSchema), orderController.updateStatus);

module.exports = router;
