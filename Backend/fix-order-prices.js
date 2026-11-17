/**
 * fix-order-prices.js
 * Fixes orders where item prices were saved as 0.499 instead of 499
 * Run once: node fix-order-prices.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Order    = require('./models/Order');

async function fixPrices() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const orders = await Order.find({});
  let fixedOrders = 0;
  let fixedItems  = 0;

  for (const order of orders) {
    let changed = false;

    // Fix item prices
    for (const item of order.items) {
      if (item.price > 0 && item.price < 10) {
        // e.g. 0.499 → 499, 0.549 → 549
        const fixed = Math.round(item.price * 1000);
        console.log(`  Order ${order.orderId} | "${item.name}" | ${item.price} → ${fixed}`);
        item.price = fixed;
        changed = true;
        fixedItems++;
      }
    }

    // Fix pricing totals if they also look wrong (< 100 for a product order)
    if (order.pricing) {
      if (order.pricing.subtotal > 0 && order.pricing.subtotal < 10) {
        order.pricing.subtotal = Math.round(order.pricing.subtotal * 1000);
        changed = true;
      }
      if (order.pricing.total > 0 && order.pricing.total < 100) {
        order.pricing.total = Math.round(order.pricing.total * 1000);
        changed = true;
      }
    }

    if (changed) {
      order.markModified('items');
      order.markModified('pricing');
      await order.save();
      fixedOrders++;
    }
  }

  console.log(`\n✅ Done! Fixed ${fixedItems} item prices across ${fixedOrders} orders.`);
  await mongoose.disconnect();
}

fixPrices().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
