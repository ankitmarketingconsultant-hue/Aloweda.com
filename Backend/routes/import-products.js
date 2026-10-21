const express = require('express');
const router = express.Router();
const Bundle = require('../models/Bundle');

// Sample products data
const SAMPLE_PRODUCTS = [
  {
    name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter',
    category: 'combo',
    price: 899,
    mrp: 1199,
    stock: 50,
    description: 'Complete skincare routine with day cream, night cream, and lip butter'
  },
  {
    name: 'PERFECT COMPLEXION RITUAL',
    category: 'combo',
    price: 1299,
    mrp: 1599,
    stock: 50,
    description: 'Perfect complexion routine'
  },
  {
    name: 'RITUAL OF RADIANCE',
    category: 'combo',
    price: 1149,
    mrp: 1299,
    stock: 50,
    description: 'Complete radiance ritual'
  },
  {
    name: 'The Day Cream 50G',
    category: 'cream',
    price: 499,
    mrp: 549,
    stock: 100,
    description: 'Hydrating day cream with SPF 30'
  },
  {
    name: 'The Night Cream 50G',
    category: 'cream',
    price: 549,
    mrp: 599,
    stock: 100,
    description: 'Anti-aging night cream'
  },
  {
    name: 'Saffron Face Oil 30ml',
    category: 'oil',
    price: 799,
    mrp: 799,
    stock: 75,
    description: 'Luxurious saffron face oil'
  },
  {
    name: 'Complexion Cream 50G',
    category: 'cream',
    price: 499,
    mrp: 549,
    stock: 100,
    description: 'Brightening complexion cream'
  },
  {
    name: 'Super Glow Serum 30ml',
    category: 'serum',
    price: 649,
    mrp: 699,
    stock: 100,
    description: 'Vitamin C super glow serum'
  },
  {
    name: 'Pigment Control Serum 30ml',
    category: 'serum',
    price: 599,
    mrp: 649,
    stock: 100,
    description: 'Even skin tone serum'
  },
  {
    name: 'Smooth Perfection Serum 30ml',
    category: 'serum',
    price: 599,
    mrp: 649,
    stock: 100,
    description: 'Smoothing serum'
  },
  {
    name: 'Radiance Cream 50G',
    category: 'cream',
    price: 549,
    mrp: 599,
    stock: 100,
    description: 'High potency Vitamin C cream'
  },
  {
    name: 'Lines & Wrinkles Serum 30ml',
    category: 'serum',
    price: 649,
    mrp: 699,
    stock: 100,
    description: 'Anti-aging serum'
  },
  {
    name: 'Anti Acne Face Wash 150ml',
    category: 'facewash',
    price: 349,
    mrp: 399,
    stock: 150,
    description: 'Salicylic acid face wash'
  },
  {
    name: 'Hair Therapy Serum 50ml',
    category: 'haircare',
    price: 699,
    mrp: 749,
    stock: 75,
    description: 'Hair growth serum'
  },
  {
    name: 'Lip Butter 15G',
    category: 'lipcare',
    price: 299,
    mrp: 349,
    stock: 150,
    description: 'Nourishing lip butter'
  }
];

// Public endpoint to import products (one-time use)
router.post('/init', async (req, res) => {
  try {
    // Check if products already exist
    const existingCount = await Bundle.countDocuments();
    
    if (existingCount > 0) {
      return res.json({
        success: false,
        message: `Database already has ${existingCount} products. Import skipped.`,
        count: existingCount
      });
    }

    // Import products
    const result = await Bundle.insertMany(SAMPLE_PRODUCTS);

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
      error: error.message
    });
  }
});

// Get import status
router.get('/status', async (req, res) => {
  try {
    const count = await Bundle.countDocuments();
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
