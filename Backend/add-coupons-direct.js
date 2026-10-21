require('dotenv').config();
const mongoose = require('mongoose');

// Direct connection without mongoose models
const connectionString = process.env.MONGO_URI;

console.log('🔄 Attempting to connect to MongoDB...\n');

mongoose.connect(connectionString, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ MongoDB Connected Successfully!\n');
  console.log('🔄 Adding coupons...\n');

  const db = mongoose.connection.db;
  const couponsCollection = db.collection('coupons');

  const coupons = [
    {
      code: 'BJA899',
      description: 'Buy any 3 products at ₹899 - Combo Deal (Except existing combo products)',
      type: 'fixed',
      discount: 0,
      minOrderValue: 0,
      usageLimit: null,
      usedCount: 0,
      perUserLimit: 10,
      validFrom: new Date('2026-10-21T00:00:00.000Z'),
      validTo: new Date('2025-12-31T23:59:59.999Z'),
      source: 'Excel Import',
      campaign: 'Combo Deals 2025',
      isActive: true,
      applicableCategories: [],
      excludedProducts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      code: 'B4A1199',
      description: 'Buy any 4 products at ₹1199 - Combo Deal (Except existing combo products)',
      type: 'fixed',
      discount: 0,
      minOrderValue: 0,
      usageLimit: null,
      usedCount: 0,
      perUserLimit: 10,
      validFrom: new Date('2026-10-21T00:00:00.000Z'),
      validTo: new Date('2025-12-31T23:59:59.999Z'),
      source: 'Excel Import',
      campaign: 'Combo Deals 2025',
      isActive: true,
      applicableCategories: [],
      excludedProducts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      code: 'B2A699',
      description: 'Buy any 2 products at ₹699 - Combo Deal (Except existing combo products)',
      type: 'fixed',
      discount: 0,
      minOrderValue: 0,
      usageLimit: null,
      usedCount: 0,
      perUserLimit: 10,
      validFrom: new Date('2026-10-21T00:00:00.000Z'),
      validTo: new Date('2025-12-31T23:59:59.999Z'),
      source: 'Excel Import',
      campaign: 'Combo Deals 2025',
      isActive: true,
      applicableCategories: [],
      excludedProducts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Check and insert each coupon
  for (const coupon of coupons) {
    try {
      const existing = await couponsCollection.findOne({ code: coupon.code });
      
      if (existing) {
        console.log(`⚠️  Coupon ${coupon.code} already exists. Updating...`);
        await couponsCollection.updateOne(
          { code: coupon.code },
          { $set: coupon }
        );
        console.log(`✅ Updated: ${coupon.code} - ${coupon.description}\n`);
      } else {
        await couponsCollection.insertOne(coupon);
        console.log(`✅ Added: ${coupon.code} - ${coupon.description}\n`);
      }
    } catch (error) {
      console.error(`❌ Error with ${coupon.code}:`, error.message);
    }
  }

  console.log('🎉 All coupons processed successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ BJA899  - Buy 3 at ₹899');
  console.log('✅ B4A1199 - Buy 4 at ₹1199');
  console.log('✅ B2A699  - Buy 2 at ₹699');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.connection.close();
  console.log('🔒 Database connection closed.');
  process.exit(0);
})
.catch(error => {
  console.error('❌ Connection Failed:', error.message);
  console.error('\n📋 Troubleshooting:');
  console.error('1. Check if MongoDB Atlas cluster is paused');
  console.error('2. Whitelist your IP: 0.0.0.0/0 in Network Access');
  console.error('3. Verify credentials in .env file');
  console.error('4. Try restarting the cluster\n');
  process.exit(1);
});
