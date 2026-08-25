const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logActivity = require('../utils/activityLogger');

// POST /api/auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password }); // simple match, per your setup

    if (!user) {
      return res.status(401).json({ success: false, message: 'Wrong username or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    logActivity(user.username, 'login', `${user.name} logged in`);

    res.json({ success: true, data: { token, role: user.role, username: user.username, name: user.name }, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/auth/logout
async function logout(req, res) {
  logActivity(req.user.username, 'logout', `${req.user.username} logged out`);
  res.json({ success: true, message: 'Logged out' });
}

module.exports = { login, logout };
