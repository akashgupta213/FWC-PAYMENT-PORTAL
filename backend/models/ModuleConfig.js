const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
  id:   { type: Number, required: true },
  name: { type: String, required: true },
  fee:  { type: Number, required: true }
}, { _id: false });

const moduleConfigSchema = new mongoose.Schema({
  id:       { type: Number, required: true, unique: true },
  name:     { type: String, required: true },
  fee:      { type: Number, default: null },
  hasTerms: { type: Boolean, default: false },
  fullFee:  { type: Number, default: null },
  terms:    [termSchema],
  active:   { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ModuleConfig', moduleConfigSchema);