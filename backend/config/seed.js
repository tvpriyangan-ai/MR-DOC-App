// Run this ONCE to create the Admin and Guest users in the database.
// Command: npm run seed

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Feature = require('../models/Feature');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Create users only if they don't already exist
  const existingAdmin = await User.findOne({ username: 'Admin' });
  if (!existingAdmin) {
    await User.create({ username: 'Admin', password: 'AdminMR2026', role: 'admin' });
    console.log('Admin user created');
  }

  const existingGuest = await User.findOne({ username: 'Guest' });
  if (!existingGuest) {
    await User.create({ username: 'Guest', password: 'Guest123', role: 'guest' });
    console.log('Guest user created');
  }

  // Default feature flags, all ON by default
  const featureNames = ['purchase', 'ledger', 'invoice', 'salary', 'shopValue'];
  for (const name of featureNames) {
    const existing = await Feature.findOne({ name });
    if (!existing) {
      await Feature.create({ name, enabled: true });
      console.log(`Feature "${name}" created`);
    }
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed();
