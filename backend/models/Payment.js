const mongoose = require('mongoose');

const selectedModuleSchema = new mongoose.Schema({
  moduleId:   { type: Number, required: true },
  moduleName: { type: String, required: true },
  termId:     { type: Number, default: null },
  termName:   { type: String, default: null },
  fee:        { type: Number, required: true }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  cometId:    { type: String, required: true, uppercase: true },
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  contact:    { type: String, required: true },
  modules:    [selectedModuleSchema],
  subTotal:   { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  utrNumber: {
    type: String,
    required: true,
    match: [/^[0-9]{12}$/, 'UTR must be exactly 12 digits']
  },

  paymentDate: { type: Date , required : true },   // ← ADD THIS
  paymentMode:   { type: String, default: 'QR / UPI' },
  paymentStatus: {
    type: String,
    enum: ['Pending Verification', 'Verified', 'Rejected'],
    default: 'Pending Verification'
  
}, 
// ── NEW ──
  resubmitted: {
    type: Boolean,
    default: false          // becomes true after student resubmits UTR once
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
