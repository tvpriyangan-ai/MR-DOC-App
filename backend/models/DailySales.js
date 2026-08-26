const mongoose = require('mongoose');

const dailySalesSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // 'YYYY-MM-DD'
  amount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DailySales', dailySalesSchema);
