const Salary = require('../models/Salary');

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
    res.json({ success: true, data: salary, message: 'Salary record added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: salary, message: 'Salary record updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, create, update };
