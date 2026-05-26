const express = require('express');
const router  = express.Router();
const {
  submitPayment,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus,
  resubmitUTR
} = require('../controllers/paymentController');
const { verifyJWT, verifyAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { paymentSchema }  = require('../schemas/paymentSchema');

router.post('/submit',         verifyJWT, paymentLimiter, validate(paymentSchema), submitPayment);
router.get('/my',              verifyJWT, getMyPayments);
router.patch ('/resubmit/:id',        verifyJWT, resubmitUTR);     
router.get('/admin/all',       verifyJWT, verifyAdmin, getAllPayments);
router.patch('/admin/:id/status', verifyJWT, verifyAdmin, updatePaymentStatus);

module.exports = router;