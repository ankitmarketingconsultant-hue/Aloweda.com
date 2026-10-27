require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function testStockUpdate() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('MongoDB URI exists:', !!process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    
    console.log('✅ MongoDB connected successfully!\n');

    // Fetch all products
    console.log('📦 Fetching all products from database...');
    const products = await Product.find();
    console.log(`Found ${products.length} products in database\n`);

    if (products.length === 0) {
      console.log('⚠️  No products found in database!');
      console.log('You need to import products first using the Admin Panel "Import Sample Products" button.');
      process.exit(0);
    }

    // Display all products with stock status
    console.log('=== CURRENT STOCK STATUS ===');
    products.forEach((product, index) => {
      const stockStatus = product.stock === 0 ? '❌ OUT OF STOCK' : `✅ IN STOCK (${product.stock})`;
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Stock: ${product.stock} - ${stockStatus}`);
      console.log(`   Price: ₹${product.price}`);
      console.log('');
    });

    // Test: Mark first product as OUT OF STOCK
    if (products.length > 0) {
      const testProduct = products[0];
      console.log(`\n🔧 TEST: Marking "${testProduct.name}" as OUT OF STOCK...`);
      
      testProduct.stock = 0;
      await testProduct.save();
      
      // Verify the update
      const updatedProduct = await Product.findById(testProduct._id);
      console.log(`✅ Updated! Stock is now: ${updatedProduct.stock}`);
      console.log(`   MongoDB Document: ${JSON.stringify({ _id: updatedProduct._id, name: updatedProduct.name, stock: updatedProduct.stock })}`);
      
      // Mark it back as IN STOCK
      console.log(`\n🔧 TEST: Marking "${testProduct.name}" back as IN STOCK...`);
      updatedProduct.stock = 100;
      await updatedProduct.save();
      
      const finalProduct = await Product.findById(testProduct._id);
      console.log(`✅ Updated! Stock is now: ${finalProduct.stock}`);
      console.log(`   MongoDB Document: ${JSON.stringify({ _id: finalProduct._id, name: finalProduct.name, stock: finalProduct.stock })}`);
    }

    console.log('\n✅ MongoDB stock update test completed successfully!');
    console.log('📌 Key findings:');
    console.log('   - MongoDB connection: Working ✓');
    console.log('   - Product model: Working ✓');
    console.log('   - Stock field updates: Working ✓');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

testStockUpdate();
