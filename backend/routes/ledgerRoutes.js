const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, create, update, remove } = require('../controllers/ledgerController');

router.get('/', auth, getAll);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
