const Purchase = require('../models/Purchase');

async function getAll(req, res) {
  try {
    const purchases = await Purchase.find().sort({ date: -1 });
    res.json({ success: true, data: purchases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const purchase = await Purchase.create(req.body);
    res.json({ success: true, data: purchase, message: 'Purchase added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: purchase, message: 'Purchase updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Purchase deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, create, update, remove };
