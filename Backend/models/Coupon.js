const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discount: {
    type: Number,
    required: function() {
      return !this.isBundle; // Not required if it's a bundle
    },
    min: 0,
    default: 0
  },
  // Bundle-specific fields
  isBundle: {
    type: Boolean,
    default: false
  },
  bundleQuantity: {
    type: Number,
    min: 1,
    required: function() {
      return this.isBundle;
    }
  },
  bundlePrice: {
    type: Number,
    min: 0,
    required: function() {
      return this.isBundle;
    }
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTo: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    trim: true
  },
  campaign: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: String
  }],
  excludedProducts: [{
    type: String
  }]
}, {
  timestamps: true
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  
  if (this.validFrom > now) {
    return { valid: false, message: 'Coupon is not yet active' };
  }
  
  if (this.validTo < now) {
    return { valid: false, message: 'Coupon has expired' };
  }
  
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  
  return { valid: true, message: 'Coupon is valid' };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(orderValue, cartItems = []) {
  // Handle bundle coupons
  if (this.isBundle) {
    const cartQuantity = cartItems.length || 0;
    
    if (cartQuantity < this.bundleQuantity) {
      return {
        discount: 0,
        message: `Add ${this.bundleQuantity - cartQuantity} more item(s) to use this bundle deal`
      };
    }
    
    // Calculate discount: original total - bundle price
    const discount = Math.max(0, orderValue - this.bundlePrice);
    
    return {
      discount: Math.round(discount),
      finalPrice: this.bundlePrice,
      message: `Bundle deal applied: ${this.bundleQuantity} items for ₹${this.bundlePrice}`
    };
  }
  
  // Handle regular discount coupons
  if (orderValue < this.minOrderValue) {
    return {
      discount: 0,
      message: `Minimum order value of ₹${this.minOrderValue} required`
    };
  }

  let discount = 0;
  
  if (this.type === 'percentage') {
    discount = (orderValue * this.discount) / 100;
    if (this.maxDiscount) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else if (this.type === 'fixed') {
    discount = Math.min(this.discount, orderValue);
  }

  return {
    discount: Math.round(discount),
    message: 'Discount applied successfully'
  };
};

// Index for faster queries
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ validTo: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
