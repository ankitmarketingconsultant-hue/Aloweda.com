/**
 * Meta Pixel Testing Utility
 * 
 * Use this in browser console to verify all Meta Pixel events are working correctly
 * 
 * Usage in Browser Console:
 * 1. Open Developer Tools (F12)
 * 2. Go to Console tab
 * 3. Run: testAllPixelEvents()
 */

// Test sample data
const testProduct = {
  id: 'TEST-PROD-001',
  name: 'Test Serum',
  category: 'Serum',
  price: '₹1,299'
};

const testCart = [
  {
    id: 'TEST-PROD-001',
    name: 'Test Serum 1',
    category: 'Serum',
    price: '₹1,299',
    quantity: 2
  },
  {
    id: 'TEST-PROD-002',
    name: 'Test Face Oil',
    category: 'Face Oil',
    price: '₹899',
    quantity: 1
  }
];

// Check if Meta Pixel is loaded
export const checkPixelLoaded = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('✅ Meta Pixel is loaded correctly');
    console.log('Pixel function:', window.fbq);
    return true;
  } else {
    console.error('❌ Meta Pixel is NOT loaded');
    console.log('Make sure the pixel code is in index.html');
    return false;
  }
};

// Test ViewContent event
export const testViewContent = () => {
  if (!checkPixelLoaded()) return;
  
  console.log('🧪 Testing ViewContent event...');
  
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: testProduct.name,
      content_category: testProduct.category,
      content_ids: [testProduct.id],
      content_type: 'product',
      value: 1299,
      currency: 'INR'
    });
    console.log('✅ ViewContent event fired');
  }
};

// Test AddToCart event
export const testAddToCart = () => {
  if (!checkPixelLoaded()) return;
  
  console.log('🧪 Testing AddToCart event...');
  
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: testProduct.name,
      content_category: testProduct.category,
      content_ids: [testProduct.id],
      content_type: 'product',
      value: 1299,
      currency: 'INR',
      quantity: 1
    });
    console.log('✅ AddToCart event fired');
  }
};

// Test InitiateCheckout event
export const testInitiateCheckout = () => {
  if (!checkPixelLoaded()) return;
  
  console.log('🧪 Testing InitiateCheckout event...');
  
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: testCart.map(item => item.id),
      content_type: 'product',
      value: 3497,
      currency: 'INR',
      num_items: 3
    });
    console.log('✅ InitiateCheckout event fired');
  }
};

// Test AddPaymentInfo event
export const testAddPaymentInfo = () => {
  if (!checkPixelLoaded()) return;
  
  console.log('🧪 Testing AddPaymentInfo event...');
  
  if (window.fbq) {
    window.fbq('track', 'AddPaymentInfo', {
      content_ids: testCart.map(item => item.id),
      content_type: 'product',
      value: 3497,
      currency: 'INR',
      num_items: 3,
      payment_method: 'Online'
    });
    console.log('✅ AddPaymentInfo event fired');
  }
};

// Test Purchase event
export const testPurchase = () => {
  if (!checkPixelLoaded()) return;
  
  console.log('🧪 Testing Purchase event...');
  
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      content_ids: testCart.map(item => item.id),
      content_type: 'product',
      value: 3497,
      currency: 'INR',
      num_items: 3,
      order_id: 'TEST-ORDER-' + Date.now(),
      payment_method: 'Online'
    });
    console.log('✅ Purchase event fired');
  }
};

// Test all events at once
export const testAllPixelEvents = () => {
  console.log('🚀 Starting Meta Pixel Event Testing...\n');
  
  if (!checkPixelLoaded()) {
    console.error('❌ Cannot proceed - Meta Pixel not loaded');
    return;
  }
  
  console.log('Testing all 5 events in sequence:\n');
  
  setTimeout(() => {
    console.log('1️⃣ Testing ViewContent...');
    testViewContent();
  }, 1000);
  
  setTimeout(() => {
    console.log('\n2️⃣ Testing AddToCart...');
    testAddToCart();
  }, 2000);
  
  setTimeout(() => {
    console.log('\n3️⃣ Testing InitiateCheckout...');
    testInitiateCheckout();
  }, 3000);
  
  setTimeout(() => {
    console.log('\n4️⃣ Testing AddPaymentInfo...');
    testAddPaymentInfo();
  }, 4000);
  
  setTimeout(() => {
    console.log('\n5️⃣ Testing Purchase...');
    testPurchase();
  }, 5000);
  
  setTimeout(() => {
    console.log('\n✅ All tests completed!');
    console.log('\n📊 Next Steps:');
    console.log('1. Check Meta Pixel Helper extension (should show 5 events)');
    console.log('2. Go to Facebook Events Manager → Test Events tab');
    console.log('3. You should see all 5 events listed there');
    console.log('\nIf you see all events, Meta Pixel is working correctly! 🎉');
  }, 6000);
};

// Make functions available in browser console
if (typeof window !== 'undefined') {
  window.testAllPixelEvents = testAllPixelEvents;
  window.testViewContent = testViewContent;
  window.testAddToCart = testAddToCart;
  window.testInitiateCheckout = testInitiateCheckout;
  window.testAddPaymentInfo = testAddPaymentInfo;
  window.testPurchase = testPurchase;
  window.checkPixelLoaded = checkPixelLoaded;
  
  console.log('🧪 Meta Pixel Test Utilities loaded!');
  console.log('Run: testAllPixelEvents() to test all events');
}
