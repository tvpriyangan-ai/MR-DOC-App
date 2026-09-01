const Work = require('../models/Work');
const logActivity = require('../utils/activityLogger');

async function getAll(req, res) {
  try {
    const works = await Work.find().sort({ date: -1 });
    res.json({ success: true, data: works });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const work = await Work.create(req.body);
    logActivity(req.user.username, 'work_add', `Added work "${work.name}" for ${work.workerName}`);
    res.json({ success: true, data: work, message: 'Work added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Also used for the tick (completed) and cash-received checkbox toggles -
// the frontend just PUTs whichever field changed.
async function update(req, res) {
  try {
    const work = await Work.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: work, message: 'Work updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);
    if (work) logActivity(req.user.username, 'work_delete', `Deleted work "${work.name}"`);
    res.json({ success: true, message: 'Work deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, create, update, remove };
