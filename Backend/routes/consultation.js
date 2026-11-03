const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// In-memory store for verified consultation payments.
// Replace with a MongoDB model if you need persistence / admin visibility.
const consultationBookings = [];

// @desc    Create a Razorpay order for a consultation fee
// @route   POST /api/consultation/create-order
// @access  Public
router.post('/create-order', async (req, res) => {
  try {
    const { amount = 499, currency = 'INR', customerName, customerEmail } = req.body;

    if (!razorpay) {
      return res.status(500).json({ success: false, message: 'Payment gateway not configured' });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: `consult_${Date.now()}`,
      notes: {
        type: 'consultation',
        customerName: customerName || '',
        customerEmail: customerEmail || '',
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Consultation create-order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify Razorpay signature after consultation payment
// @route   POST /api/consultation/verify
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      customerEmail,
      amount,
    } = req.body;

    // Verify HMAC-SHA256 signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Record the booking
    const booking = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      amount,
      paidAt: new Date().toISOString(),
    };
    consultationBookings.push(booking);
    console.log('✅ Consultation payment verified:', booking);

    res.json({
      success: true,
      message: 'Payment verified. You can now book your slot.',
      booking,
    });
  } catch (error) {
    console.error('Consultation verify error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
