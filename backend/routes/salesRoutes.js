const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { getAll, update } = require('../controllers/salesController');

router.get('/', auth, adminOnly, getAll);
router.put('/:date', auth, adminOnly, update);

module.exports = router;
