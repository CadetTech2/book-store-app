const { Router } = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require('../validators/auth');

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getProfile);
router.put('/me', authenticate, validate(updateProfileSchema), authController.updateProfile);
router.put('/me/password', authenticate, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
