const Asset = require('../models/Asset');

const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ active: true });
    // Return as a key→url map for easy frontend use
    const map = {};
    assets.forEach(a => { map[a.key] = { url: a.url, altText: a.altText }; });
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assets.' });
  }
};

const upsertAsset = async (req, res) => {
  try {
    const { key, url, altText } = req.body;
    const asset = await Asset.findOneAndUpdate(
      { key },
      { key, url, altText },
      { upsert: true, new: true }
    );
    res.json({ message: 'Asset saved', asset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save asset.' });
  }
};

module.exports = { getAssets, upsertAsset };