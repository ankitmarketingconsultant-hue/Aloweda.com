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

    // CRITICAL: Validate stock availability before placing COD order
    const Product = require('../models/Product');
    const outOfStockItems = [];
    
    if (items && items.length > 0) {
      const products = await Product.find({});
      
      for (const item of items) {
        const normalizedItemName = item.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        
        const dbProduct = products.find(p => {
          const normalizedDbName = p.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
          return normalizedItemName === normalizedDbName || 
                 normalizedItemName.includes(normalizedDbName) || 
                 normalizedDbName.includes(normalizedItemName);
        });
        
        if (dbProduct && dbProduct.stock === 0) {
          outOfStockItems.push(item.name);
        }
      }
    }
    
    // If any items are out of stock, reject the order
    if (outOfStockItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot place order: Some items are out of stock',
        outOfStockItems: outOfStockItems
      });
    }

    // Generate unique orderId
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderId = `ALD${year}${month}${day}${random}`;

    // Create order in database
    const order = new Order({
      orderId, // Manually set orderId
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
