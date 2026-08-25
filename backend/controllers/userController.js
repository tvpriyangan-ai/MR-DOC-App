const User = require('../models/User');

async function getAll(req, res) {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const { name, username, password, role } = req.body;
    const user = await User.create({ name, username, password, role });
    const { password: _pw, ...safeUser } = user.toObject();
    res.json({ success: true, data: safeUser, message: 'User added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const { name, username, password, role } = req.body;
    const changes = { name, username, role };
    if (password) changes.password = password; // only overwrite if a new one was given

    const user = await User.findByIdAndUpdate(req.params.id, changes, { new: true }).select('-password');
    res.json({ success: true, data: user, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: "You can't delete your own account while logged in" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, create, update, remove };
