const Order = require('../models/Order');
const CouponUsage = require('../models/CouponUsage');
const Bundle = require('../models/Bundle');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      items,
      pricing,
      appliedBundle,
      appliedCoupon,
      paymentMethod,
      notes
    } = req.body;
    
    const userId = req.userId; // From auth middleware
    
    // CRITICAL: Validate stock availability for all items before creating order
    const Product = require('../models/Product');
    const outOfStockItems = [];
    
    for (const item of items) {
      // Try to find product in database by name (fuzzy match)
      const products = await Product.find({});
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
    
    // If any items are out of stock, reject the order
    if (outOfStockItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create order: Some items are out of stock',
        outOfStockItems: outOfStockItems
      });
    }
    
    // Calculate online payment discount if applicable
    let onlinePaymentDiscount = 0;
    if (paymentMethod === 'Online') {
      onlinePaymentDiscount = Math.round(pricing.subtotal * 0.10); // 10% discount
    }
    
    // Calculate final total
    const finalTotal = pricing.subtotal 
      - (pricing.bundleDiscount || 0)
      - (pricing.couponDiscount || 0)
      - onlinePaymentDiscount
      + (pricing.shippingCharges || 0)
      + (pricing.tax || 0);
    
    const order = new Order({
      userId,
      customerInfo,
      items,
      pricing: {
        ...pricing,
        onlinePaymentDiscount,
        total: finalTotal
      },
      appliedBundle,
      appliedCoupon,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      notes
    });
    
    await order.save();
    
    // Record coupon usage if applicable
    if (appliedCoupon && appliedCoupon.couponId) {
      await CouponUsage.create({
        couponId: appliedCoupon.couponId,
        couponCode: appliedCoupon.couponCode,
        userId,
        orderId: order.orderId,
        orderValue: pricing.subtotal,
        discountApplied: appliedCoupon.discount,
        finalAmount: finalTotal,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone
      });
    }
    
    // Increment bundle usage if applicable
    if (appliedBundle && appliedBundle.bundleId) {
      await Bundle.findByIdAndUpdate(
        appliedBundle.bundleId,
        { $inc: { usageCount: 1 } }
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'name email');
    
    const total = await Order.countDocuments(query);
    
    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
      .populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user is authorized
    if (!req.isAdmin && order.userId._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, adminNotes } = req.body;
    
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.orderStatus = orderStatus;
    if (adminNotes) order.adminNotes = adminNotes;
    
    // Update timestamps based on status
    if (orderStatus === 'Shipped' && !order.trackingInfo.shippedAt) {
      order.trackingInfo.shippedAt = new Date();
    }
    
    if (orderStatus === 'Delivered' && !order.trackingInfo.deliveredAt) {
      order.trackingInfo.deliveredAt = new Date();
    }
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update tracking info
// @route   PUT /api/orders/:id/tracking
// @access  Admin
exports.updateTrackingInfo = async (req, res) => {
  try {
    const { trackingNumber, courier } = req.body;
    
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.trackingInfo.trackingNumber = trackingNumber;
    order.trackingInfo.courier = courier;
    
    if (order.orderStatus === 'Confirmed' || order.orderStatus === 'Processing') {
      order.orderStatus = 'Shipped';
      order.trackingInfo.shippedAt = new Date();
    }
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Tracking information updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Admin
exports.getOrderStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await Order.getOrderStats(startDate, endDate);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user is authorized
    if (!req.isAdmin && order.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }
    
    // Check if order can be cancelled
    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`
      });
    }
    
    order.orderStatus = 'Cancelled';
    await order.save();
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
