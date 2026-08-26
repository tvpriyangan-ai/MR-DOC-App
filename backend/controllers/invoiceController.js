const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const DailySales = require('../models/DailySales');
const logActivity = require('../utils/activityLogger');

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

    logActivity(req.user.username, 'invoice_create', `Created invoice for "${invoice.customerName}" - ${invoice.finalAmount}`);

    // Auto-save/update the customer record, deduped by mobile number
    try {
      await Customer.findOneAndUpdate(
        { mobileNumber },
        { name: customerName, mobileNumber },
        { upsert: true, new: true }
      );
    } catch (custErr) {
      console.error('Customer save failed:', custErr.message);
    }

    // Accumulate this invoice's amount into that day's sales total
    try {
      const dateKey = invoice.date.toISOString().slice(0, 10);
      await DailySales.findOneAndUpdate(
        { date: dateKey },
        { $inc: { amount: invoice.finalAmount } },
        { upsert: true, new: true }
      );
    } catch (salesErr) {
      console.error('Daily sales update failed:', salesErr.message);
    }

    res.json({ success: true, data: invoice, message: 'Invoice created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, getOne, create };
