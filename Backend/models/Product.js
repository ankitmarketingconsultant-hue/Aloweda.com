const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    default: ''
  },
  howToUse: {
    type: String,
    default: ''
  },
  shippingReturns: {
    type: String,
    default: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.'
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
