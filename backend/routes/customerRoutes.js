const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { getAll, remove } = require('../controllers/customerController');

router.get('/', auth, adminOnly, getAll);
router.delete('/:id', auth, adminOnly, remove);

module.exports = router;
