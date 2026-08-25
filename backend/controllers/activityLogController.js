const ActivityLog = require('../models/ActivityLog');

// GET /api/activity-logs - most recent 200, newest first
async function getAll(req, res) {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(200);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll };
