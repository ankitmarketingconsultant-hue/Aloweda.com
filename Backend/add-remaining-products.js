require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const REMAINING_PRODUCTS = [
  {
    name: 'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin & Niacinamide: Wrinkles & Lines Cream 50 G',
    category: 'cream',
    price: 549,
    mrp: 599,
    stock: 100,
    description: 'A high-performance advanced skin-correcting cream formulated to visibly reduce wrinkles, improve skin tone, and enhance overall radiance.',
    isActive: true
  },
  {
    name: 'Encapsulated Retinol 1 %, Grape Seed Extract, & Ceramides : Lines & Wrinkles Serum 30 ml',
    category: 'serum',
    price: 549,
    mrp: 599,
    stock: 100,
    description: 'A gentle yet effective encapsulated retinol renewal Serum designed to smooth, hydrate, and brighten the skin with minimal irritation.',
    isActive: true
  },
  {
    name: 'Niacinamide 10 %, Acetyl Glucosamine & Ceramides 30 ml Serum for Tone & Texture',
    category: 'serum',
    price: 599,
    mrp: 649,
    stock: 100,
    description: 'A targeted brightening and barrier-repair Serum formulated to improve uneven skin tone, refine texture, and boost overall radiance.',
    isActive: true
  },
  {
    name: 'Vitamin C 20%, Kojic Acid, Avocado Extract & Argan Oil : Radiance Cream 50 G',
    category: 'cream',
    price: 499,
    mrp: 549,
    stock: 100,
    description: 'A potent Vitamin C brightening cream formulated with 20% ascorbic acid to visibly enhance radiance, even out skin tone, and reduce the appearance of dullness and dark spots.',
    isActive: true
  },
  {
    name: 'Anti Acne Face wash: 100 ml, Salicylic Acid 2% for Oily & Acne Prone Skin',
    category: 'facewash',
    price: 225,
    mrp: 349,
    stock: 150,
    description: 'This face wash has Salicylic Acid 2% with Panthenol (Vitamin B3), Turmeric and Neem extract to help prevent bouts of pimples, treat pimples when active & help prevent scarring.',
    isActive: true
  }
];

async function addRemainingProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    console.log(`\n📦 Adding ${REMAINING_PRODUCTS.length} products...\n`);

    const result = await Product.insertMany(REMAINING_PRODUCTS);

    console.log(`✅ Successfully added ${result.length} products!`);
    console.log('\n📋 Added Products:\n');
    
    result.forEach((p, i) => {
      console.log(`${i+1}. ${p.name}`);
      console.log(`   Price: ₹${p.price} | Stock: ${p.stock}`);
      console.log('');
    });

    const totalCount = await Product.countDocuments();
    console.log(`\n🎉 Total products in database: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addRemainingProducts();
