const Customer = require('../models/Customer');

// GET /api/customers - most recently added first
async function getAll(req, res) {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, remove };
