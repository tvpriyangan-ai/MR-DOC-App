const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Feature', featureSchema);
