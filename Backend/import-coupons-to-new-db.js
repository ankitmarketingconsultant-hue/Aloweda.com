require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');
const fs = require('fs');

async function importCoupons() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('Connection string:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    
    console.log('✅ MongoDB connected!');
    console.log('📁 Database:', mongoose.connection.name);

    // Read coupons from JSON file
    const couponsData = JSON.parse(fs.readFileSync('./coupons-import.json', 'utf8'));
    
    console.log(`\n📦 Found ${couponsData.length} coupons to import`);

    // Clear existing coupons (fresh start)
    const deleted = await Coupon.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} old coupons`);

    // Import new coupons
    const imported = await Coupon.insertMany(couponsData);
    console.log(`✅ Imported ${imported.length} coupons successfully!`);

    // Display imported coupons
    console.log('\n📋 Imported Coupons:');
    imported.forEach((coupon, index) => {
      console.log(`${index + 1}. ${coupon.code} - ${coupon.description}`);
    });

    console.log('\n✨ Coupons import completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

importCoupons();
