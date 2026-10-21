// Add coupons via API call
const coupons = [
  {
    code: 'BJA899',
    description: 'Buy any 3 products at ₹899 - Combo Deal (Except existing combo products)',
    type: 'fixed',
    discount: 0,
    minOrderValue: 0,
    usageLimit: null,
    perUserLimit: 10,
    validFrom: new Date().toISOString(),
    validTo: new Date('2025-12-31').toISOString(),
    isActive: true,
    source: 'Excel Import',
    campaign: 'Combo Deals 2025'
  },
  {
    code: 'B4A1199',
    description: 'Buy any 4 products at ₹1199 - Combo Deal (Except existing combo products)',
    type: 'fixed',
    discount: 0,
    minOrderValue: 0,
    usageLimit: null,
    perUserLimit: 10,
    validFrom: new Date().toISOString(),
    validTo: new Date('2025-12-31').toISOString(),
    isActive: true,
    source: 'Excel Import',
    campaign: 'Combo Deals 2025'
  },
  {
    code: 'B2A699',
    description: 'Buy any 2 products at ₹699 - Combo Deal (Except existing combo products)',
    type: 'fixed',
    discount: 0,
    minOrderValue: 0,
    usageLimit: null,
    perUserLimit: 10,
    validFrom: new Date().toISOString(),
    validTo: new Date('2025-12-31').toISOString(),
    isActive: true,
    source: 'Excel Import',
    campaign: 'Combo Deals 2025'
  }
];

console.log('\n📋 Coupons to be added:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(JSON.stringify(coupons, null, 2));
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n✅ Coupon data ready!');
console.log('\n📝 Instructions:');
console.log('1. Make sure your backend server is running');
console.log('2. Login as admin');
console.log('3. Use the API endpoint: POST /api/coupons');
console.log('4. Send each coupon data in the request body');
console.log('\nOr you can add these directly in MongoDB Compass/Atlas');
