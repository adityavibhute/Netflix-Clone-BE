const express = require('express');
const { verifyToken } = require('../controller/tokenController');
const authController = require('../controller/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.signin);
router.post('/logout', verifyToken, authController.logout)

module.exports = router;