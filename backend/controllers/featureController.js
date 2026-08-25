const Feature = require('../models/Feature');

async function getAll(req, res) {
  try {
    const features = await Feature.find();
    res.json({ success: true, data: features });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUT /api/features/:name   body: { enabled: true/false }
async function update(req, res) {
  try {
    const feature = await Feature.findOneAndUpdate(
      { name: req.params.name },
      { enabled: req.body.enabled },
      { new: true }
    );
    res.json({ success: true, data: feature, message: 'Feature updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, update };
