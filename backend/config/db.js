// Connects to MongoDB Atlas using the URI from .env
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    // Log and keep the server running instead of exiting: a bad DB
    // connection should only break DB-backed routes, not the whole
    // app (static pages, login page, CSS, etc. should still load).
    console.error('MongoDB connection failed:', err.message);
  }
}

module.exports = connectDB;
