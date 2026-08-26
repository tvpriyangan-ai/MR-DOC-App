const LedgerEntry = require('../models/LedgerEntry');
const logActivity = require('../utils/activityLogger');

// "food" is admin-only, same as Salary - everything else (loan/shop_rent/cb_bill)
// is visible to any logged-in user.
function isFoodBlocked(type, role) {
  return type === 'food' && role !== 'admin';
}

// GET /api/ledger?type=loan  (type can be loan | shop_rent | cb_bill | food)
async function getAll(req, res) {
  try {
    if (isFoodBlocked(req.query.type, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Admin access only' });
    }

    const filter = req.query.type ? { type: req.query.type } : {};
    if (!req.query.type && req.user.role !== 'admin') {
      filter.type = { $ne: 'food' };
    }

    const entries = await LedgerEntry.find(filter).sort({ date: -1 });
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    if (isFoodBlocked(req.body.type, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Admin access only' });
    }

    const entry = await LedgerEntry.create(req.body);
    logActivity(req.user.username, 'ledger_add', `Added ${entry.type} entry "${entry.name}" - ${entry.amount}`);
    res.json({ success: true, data: entry, message: 'Entry added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const existing = await LedgerEntry.findById(req.params.id);
    if (!existing || isFoodBlocked(existing.type, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Admin access only' });
    }

    const entry = await LedgerEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    logActivity(req.user.username, 'ledger_update', `Updated ${entry.type} entry "${entry.name}" - ${entry.amount}`);
    res.json({ success: true, data: entry, message: 'Entry updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    const existing = await LedgerEntry.findById(req.params.id);
    if (!existing) return res.json({ success: true, message: 'Entry deleted' });
    if (isFoodBlocked(existing.type, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Admin access only' });
    }

    await LedgerEntry.findByIdAndDelete(req.params.id);
    logActivity(req.user.username, 'ledger_delete', `Deleted ${existing.type} entry "${existing.name}" - ${existing.amount}`);
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, create, update, remove };
