const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  workerName: { type: String, required: true },
  cashReceived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Work', workSchema);
