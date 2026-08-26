const LedgerEntry = require('../models/LedgerEntry');
const logActivity = require('../utils/activityLogger');

// GET /api/ledger?type=loan  (type can be loan | shop_rent | cb_bill | food)
async function getAll(req, res) {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const entries = await LedgerEntry.find(filter).sort({ date: -1 });
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const entry = await LedgerEntry.create(req.body);
    logActivity(req.user.username, 'ledger_add', `Added ${entry.type} entry "${entry.name}" - ${entry.amount}`);
    res.json({ success: true, data: entry, message: 'Entry added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const entry = await LedgerEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    logActivity(req.user.username, 'ledger_update', `Updated ${entry.type} entry "${entry.name}" - ${entry.amount}`);
    res.json({ success: true, data: entry, message: 'Entry updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    const entry = await LedgerEntry.findByIdAndDelete(req.params.id);
    if (entry) logActivity(req.user.username, 'ledger_delete', `Deleted ${entry.type} entry "${entry.name}" - ${entry.amount}`);
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, create, update, remove };
