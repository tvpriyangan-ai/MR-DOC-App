const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { getAll, create, update } = require('../controllers/salaryController');

router.get('/', auth, adminOnly, getAll);
router.post('/', auth, adminOnly, create);
router.put('/:id', auth, adminOnly, update);

module.exports = router;
