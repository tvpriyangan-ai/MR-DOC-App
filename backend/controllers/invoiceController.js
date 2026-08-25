const Invoice = require('../models/Invoice');

async function getAll(req, res) {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getOne(req, res) {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/invoices
// Expects: { customerName, mobileNumber, date, items: [{material, price, count}], discount }
async function create(req, res) {
  try {
    const { customerName, mobileNumber, date, items, discount } = req.body;

    // Calculate totals on the backend so numbers can't be faked from frontend
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.count), 0);
    const finalAmount = totalAmount - (discount || 0);

    const invoice = await Invoice.create({
      customerName, mobileNumber, date, items,
      discount: discount || 0,
      totalAmount,
      finalAmount
    });

    res.json({ success: true, data: invoice, message: 'Invoice created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, getOne, create };
