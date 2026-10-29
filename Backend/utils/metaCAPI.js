/**
 * Meta Conversions API (CAPI) Service
 * 
 * Server-side tracking for Facebook/Instagram ads
 * Benefits:
 * - Bypasses ad blockers
 * - Better iOS 14+ tracking
 * - More accurate attribution
 * - Complements browser-side Pixel
 * 
 * Documentation: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

const crypto = require('crypto');

// Meta Pixel Configuration
const PIXEL_ID = '1130650692951273';
const ACCESS_TOKEN = 'EAAb2iUqD4uABSxkU1C1EiZBMmDcpBuA8sb1ZC3t60iWL34ow8OkkkN35q1qW6agsRb892QJjLjZCodD5IqtllNVSg04Quw9CcNgDcyZClMCw7YlyNJS20KUWXlLt4WaEzAiv643OZA5cAQw6qxs3uWT8MxkNQWqMFjkBb8G4cNsBPD5XeEYHZBsGxM5W62gtJQnAZDZD';
const API_VERSION = 'v21.0';
const API_URL = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

/**
 * Hash user data for privacy compliance (GDPR, CCPA)
 * Meta requires hashed user data
 */
const hashData = (data) => {
  if (!data) return null;
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
};

/**
 * Send event to Meta Conversions API
 * @param {String} eventName - Event name (Purchase, AddToCart, etc.)
 * @param {Object} eventData - Event parameters
 * @param {Object} userData - User information
 * @param {String} sourceUrl - Page URL where event occurred
 * @returns {Promise}
 */
const sendEvent = async (eventName, eventData, userData, sourceUrl = '') => {
  try {
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Prepare user data with hashing for privacy
    const hashedUserData = {
      em: userData.email ? hashData(userData.email) : null,
      ph: userData.phone ? hashData(userData.phone) : null,
      fn: userData.firstName ? hashData(userData.firstName) : null,
      ln: userData.lastName ? hashData(userData.lastName) : null,
      ct: userData.city ? hashData(userData.city) : null,
      st: userData.state ? hashData(userData.state) : null,
      zp: userData.zipCode ? hashData(userData.zipCode) : null,
      country: userData.country ? hashData(userData.country) : null,
    };

    // Remove null values
    Object.keys(hashedUserData).forEach(key => {
      if (hashedUserData[key] === null) {
        delete hashedUserData[key];
      }
    });

    // Prepare event data
    const eventPayload = {
      data: [{
        event_name: eventName,
        event_time: currentTime,
        event_source_url: sourceUrl || 'https://aloweda.com',
        action_source: 'website',
        user_data: hashedUserData,
        custom_data: eventData
      }]
    };

    // Send to Meta API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...eventPayload,
        access_token: ACCESS_TOKEN
      })
    });

    const result = await response.json();

    if (result.error) {
      console.error('❌ Meta CAPI Error:', result.error);
      return { success: false, error: result.error };
    }

    console.log(`✅ Meta CAPI: ${eventName} event sent successfully`);
    return { success: true, result };

  } catch (error) {
    console.error('❌ Meta CAPI Exception:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Track Purchase Event (Server-side)
 * @param {Object} orderData - Order information
 */
const trackPurchase = async (orderData) => {
  const { orderId, items, total, customer, paymentMethod } = orderData;

  const eventData = {
    currency: 'INR',
    value: parseFloat(total),
    content_type: 'product',
    content_ids: items.map(item => item.productId || item.id),
    contents: items.map(item => ({
      id: item.productId || item.id,
      quantity: item.quantity,
      item_price: parseFloat(item.price)
    })),
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    order_id: orderId,
    payment_method: paymentMethod
  };

  const userData = {
    email: customer.email,
    phone: customer.phone,
    firstName: customer.name?.split(' ')[0],
    lastName: customer.name?.split(' ').slice(1).join(' '),
    city: customer.address?.city,
    state: customer.address?.state,
    zipCode: customer.address?.pincode,
    country: customer.address?.country || 'IN'
  };

  return await sendEvent('Purchase', eventData, userData);
};

/**
 * Track AddToCart Event (Server-side)
 * @param {Object} cartData - Cart information
 */
const trackAddToCart = async (cartData) => {
  const { product, quantity, customer } = cartData;

  const eventData = {
    currency: 'INR',
    value: parseFloat(product.price) * quantity,
    content_type: 'product',
    content_ids: [product.id || product._id],
    content_name: product.name,
    content_category: product.category,
    contents: [{
      id: product.id || product._id,
      quantity: quantity,
      item_price: parseFloat(product.price)
    }]
  };

  const userData = {
    email: customer?.email,
    phone: customer?.phone,
    firstName: customer?.name?.split(' ')[0],
    lastName: customer?.name?.split(' ').slice(1).join(' ')
  };

  return await sendEvent('AddToCart', eventData, userData);
};

/**
 * Track InitiateCheckout Event (Server-side)
 * @param {Object} checkoutData - Checkout information
 */
const trackInitiateCheckout = async (checkoutData) => {
  const { items, total, customer } = checkoutData;

  const eventData = {
    currency: 'INR',
    value: parseFloat(total),
    content_type: 'product',
    content_ids: items.map(item => item.productId || item.id),
    contents: items.map(item => ({
      id: item.productId || item.id,
      quantity: item.quantity,
      item_price: parseFloat(item.price)
    })),
    num_items: items.reduce((sum, item) => sum + item.quantity, 0)
  };

  const userData = {
    email: customer?.email,
    phone: customer?.phone,
    firstName: customer?.name?.split(' ')[0],
    lastName: customer?.name?.split(' ').slice(1).join(' '),
    city: customer?.address?.city,
    state: customer?.address?.state,
    zipCode: customer?.address?.pincode,
    country: customer?.address?.country || 'IN'
  };

  return await sendEvent('InitiateCheckout', eventData, userData);
};

/**
 * Track AddPaymentInfo Event (Server-side)
 * @param {Object} paymentData - Payment information
 */
const trackAddPaymentInfo = async (paymentData) => {
  const { items, total, customer, paymentMethod } = paymentData;

  const eventData = {
    currency: 'INR',
    value: parseFloat(total),
    content_type: 'product',
    content_ids: items.map(item => item.productId || item.id),
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    payment_method: paymentMethod
  };

  const userData = {
    email: customer?.email,
    phone: customer?.phone,
    firstName: customer?.name?.split(' ')[0],
    lastName: customer?.name?.split(' ').slice(1).join(' '),
    city: customer?.address?.city,
    state: customer?.address?.state,
    zipCode: customer?.address?.pincode,
    country: customer?.address?.country || 'IN'
  };

  return await sendEvent('AddPaymentInfo', eventData, userData);
};

/**
 * Test CAPI connection
 */
const testConnection = async () => {
  try {
    const testData = {
      orderId: 'TEST-' + Date.now(),
      items: [{ productId: 'TEST-PROD', id: 'TEST-PROD', quantity: 1, price: 100 }],
      total: 100,
      customer: {
        email: 'test@aloweda.com',
        phone: '9999999999',
        name: 'Test User'
      },
      paymentMethod: 'Test'
    };

    const result = await trackPurchase(testData);
    return result;
  } catch (error) {
    console.error('❌ CAPI Test Failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  trackPurchase,
  trackAddToCart,
  trackInitiateCheckout,
  trackAddPaymentInfo,
  testConnection
};
