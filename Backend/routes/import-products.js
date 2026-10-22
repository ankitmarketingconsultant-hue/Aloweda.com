const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Sample products data
const SAMPLE_PRODUCTS = [
  {
    name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter',
    category: 'combo',
    price: 899,
    mrp: 1199,
    stock: 50,
    description: 'Complete skincare routine with day cream, night cream, and lip butter',
    isActive: true
  },
  {
    name: 'PERFECT COMPLEXION RITUAL',
    category: 'combo',
    price: 1299,
    mrp: 1599,
    stock: 50,
    description: 'Perfect complexion routine',
    isActive: true
  },
  {
    name: 'RITUAL OF RADIANCE',
    category: 'combo',
    price: 1149,
    mrp: 1299,
    stock: 50,
    description: 'Complete radiance ritual',
    isActive: true
  },
  {
    name: 'The Day Cream 50G',
    category: 'cream',
    price: 499,
    mrp: 549,
    stock: 100,
    description: 'Hydrating day cream with SPF 30',
    isActive: true
  },
  {
    name: 'The Night Cream 50G',
    category: 'cream',
    price: 549,
    mrp: 599,
    stock: 100,
    description: 'Anti-aging night cream',
    isActive: true
  },
  {
    name: 'Saffron Face Oil 30ml',
    category: 'oil',
    price: 799,
    mrp: 799,
    stock: 75,
    description: 'Luxurious saffron face oil',
    isActive: true
  },
  {
    name: 'Complexion Cream 50G',
    category: 'cream',
    price: 499,
    mrp: 549,
    stock: 100,
    description: 'Brightening complexion cream',
    isActive: true
  },
  {
    name: 'Super Glow Serum 30ml',
    category: 'serum',
    price: 649,
    mrp: 699,
    stock: 100,
    description: 'Vitamin C super glow serum',
    isActive: true
  },
  {
    name: 'Pigment Control Serum 30ml',
    category: 'serum',
    price: 599,
    mrp: 649,
    stock: 100,
    description: 'Even skin tone serum',
    isActive: true
  },
  {
    name: 'Smooth Perfection Serum 30ml',
    category: 'serum',
    price: 599,
    mrp: 649,
    stock: 100,
    description: 'Smoothing serum',
    isActive: true
  },
  {
    name: 'Radiance Cream 50G',
    category: 'cream',
    price: 549,
    mrp: 599,
    stock: 100,
    description: 'High potency Vitamin C cream',
    isActive: true
  },
  {
    name: 'Lines & Wrinkles Serum 30ml',
    category: 'serum',
    price: 649,
    mrp: 699,
    stock: 100,
    description: 'Anti-aging serum',
    isActive: true
  },
  {
    name: 'Anti Acne Face Wash 150ml',
    category: 'facewash',
    price: 349,
    mrp: 399,
    stock: 150,
    description: 'Salicylic acid face wash',
    isActive: true
  },
  {
    name: 'Hair Therapy Serum 50ml',
    category: 'haircare',
    price: 699,
    mrp: 749,
    stock: 75,
    description: 'Hair growth serum',
    isActive: true
  },
  {
    name: 'Lip Butter 15G',
    category: 'lipcare',
    price: 299,
    mrp: 349,
    stock: 150,
    description: 'Nourishing lip butter',
    isActive: true
  }
];

// Public endpoint to import products (one-time use) - supports both GET and POST
router.post('/init', importProducts);
router.get('/init', importProducts);

async function importProducts(req, res) {
  try {
    console.log('Import products endpoint hit');
    
    // Check if products already exist
    const existingCount = await Product.countDocuments();
    console.log('Existing products count:', existingCount);
    
    if (existingCount > 0) {
      return res.json({
        success: false,
        message: `Database already has ${existingCount} products. Import skipped.`,
        count: existingCount
      });
    }

    // Import products
    console.log('Importing', SAMPLE_PRODUCTS.length, 'products...');
    const result = await Product.insertMany(SAMPLE_PRODUCTS);
    console.log('Import successful:', result.length, 'products added');

    res.json({
      success: true,
      message: 'Products imported successfully!',
      count: result.length,
      products: result
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import products',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Get import status
router.get('/status', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({
      success: true,
      productsInDatabase: count,
      needsImport: count === 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check status',
      error: error.message
    });
  }
});

module.exports = router;
