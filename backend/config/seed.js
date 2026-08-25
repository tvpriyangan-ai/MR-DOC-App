// Run this ONCE to create the Admin and Guest users in the database.
// Command: npm run seed

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Feature = require('../models/Feature');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Create the Admin account only if it doesn't already exist.
  // Staff (guest-role) accounts are created afterwards from the app's
  // "Manage Users" screen, so each person gets their own login.
  const existingAdmin = await User.findOne({ username: 'Admin' });
  if (!existingAdmin) {
    await User.create({ name: 'Admin', username: 'Admin', password: 'AdminMR2026', role: 'admin' });
    console.log('Admin user created');
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
