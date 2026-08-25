const mongoose = require('mongoose');

const shopValueSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  count: { type: Number, required: true },
  value: { type: Number, required: true },
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ShopValue', shopValueSchema);
