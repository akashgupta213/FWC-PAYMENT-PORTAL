const express = require('express');
const router  = express.Router();
const { register, adminRegister, login, refreshToken, getMe } = require('../controllers/authController');
const validate          = require('../middleware/validate');
const { verifyJWT }     = require('../middleware/auth');
const { authLimiter }   = require('../middleware/rateLimiter');
const { registerSchema, loginSchema } = require('../schemas/authSchema');

router.post('/register',       authLimiter, validate(registerSchema), register);
router.post('/admin-register', authLimiter, adminRegister);
router.post('/login',          authLimiter, validate(loginSchema),    login);
router.post('/refresh',        refreshToken);
router.get ('/me',             verifyJWT, getMe);

module.exports = router;