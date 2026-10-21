require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

// Connect to MongoDB with timeout and retry
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Connected ✅\n');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    console.error('\n⚠️  Please check:');
    console.error('   1. Internet connection');
    console.error('   2. MongoDB Atlas cluster is running');
    console.error('   3. IP address is whitelisted in MongoDB Atlas');
    console.error('   4. MONGO_URI in .env file is correct\n');
    process.exit(1);
  }
}

// Start connection
connectDB().then(() => {
  // Continue after connection
}).catch(err => {
  console.error('Failed to connect:', err);
  process.exit(1);
});

// Coupon data from Excel
const coupons = [
  {
    code: 'BJA899',
    description: 'Buy any 3 products at ₹899 (Combo Deal)',
    type: 'fixed',
    discount: 0, // Special combo pricing, not discount-based
    minOrderValue: 0,
    usageLimit: null, // Unlimited
    perUserLimit: 10,
    validFrom: new Date(),
    validTo: new Date('2025-12-31'), // Valid till end of 2025
    isActive: true,
    source: 'Excel Import',
    campaign: 'Combo Deals 2025'
  },
  {
    code: 'B4A1199',
    description: 'Buy any 4 products at ₹1199 (Combo Deal)',
    type: 'fixed',
    discount: 0,
    minOrderValue: 0,
    usageLimit: null,
    perUserLimit: 10,
    validFrom: new Date(),
    validTo: new Date('2025-12-31'),
    isActive: true,
    source: 'Excel Import',
    campaign: 'Combo Deals 2025'
  },
  {
    code: 'B2A699',
    description: 'Buy any 2 products at ₹699 (Combo Deal)',
    type: 'fixed',
    discount: 0,
    minOrderValue: 0,
    usageLimit: null,
    perUserLimit: 10,
    validFrom: new Date(),
    validTo: new Date('2025-12-31'),
    isActive: true,
    source: 'Excel Import',
    campaign: 'Combo Deals 2025'
  }
];

async function addCoupons() {
  try {
    console.log('🔄 Adding coupons to database...\n');

    for (const couponData of coupons) {
      // Check if coupon already exists
      const existingCoupon = await Coupon.findOne({ code: couponData.code });
      
      if (existingCoupon) {
        console.log(`⚠️  Coupon ${couponData.code} already exists. Updating...`);
        await Coupon.findOneAndUpdate(
          { code: couponData.code },
          couponData,
          { new: true }
        );
        console.log(`✅ Updated: ${couponData.code} - ${couponData.description}\n`);
      } else {
        const coupon = new Coupon(couponData);
        await coupon.save();
        console.log(`✅ Added: ${couponData.code} - ${couponData.description}\n`);
      }
    }

    console.log('🎉 All coupons added successfully!');
    console.log('\n📋 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('CODE      | DESCRIPTION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('BJA899    | Buy any 3 at ₹899');
    console.log('B4A1199   | Buy any 4 at ₹1199');
    console.log('B2A699    | Buy any 2 at ₹699');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✨ All coupons are now active and ready to use!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding coupons:', error.message);
    process.exit(1);
  }
}

// Run the script after connection is established
(async () => {
  await connectDB();
  await addCoupons();
})();
