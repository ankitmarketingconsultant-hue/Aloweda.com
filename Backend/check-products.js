require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const products = await Product.find();
    
    console.log('✅ MongoDB Connected!');
    console.log('📦 Total products in database:', products.length);
    console.log('\n📋 Products list:\n');
    
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name}`);
      console.log(`   Category: ${p.category}`);
      console.log(`   Price: ₹${p.price} | MRP: ₹${p.mrp}`);
      console.log(`   Stock: ${p.stock}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProducts();
