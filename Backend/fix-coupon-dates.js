require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const fixCouponDates = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update all bundle coupons to expire on Dec 31, 2027
    const result = await Coupon.updateMany(
      { isBundle: true },
      {
        $set: {
          validFrom: new Date('2026-01-01T00:00:00.000Z'),
          validTo: new Date('2027-12-31T23:59:59.999Z')
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} coupons`);
    console.log('📅 New expiry date: December 31, 2027');

    // Verify
    const coupons = await Coupon.find({ isBundle: true });
    console.log('\n📋 Updated Coupons:');
    coupons.forEach(c => {
      const isExpired = new Date(c.validTo) < new Date();
      console.log(`  ${c.code}: Valid until ${c.validTo.toISOString().split('T')[0]} ${isExpired ? '❌ EXPIRED' : '✅ ACTIVE'}`);
    });

  } catch (error) {
    console.error('❌ Update failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

fixCouponDates();
