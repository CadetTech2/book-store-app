const { Router } = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateRoleSchema } = require('../validators/user');

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id/role', validate(updateRoleSchema), userController.updateRole);
router.delete('/:id', userController.delete);

module.exports = router;
