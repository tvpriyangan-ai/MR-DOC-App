const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { getAll, create, update, remove } = require('../controllers/workController');

// Everyone logged in can view; only admin can add, edit (ticks), or delete.
router.get('/', auth, getAll);
router.post('/', auth, adminOnly, create);
router.put('/:id', auth, adminOnly, update);
router.delete('/:id', auth, adminOnly, remove);

module.exports = router;
