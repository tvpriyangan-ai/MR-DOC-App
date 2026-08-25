const Salary = require('../models/Salary');
const logActivity = require('../utils/activityLogger');

async function getAll(req, res) {
  try {
    const salaries = await Salary.find().sort({ date: -1 });
    res.json({ success: true, data: salaries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const salary = await Salary.create(req.body);
    logActivity(req.user.username, 'salary_add', `Added salary for "${salary.memberName}" - ${salary.salaryAmount}`);
    res.json({ success: true, data: salary, message: 'Salary record added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    logActivity(req.user.username, 'salary_update', `Updated salary for "${salary.memberName}" - ${salary.salaryAmount}`);
    res.json({ success: true, data: salary, message: 'Salary record updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, create, update };
