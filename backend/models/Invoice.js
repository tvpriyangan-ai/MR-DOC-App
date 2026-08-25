const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  material: { type: String, enum: ['T-shirt', 'Shirt', 'Jeans', 'Shorts', 'Other'], required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  date: { type: Date, required: true },
  items: [invoiceItemSchema],
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  finalAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
