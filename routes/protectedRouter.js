const express = require('express');
const protectedController = require('../controller/protectedController');
const router = express.Router();

router.post('/', protectedController.fetchUserData);

module.exports = router;