const express = require('express');
const router = express.Router();
const { registerCustomer, registerProvider, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register/customer', registerCustomer);
router.post('/register/provider', registerProvider);
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;
