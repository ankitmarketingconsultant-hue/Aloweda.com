/**
 * Meta CAPI Testing Endpoint
 * Use this to verify CAPI connection is working
 */

const express = require('express');
const router = express.Router();
const { 
  testConnection, 
  trackPurchase, 
  trackAddToCart,
  trackInitiateCheckout,
  trackAddPaymentInfo 
} = require('../utils/metaCAPI');

// @desc    Test Meta CAPI connection
// @route   GET /api/meta-capi-test/connection
// @access  Public (remove in production or add auth)
router.get('/connection', async (req, res) => {
  try {
    const result = await testConnection();
    
    if (result.success) {
      res.json({
        success: true,
        message: '✅ Meta CAPI connection successful!',
        details: 'Test Purchase event sent to Facebook',
        result: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: '❌ Meta CAPI connection failed',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
});

// @desc    Test Purchase event
// @route   POST /api/meta-capi-test/purchase
// @access  Public (remove in production or add auth)
router.post('/purchase', async (req, res) => {
  try {
    const testData = {
      orderId: 'TEST-' + Date.now(),
      items: [
        { productId: 'PROD-001', id: 'PROD-001', quantity: 2, price: 1299 },
        { productId: 'PROD-002', id: 'PROD-002', quantity: 1, price: 899 }
      ],
      total: 3497,
      customer: {
        email: 'test@aloweda.com',
        phone: '9876543210',
        name: 'Test User',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'IN'
        }
      },
      paymentMethod: 'COD'
    };

    const result = await trackPurchase(testData);
    
    res.json({
      success: result.success,
      message: result.success ? '✅ Purchase event sent' : '❌ Purchase event failed',
      result: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Test AddToCart event
// @route   POST /api/meta-capi-test/add-to-cart
// @access  Public (remove in production or add auth)
router.post('/add-to-cart', async (req, res) => {
  try {
    const testData = {
      product: {
        id: 'PROD-001',
        name: 'Test Serum',
        category: 'Serum',
        price: '1299'
      },
      quantity: 2,
      customer: {
        email: 'test@aloweda.com',
        phone: '9876543210',
        name: 'Test User'
      }
    };

    const result = await trackAddToCart(testData);
    
    res.json({
      success: result.success,
      message: result.success ? '✅ AddToCart event sent' : '❌ AddToCart event failed',
      result: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Test InitiateCheckout event
// @route   POST /api/meta-capi-test/initiate-checkout
// @access  Public (remove in production or add auth)
router.post('/initiate-checkout', async (req, res) => {
  try {
    const testData = {
      items: [
        { productId: 'PROD-001', id: 'PROD-001', quantity: 2, price: 1299 },
        { productId: 'PROD-002', id: 'PROD-002', quantity: 1, price: 899 }
      ],
      total: 3497,
      customer: {
        email: 'test@aloweda.com',
        phone: '9876543210',
        name: 'Test User',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'IN'
        }
      }
    };

    const result = await trackInitiateCheckout(testData);
    
    res.json({
      success: result.success,
      message: result.success ? '✅ InitiateCheckout event sent' : '❌ InitiateCheckout event failed',
      result: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Test AddPaymentInfo event
// @route   POST /api/meta-capi-test/add-payment-info
// @access  Public (remove in production or add auth)
router.post('/add-payment-info', async (req, res) => {
  try {
    const testData = {
      items: [
        { productId: 'PROD-001', id: 'PROD-001', quantity: 2, price: 1299 }
      ],
      total: 2598,
      customer: {
        email: 'test@aloweda.com',
        phone: '9876543210',
        name: 'Test User',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'IN'
        }
      },
      paymentMethod: 'Online'
    };

    const result = await trackAddPaymentInfo(testData);
    
    res.json({
      success: result.success,
      message: result.success ? '✅ AddPaymentInfo event sent' : '❌ AddPaymentInfo event failed',
      result: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
