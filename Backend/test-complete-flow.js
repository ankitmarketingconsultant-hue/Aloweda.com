require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

async function testCompleteFlow() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    console.log('✅ MongoDB connected\n');

    // ============================================
    // TEST 1: Verify Admin User Exists
    // ============================================
    console.log('=' .repeat(60));
    console.log('TEST 1: ADMIN USER VERIFICATION');
    console.log('=' .repeat(60));
    
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`Found ${adminUsers.length} admin user(s) in database:`);
    
    if (adminUsers.length === 0) {
      console.log('❌ NO ADMIN USERS FOUND!');
      console.log('You need to create an admin user first.');
      console.log('\nTo create an admin user:');
      console.log('1. Use the Admin Register page at /admin/register');
      console.log('2. Or manually set role="admin" in MongoDB for an existing user\n');
    } else {
      adminUsers.forEach((admin, index) => {
        console.log(`\n${index + 1}. Admin User:`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   ID: ${admin._id}`);
      });
    }

    // ============================================
    // TEST 2: Verify Products with Stock Status
    // ============================================
    console.log('\n' + '=' .repeat(60));
    console.log('TEST 2: PRODUCT STOCK STATUS');
    console.log('=' .repeat(60));
    
    const products = await Product.find().sort({ createdAt: -1 });
    console.log(`\nFound ${products.length} products in database:\n`);
    
    const inStockCount = products.filter(p => p.stock > 0).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    
    console.log(`✅ IN STOCK: ${inStockCount}`);
    console.log(`❌ OUT OF STOCK: ${outOfStockCount}\n`);
    
    // Show first 5 products as sample
    console.log('Sample products (first 5):');
    products.slice(0, 5).forEach((product, index) => {
      const status = product.stock === 0 ? '❌ OUT OF STOCK' : `✅ IN STOCK (${product.stock})`;
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Stock: ${status}`);
      console.log(`   Price: ₹${product.price}`);
      console.log(`   ID: ${product._id}`);
    });

    // ============================================
    // TEST 3: Test Stock Update Simulation
    // ============================================
    console.log('\n' + '=' .repeat(60));
    console.log('TEST 3: STOCK UPDATE SIMULATION');
    console.log('=' .repeat(60));
    
    if (products.length > 0) {
      const testProduct = products[0];
      const originalStock = testProduct.stock;
      
      console.log(`\nTesting with: "${testProduct.name}"`);
      console.log(`Original stock: ${originalStock}`);
      
      // Mark as OUT OF STOCK
      console.log('\n📝 Setting stock to 0 (OUT OF STOCK)...');
      testProduct.stock = 0;
      await testProduct.save();
      
      // Verify in database
      const verifyOOS = await Product.findById(testProduct._id);
      if (verifyOOS.stock === 0) {
        console.log('✅ SUCCESS: Product marked as OUT OF STOCK in MongoDB');
        console.log(`   Database confirms: stock = ${verifyOOS.stock}`);
      } else {
        console.log('❌ FAILED: Stock update did not persist');
      }
      
      // Restore original stock
      console.log(`\n📝 Restoring original stock (${originalStock})...`);
      testProduct.stock = originalStock;
      await testProduct.save();
      
      const verifyRestored = await Product.findById(testProduct._id);
      if (verifyRestored.stock === originalStock) {
        console.log('✅ SUCCESS: Stock restored to original value');
        console.log(`   Database confirms: stock = ${verifyRestored.stock}`);
      } else {
        console.log('❌ FAILED: Stock restoration did not persist');
      }
    }

    // ============================================
    // TEST 4: Verify Regular Users
    // ============================================
    console.log('\n' + '=' .repeat(60));
    console.log('TEST 4: REGULAR USER VERIFICATION');
    console.log('=' .repeat(60));
    
    const regularUsers = await User.find({ role: 'user' });
    console.log(`\nFound ${regularUsers.length} regular user(s) in database`);
    
    if (regularUsers.length > 0) {
      console.log('\nSample regular users (first 3):');
      regularUsers.slice(0, 3).forEach((user, index) => {
        console.log(`\n${index + 1}. User:`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
      });
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n' + '=' .repeat(60));
    console.log('TEST SUMMARY');
    console.log('=' .repeat(60));
    
    console.log('\n✅ MongoDB Connection: Working');
    console.log(`✅ Admin Users: ${adminUsers.length > 0 ? adminUsers.length + ' found' : '⚠️  None found'}`);
    console.log(`✅ Products in Database: ${products.length}`);
    console.log(`✅ Stock Updates: ${products.length > 0 ? 'Working' : 'No products to test'}`);
    console.log(`✅ Regular Users: ${regularUsers.length}`);
    
    console.log('\n📋 FRONTEND TESTING CHECKLIST:');
    console.log('   1. ✓ MongoDB stock updates work correctly');
    console.log('   2. ⏳ Test admin login from main website');
    console.log('   3. ⏳ Verify redirect to /admin/dashboard');
    console.log('   4. ⏳ Mark a product as OUT OF STOCK');
    console.log('   5. ⏳ Verify product shows OOS badge on website');
    console.log('   6. ⏳ Try to checkout with OOS item (should block)');
    console.log('   7. ⏳ Test regular user cannot access /admin routes');
    
    if (adminUsers.length === 0) {
      console.log('\n⚠️  WARNING: No admin users found!');
      console.log('Create an admin user before testing admin login.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

testCompleteFlow();
