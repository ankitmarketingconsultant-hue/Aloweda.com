/**
 * Payment calculation utilities
 * Handles discount calculations for online payments
 */

const ONLINE_PAYMENT_DISCOUNT_PERCENTAGE = 10; // 10% discount on online payments

/**
 * Calculate online payment discount
 * @param {number} subtotal - Order subtotal before discounts
 * @returns {number} Discount amount
 */
exports.calculateOnlinePaymentDiscount = (subtotal) => {
  if (!subtotal || subtotal <= 0) return 0;
  return Math.round((subtotal * ONLINE_PAYMENT_DISCOUNT_PERCENTAGE) / 100);
};

/**
 * Calculate final order total
 * @param {object} pricing - Pricing object
 * @returns {number} Final total
 */
exports.calculateFinalTotal = (pricing) => {
  const {
    subtotal = 0,
    bundleDiscount = 0,
    couponDiscount = 0,
    onlinePaymentDiscount = 0,
    shippingCharges = 0,
    tax = 0
  } = pricing;

  const total = subtotal
    - bundleDiscount
    - couponDiscount
    - onlinePaymentDiscount
    + shippingCharges
    + tax;

  return Math.max(0, Math.round(total));
};

/**
 * Get pricing breakdown for display
 * @param {object} pricing - Pricing object
 * @returns {object} Formatted pricing breakdown
 */
exports.getPricingBreakdown = (pricing) => {
  const finalTotal = exports.calculateFinalTotal(pricing);
  const totalSavings = (pricing.bundleDiscount || 0) +
                       (pricing.couponDiscount || 0) +
                       (pricing.onlinePaymentDiscount || 0);

  return {
    subtotal: pricing.subtotal || 0,
    discounts: {
      bundle: pricing.bundleDiscount || 0,
      coupon: pricing.couponDiscount || 0,
      onlinePayment: pricing.onlinePaymentDiscount || 0,
      total: totalSavings
    },
    charges: {
      shipping: pricing.shippingCharges || 0,
      tax: pricing.tax || 0
    },
    finalTotal,
    savings: totalSavings,
    savingsPercentage: pricing.subtotal > 0 
      ? Math.round((totalSavings / pricing.subtotal) * 100) 
      : 0
  };
};

/**
 * Validate payment method and calculate appropriate discount
 * @param {string} paymentMethod - 'COD' or 'Online'
 * @param {number} subtotal - Order subtotal
 * @returns {object} Payment info with discount
 */
exports.validateAndCalculatePayment = (paymentMethod, subtotal) => {
  const validMethods = ['COD', 'Online'];
  
  if (!validMethods.includes(paymentMethod)) {
    throw new Error('Invalid payment method. Must be COD or Online');
  }

  const onlineDiscount = paymentMethod === 'Online' 
    ? exports.calculateOnlinePaymentDiscount(subtotal)
    : 0;

  return {
    paymentMethod,
    onlineDiscount,
    message: paymentMethod === 'Online' 
      ? `You're saving ₹${onlineDiscount} with online payment!`
      : 'Cash on Delivery selected'
  };
};

/**
 * Calculate free shipping threshold
 * @param {number} subtotal - Order subtotal
 * @param {number} threshold - Free shipping threshold (default: 999)
 * @returns {object} Shipping info
 */
exports.calculateShippingCharges = (subtotal, threshold = 999) => {
  const SHIPPING_CHARGES = 100; // Default shipping charges

  if (subtotal >= threshold) {
    return {
      charges: 0,
      isFree: true,
      message: 'Free Shipping! 🎉'
    };
  }

  const remaining = threshold - subtotal;

  return {
    charges: SHIPPING_CHARGES,
    isFree: false,
    message: `Add ₹${remaining} more for free shipping`,
    remaining
  };
};
