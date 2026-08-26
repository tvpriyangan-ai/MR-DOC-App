// Covers Loans, Shop Rent, and CB Bill — same shape, different "type" field
const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  type: { type: String, enum: ['loan', 'shop_rent', 'cb_bill', 'others'], required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  deadlineDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('LedgerEntry', ledgerSchema);
