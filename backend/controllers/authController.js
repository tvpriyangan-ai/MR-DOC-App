const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

    res.json({ success: true, data: { token, role: user.role, username: user.username, name: user.name }, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { login };
