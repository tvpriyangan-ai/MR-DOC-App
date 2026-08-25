const ActivityLog = require('../models/ActivityLog');

// Fire-and-forget: a logging failure should never break the action it's recording.
async function logActivity(username, action, details) {
  try {
    await ActivityLog.create({ username, action, details });
  } catch (err) {
    console.error('Activity log failed:', err.message);
  }
}

module.exports = logActivity;
