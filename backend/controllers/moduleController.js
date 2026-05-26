const ModuleConfig = require('../models/ModuleConfig');

const getModules = async (req, res) => {
  try {
    const modules = await ModuleConfig.find({ active: true }).sort({ id: 1 });
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch modules.' });
  }
};

// Admin: seed or update module config
const upsertModule = async (req, res) => {
  try {
    const { id } = req.body;
    const module = await ModuleConfig.findOneAndUpdate(
      { id },
      req.body,
      { upsert: true, new: true, runValidators: true }
    );
    res.json({ message: 'Module saved', module });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save module.' });
  }
};

module.exports = { getModules, upsertModule };