const express = require('express');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/register', redirectIfAuthenticated, authController.showRegister);
router.post('/register', redirectIfAuthenticated, authController.register);

router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', redirectIfAuthenticated, authController.login);

router.post('/logout', requireAuth, authController.logout);

module.exports = router;
