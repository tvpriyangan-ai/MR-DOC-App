const DailySales = require('../models/DailySales');
const logActivity = require('../utils/activityLogger');

// GET /api/sales - every day's total, most recent first
async function getAll(req, res) {
  try {
    const sales = await DailySales.find().sort({ date: -1 });
    res.json({ success: true, data: sales });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUT /api/sales/:date  body: { amount }  - manual override for a given day
async function update(req, res) {
  try {
    const { amount } = req.body;
    const sale = await DailySales.findOneAndUpdate(
      { date: req.params.date },
      { amount },
      { new: true, upsert: true }
    );
    logActivity(req.user.username, 'sales_update', `Set sales for ${sale.date} to ${sale.amount}`);
    res.json({ success: true, data: sale, message: 'Sales updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, update };
