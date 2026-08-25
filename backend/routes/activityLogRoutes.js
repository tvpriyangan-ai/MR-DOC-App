const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { getAll } = require('../controllers/activityLogController');

router.get('/', auth, adminOnly, getAll);

module.exports = router;
