// Facebook Pixel Helper Utility
// Use this to track custom events throughout your app

/**
 * Track a custom Facebook Pixel event
 * @param {string} eventName - Name of the event (e.g., 'AddToCart', 'Purchase', 'ViewContent')
 * @param {object} data - Optional event parameters
 */
export const trackFBEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
    console.log(`FB Pixel Event: ${eventName}`, data);
  }
};

/**
 * Track custom conversion event
 * @param {string} eventName - Custom event name
 * @param {object} data - Event parameters
 */
export const trackFBCustomEvent = (eventName, data = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, data);
    console.log(`FB Pixel Custom Event: ${eventName}`, data);
  }
};

// Pre-defined tracking functions for common e-commerce events

/**
 * Track when user views a product
 * @param {object} product - Product details
 */
export const trackViewContent = (product) => {
  trackFBEvent('ViewContent', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: parseFloat(product.price?.replace(/[^\d.]/g, '') || 0),
    currency: 'INR'
  });
};

/**
 * Track when user adds product to cart
 * @param {object} product - Product details
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
  trackFBEvent('AddToCart', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: parseFloat(product.price?.replace(/[^\d.]/g, '') || 0) * quantity,
    currency: 'INR'
  });
};

/**
 * Track when user initiates checkout
 * @param {array} items - Cart items
 * @param {number} totalValue - Total cart value
 */
export const trackInitiateCheckout = (items, totalValue) => {
  trackFBEvent('InitiateCheckout', {
    content_ids: items.map(item => item.id),
    contents: items.map(item => ({
      id: item.id,
      quantity: item.quantity || 1
    })),
    content_type: 'product',
    value: totalValue,
    currency: 'INR',
    num_items: items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  });
};

/**
 * Track successful purchase
 * @param {string} orderId - Order ID
 * @param {array} items - Purchased items
 * @param {number} totalValue - Total purchase value
 */
export const trackPurchase = (orderId, items, totalValue) => {
  trackFBEvent('Purchase', {
    content_ids: items.map(item => item.id),
    contents: items.map(item => ({
      id: item.id,
      quantity: item.quantity || 1
    })),
    content_type: 'product',
    value: totalValue,
    currency: 'INR',
    order_id: orderId,
    num_items: items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  });
};

/**
 * Track when user searches
 * @param {string} searchQuery - Search term
 */
export const trackSearch = (searchQuery) => {
  trackFBEvent('Search', {
    search_string: searchQuery
  });
};

/**
 * Track lead generation (e.g., signup, newsletter)
 * @param {string} email - User email (optional)
 */
export const trackLead = (email = null) => {
  const data = {};
  if (email) data.email = email;
  trackFBEvent('Lead', data);
};

/**
 * Track user registration/signup
 * @param {string} method - Registration method (e.g., 'email', 'google')
 */
export const trackCompleteRegistration = (method = 'email') => {
  trackFBEvent('CompleteRegistration', {
    status: 'completed',
    registration_method: method
  });
};

/**
 * Track when user adds payment info
 */
export const trackAddPaymentInfo = () => {
  trackFBEvent('AddPaymentInfo', {
    content_category: 'checkout'
  });
};

/**
 * Track wishlist addition
 * @param {object} product - Product details
 */
export const trackAddToWishlist = (product) => {
  trackFBEvent('AddToWishlist', {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    value: parseFloat(product.price?.replace(/[^\d.]/g, '') || 0),
    currency: 'INR'
  });
};

export default {
  trackFBEvent,
  trackFBCustomEvent,
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackSearch,
  trackLead,
  trackCompleteRegistration,
  trackAddPaymentInfo,
  trackAddToWishlist
};
