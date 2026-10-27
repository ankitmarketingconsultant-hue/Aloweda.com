require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const migrateBundleCoupons = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Bundle coupon definitions
    const bundleCoupons = [
      { code: 'B2A699', quantity: 2, price: 699 },
      { code: 'B3A899', quantity: 3, price: 899 },
      { code: 'B4A1199', quantity: 4, price: 1199 }
    ];

    let updatedCount = 0;

    for (const bundle of bundleCoupons) {
      const result = await Coupon.updateOne(
        { code: bundle.code },
        {
          $set: {
            isBundle: true,
            bundleQuantity: bundle.quantity,
            bundlePrice: bundle.price,
            type: 'fixed',
            discount: 0
          }
        }
      );

      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(`✅ Updated ${bundle.code}: ${bundle.quantity} items for ₹${bundle.price}`);
      } else {
        console.log(`ℹ️  ${bundle.code} already updated or not found`);
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${updatedCount} bundle coupons`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

migrateBundleCoupons();
