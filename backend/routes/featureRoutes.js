const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { getAll, update } = require('../controllers/featureController');

router.get('/', auth, getAll);             // everyone logged in can read feature flags
router.put('/:name', auth, adminOnly, update); // only admin can change them

module.exports = router;
