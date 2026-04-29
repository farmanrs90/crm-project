const express = require('express');
const router = express.Router();
const auth = require('../../common/middleware/auth');
const { getDashboardController } = require('./dashboard.controller');

router.get('/', auth, getDashboardController);

module.exports = router;