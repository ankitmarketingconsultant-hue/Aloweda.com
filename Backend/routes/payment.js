const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { trackPurchase } = require('../utils/metaCAPI');

const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}) : null;

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Public
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay takes paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
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
    console.error('Razorpay create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData, // full order details to save
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Payment verified — save order to DB if orderData provided
    if (orderData) {
      const order = new Order({
        ...orderData,
        paymentStatus: 'Paid',
        paymentMethod: 'Online',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });
      await order.save();

      // Track Purchase event with Meta CAPI (Server-side)
      try {
        await trackPurchase({
          orderId: order.orderId,
          items: orderData.items || [],
          total: orderData.total || orderData.pricing?.total || 0,
          customer: orderData.customer || orderData.customerInfo || {},
          paymentMethod: 'Online'
        });
        console.log('✅ Meta CAPI: Purchase event tracked for Online order', order.orderId);
      } catch (capiError) {
        console.error('❌ Meta CAPI tracking failed (non-critical):', capiError);
        // Don't fail the order if CAPI tracking fails
      }

      return res.json({
        success: true,
        message: 'Payment verified and order placed successfully',
        orderId: order.orderId,
      });
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
