const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  username: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
