const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  memberName: { type: String, required: true },
  date: { type: Date, required: true },
  salaryAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);
