const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { sendOrderEmail } = require('../utils/emailService');

// @desc    Place COD order + send email notification
// @route   POST /api/cod/place-order
// @access  Public
router.post('/place-order', async (req, res) => {
  try {
    const { 
      customerInfo, 
      items, 
      pricing,
      appliedBundle,
      appliedCoupon,
      notes,
      userId 
    } = req.body;

    if (!customerInfo?.name || !customerInfo?.phone || !customerInfo?.address) {
      return res.status(400).json({ success: false, message: 'Customer details required' });
    }

    // Create order in database
    const order = new Order({
      userId: userId || null, // Optional - guest checkout allowed
      customerInfo,
      items,
      pricing,
      appliedBundle,
      appliedCoupon,
      paymentMethod: 'COD',
      paymentStatus: 'Pending', // COD = payment pending until delivery
      orderStatus: 'Confirmed',
      notes
    });

    await order.save();

    // Send email notification
    try {
      await sendOrderEmail({
        customer: customerInfo,
        items,
        total: pricing.total,
        paymentMethod: 'Cash on Delivery (COD)',
        orderId: order.orderId,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order if email fails
    }

    res.json({
      success: true,
      message: 'Order placed successfully!',
      orderId: order.orderId,
      data: order
    });
  } catch (error) {
    console.error('COD order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
