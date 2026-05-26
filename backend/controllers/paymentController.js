const Payment              = require('../models/Payment');
const Student              = require('../models/Student');
const { sendToSheets }     = require('../services/sheetsService');
const { sendReceiptEmail, sendAdminAlert, sendPaymentVerifiedEmail, sendPaymentRejectedEmail } = require('../services/emailService');

const submitPayment = async (req, res) => {
  try {
    const { modules, subTotal, grandTotal, utrNumber } = req.body;
    const studentId = req.user.id;

    // Prevent duplicate UTR
    const duplicate = await Payment.findOne({ utrNumber });
    if (duplicate) {
      return res.status(409).json({ message: 'This UTR has already been submitted. Contact support if this is an error.' });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    const payment = await Payment.create({
      student:   studentId,
      cometId:   student.cometId,
      name:      student.name,
      email:     student.email,
      contact:   student.contact,
      modules,
      subTotal,
      grandTotal,
      utrNumber,
      paymentStatus: 'Pending Verification'
    });

    const sheetsPayload = {
      name:       student.name,
      cometId:    student.cometId,
      email:      student.email,
      contact:    student.contact,
      modules:    modules.map(m => `${m.moduleName}${m.termName ? ' - ' + m.termName : ''}`).join(', '),
      grandTotal,
      utrNumber,
      paymentStatus: 'Pending Verification',
      timestamp:  new Date().toISOString()
    };

    // Run integrations in parallel — non-blocking
    Promise.allSettled([
      sendToSheets(sheetsPayload),
      sendReceiptEmail({ ...student.toObject(), modules, grandTotal, utrNumber }),
      sendAdminAlert({ ...student.toObject(), modules, grandTotal, utrNumber })
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') console.warn(`Integration ${i} failed:`, r.reason);
      });
    });

    res.status(201).json({
      message: 'Payment submitted successfully. Pending verification.',
      paymentId: payment._id,
      utrNumber,
      grandTotal,
      paymentStatus: payment.paymentStatus
    });
  } catch (err) {
    console.error('Payment submit error:', err);
    res.status(500).json({ message: 'Failed to submit payment. Please try again.' });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payment history.' });
  }
};

// Admin only
const getAllPayments = async (req, res) => {
  try {
    const { status, cometId } = req.query;
    const filter = {};
    if (status)  filter.paymentStatus = status;
    if (cometId) filter.cometId = cometId.toUpperCase();

    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments.' });
  }
};

// Replace your existing updatePaymentStatus function with this:
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const allowed = ['Pending Verification', 'Verified', 'Rejected'];
    if (!allowed.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const payment = await Payment.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: 'Payment not found.' });

    // Send email based on status — non-blocking
    const emailData = {
      name:       payment.name,
      email:      payment.email,
      cometId:    payment.cometId,
      modules:    payment.modules,
      grandTotal: payment.grandTotal,
      utrNumber:  payment.utrNumber,
    };

    if (paymentStatus === 'Verified') {
      sendPaymentVerifiedEmail(emailData).catch(err =>
        console.warn('Verified email failed:', err.message)
      );
    } else if (paymentStatus === 'Rejected') {
      sendPaymentRejectedEmail(emailData).catch(err =>
        console.warn('Rejected email failed:', err.message)
      );
    }

    res.json({ message: 'Status updated', payment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
};


const resubmitUTR = async (req, res) => {
  try {
    const { id } = req.params;
    const { utrNumber } = req.body;

    // Validate UTR format
    if (!utrNumber || !/^[0-9]{12}$/.test(utrNumber)) {
      return res.status(400).json({ message: 'UTR must be exactly 12 digits.' });
    }

    // Find the payment and verify ownership
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    // Must belong to the logged-in student
    if (payment.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    // Must be Rejected to resubmit
    if (payment.paymentStatus !== 'Rejected') {
      return res.status(400).json({ message: 'Only rejected payments can be resubmitted.' });
    }

    // Can only resubmit once
    if (payment.resubmitted) {
      return res.status(400).json({ message: 'You have already resubmitted this payment once.' });
    }

    // Check new UTR is not a duplicate across all payments
    const duplicate = await Payment.findOne({ utrNumber, _id: { $ne: id } });
    if (duplicate) {
      return res.status(409).json({ message: 'This UTR has already been used. Please check and try again.' });
    }

    // Update: new UTR, reset status, mark resubmitted
    payment.utrNumber     = utrNumber;
    payment.paymentStatus = 'Pending Verification';
    payment.resubmitted   = true;
    await payment.save();

    res.json({
      message: 'UTR resubmitted successfully. Pending verification.',
      payment
    });
  } catch (err) {
    console.error('Resubmit UTR error:', err);
    res.status(500).json({ message: 'Failed to resubmit. Please try again.' });
  }
};



module.exports = { submitPayment, getMyPayments, getAllPayments, updatePaymentStatus, resubmitUTR };