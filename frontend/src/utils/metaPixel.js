/**
 * Meta Pixel Tracking Utility
 * 
 * This file contains all Meta Pixel event tracking functions.
 * Events tracked:
 * - ViewContent: When user views a product
 * - AddToCart: When user adds product to cart
 * - InitiateCheckout: When user starts checkout process
 * - AddPaymentInfo: When user selects payment method
 * - Purchase: When order is completed
 */

/**
 * Track when user views a product page
 * @param {Object} product - Product details
 */
export const trackViewContent = (product) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      const price = parseFloat(product.price?.replace(/[^0-9.]/g, '')) || 0;
      
      window.fbq('track', 'ViewContent', {
        content_name: product.name,
        content_category: product.category || 'Product',
        content_ids: [product.id || product._id],
        content_type: 'product',
        value: price,
        currency: 'INR'
      });
      
      console.log('✅ Meta Pixel: ViewContent tracked', product.name);
    } catch (error) {
      console.error('❌ Meta Pixel ViewContent error:', error);
    }
  }
};

/**
 * Track when user adds product to cart
 * @param {Object} product - Product details
 * @param {Number} quantity - Quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      const price = parseFloat(product.price?.replace(/[^0-9.]/g, '')) || 0;
      
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_category: product.category || 'Product',
        content_ids: [product.id || product._id],
        content_type: 'product',
        value: price * quantity,
        currency: 'INR',
        quantity: quantity
      });
      
      console.log('✅ Meta Pixel: AddToCart tracked', product.name, 'x', quantity);
    } catch (error) {
      console.error('❌ Meta Pixel AddToCart error:', error);
    }
  }
};

/**
 * Track when user initiates checkout process
 * @param {Array} cartItems - All items in cart
 * @param {Number} total - Total cart value
 */
export const trackInitiateCheckout = (cartItems, total) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      const contentIds = cartItems.map(item => item.id || item._id);
      const numItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      window.fbq('track', 'InitiateCheckout', {
        content_ids: contentIds,
        content_type: 'product',
        value: total,
        currency: 'INR',
        num_items: numItems
      });
      
      console.log('✅ Meta Pixel: InitiateCheckout tracked', numItems, 'items, ₹', total);
    } catch (error) {
      console.error('❌ Meta Pixel InitiateCheckout error:', error);
    }
  }
};

/**
 * Track when user adds payment information (selects payment method)
 * @param {String} paymentMethod - Payment method selected (COD/Online)
 * @param {Array} cartItems - All items in cart
 * @param {Number} total - Total cart value
 */
export const trackAddPaymentInfo = (paymentMethod, cartItems, total) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      const contentIds = cartItems.map(item => item.id || item._id);
      const numItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      window.fbq('track', 'AddPaymentInfo', {
        content_ids: contentIds,
        content_type: 'product',
        value: total,
        currency: 'INR',
        num_items: numItems,
        payment_method: paymentMethod
      });
      
      console.log('✅ Meta Pixel: AddPaymentInfo tracked', paymentMethod, '₹', total);
    } catch (error) {
      console.error('❌ Meta Pixel AddPaymentInfo error:', error);
    }
  }
};

/**
 * Track when purchase is completed
 * @param {String} orderId - Order ID
 * @param {Array} cartItems - All items purchased
 * @param {Number} total - Total order value
 * @param {String} paymentMethod - Payment method used
 */
export const trackPurchase = (orderId, cartItems, total, paymentMethod) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      const contentIds = cartItems.map(item => item.id || item._id);
      const numItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      window.fbq('track', 'Purchase', {
        content_ids: contentIds,
        content_type: 'product',
        value: total,
        currency: 'INR',
        num_items: numItems,
        order_id: orderId,
        payment_method: paymentMethod
      });
      
      console.log('✅ Meta Pixel: Purchase tracked', orderId, '₹', total);
    } catch (error) {
      console.error('❌ Meta Pixel Purchase error:', error);
    }
  }
};
