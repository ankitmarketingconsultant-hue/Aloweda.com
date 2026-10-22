const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Get all bundles/products for admin
router.get('/products', auth, admin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products' 
    });
  }
});

// Update product price
router.put('/products/:id/price', auth, admin, async (req, res) => {
  try {
    const { price } = req.body;
    
    if (!price || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { price },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Price updated successfully',
      product: product
    });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update price'
    });
  }
});

// Update product stock
router.put('/products/:id/stock', auth, admin, async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock is required'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      product: product
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock'
    });
  }
});

// Get all orders for admin
router.get('/orders', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Update order status
router.put('/orders/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'replaced'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Cancel order
router.put('/orders/:id/cancel', auth, admin, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel delivered order'
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = reason || 'Cancelled by admin';
    order.cancelledAt = Date.now();
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
});

// Refund order
router.put('/orders/:id/refund', auth, admin, async (req, res) => {
  try {
    const { reason, refundAmount } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = 'refunded';
    order.refundReason = reason || 'Refunded by admin';
    order.refundAmount = refundAmount || order.totalAmount;
    order.refundedAt = Date.now();
    await order.save();

    res.json({
      success: true,
      message: 'Order refunded successfully',
      order
    });
  } catch (error) {
    console.error('Error refunding order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refund order'
    });
  }
});

// Replace order
router.put('/orders/:id/replace', auth, admin, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = 'replaced';
    order.replacementReason = reason || 'Replaced by admin';
    order.replacedAt = Date.now();
    await order.save();

    res.json({
      success: true,
      message: 'Order replacement initiated successfully',
      order
    });
  } catch (error) {
    console.error('Error replacing order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to replace order'
    });
  }
});

// Get sales analytics
router.get('/analytics', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find();
    
    // Total sales calculation
    const totalSales = orders.reduce((sum, order) => {
      if (order.status !== 'cancelled' && order.status !== 'refunded') {
        return sum + (order.totalAmount || 0);
      }
      return sum;
    }, 0);

    // Orders by status
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Total orders
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    // Product-wise sales
    const productSales = {};
    orders.forEach(order => {
      if (order.status !== 'cancelled' && order.status !== 'refunded') {
        order.items?.forEach(item => {
          const productName = item.name || 'Unknown';
          if (!productSales[productName]) {
            productSales[productName] = {
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productName].quantity += item.quantity || 0;
          productSales[productName].revenue += (item.price || 0) * (item.quantity || 0);
        });
      }
    });

    res.json({
      success: true,
      analytics: {
        totalSales,
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        ordersByStatus,
        productSales
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Get all users
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

module.exports = router;
