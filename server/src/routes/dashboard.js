const { Router } = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', dashboardController.getStats);
router.get('/recent-orders', dashboardController.getRecentOrders);

module.exports = router;
