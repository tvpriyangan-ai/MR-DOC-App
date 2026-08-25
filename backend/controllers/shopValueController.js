const ShopValue = require('../models/ShopValue');

async function getAll(req, res) {
  try {
    const items = await ShopValue.find();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const { categoryName, count, value } = req.body;
    const totalAmount = count * value;
    const item = await ShopValue.create({ categoryName, count, value, totalAmount });
    res.json({ success: true, data: item, message: 'Category added' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const { categoryName, count, value } = req.body;
    const totalAmount = count * value;
    const item = await ShopValue.findByIdAndUpdate(
      req.params.id,
      { categoryName, count, value, totalAmount },
      { new: true }
    );
    res.json({ success: true, data: item, message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    await ShopValue.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, create, update, remove };
