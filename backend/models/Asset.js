const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  key:      { type: String, required: true, unique: true }, // e.g. "logo", "qr_code", "banner"
  url:      { type: String, required: true },               // hosted image URL (Cloudinary / S3 / imgbb)
  altText:  { type: String, default: '' },
  active:   { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);