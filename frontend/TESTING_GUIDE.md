# Meta Pixel Testing Guide 🧪

## Quick Testing (5 minutes)

### Method 1: Browser Console Testing (Easiest)

1. **Open website in Chrome/Firefox**
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Run this command:**
   ```javascript
   testAllPixelEvents()
   ```

5. **Watch the output** - You should see:
   ```
   🚀 Starting Meta Pixel Event Testing...
   
   1️⃣ Testing ViewContent...
   ✅ ViewContent event fired
   
   2️⃣ Testing AddToCart...
   ✅ AddToCart event fired
   
   3️⃣ Testing InitiateCheckout...
   ✅ InitiateCheckout event fired
   
   4️⃣ Testing AddPaymentInfo...
   ✅ AddPaymentInfo event fired
   
   5️⃣ Testing Purchase...
   ✅ Purchase event fired
   
   ✅ All tests completed!
   ```

### Method 2: Manual User Flow Testing

#### Test 1: ViewContent Event
1. Go to website
2. Click on any product
3. Open Console (F12)
4. You should see: `✅ Meta Pixel: ViewContent tracked [Product Name]`

#### Test 2: AddToCart Event
1. On product page
2. Click "Add to Cart" button
3. Check Console
4. You should see: `✅ Meta Pixel: AddToCart tracked [Product Name] x [Quantity]`

#### Test 3: InitiateCheckout Event
1. Go to Cart page
2. Click "Proceed to Checkout"
3. Check Console
4. You should see: `✅ Meta Pixel: InitiateCheckout tracked [X] items, ₹ [Amount]`

#### Test 4: AddPaymentInfo Event
1. On checkout form
2. Select payment method (COD or Online)
3. Check Console
4. You should see: `✅ Meta Pixel: AddPaymentInfo tracked [COD/Online] ₹ [Amount]`

#### Test 5: Purchase Event
1. Complete the order
2. Check Console
3. You should see: `✅ Meta Pixel: Purchase tracked [Order ID] ₹ [Amount]`

### Method 3: Meta Pixel Helper Extension (Recommended)

1. **Install Extension:**
   - Chrome: https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc

2. **Use Extension:**
   - Click on extension icon (should turn green on your website)
   - Perform actions (view product, add to cart, etc.)
   - Extension will show popup with events fired

3. **Expected Results:**
   - PageView: Shows on every page
   - ViewContent: Shows on product page
   - AddToCart: Shows when adding to cart
   - InitiateCheckout: Shows when clicking checkout
   - AddPaymentInfo: Shows when selecting payment
   - Purchase: Shows when order completes

### Method 4: Facebook Events Manager (Most Accurate)

1. **Login to Facebook Business Manager**
2. **Go to Events Manager:**
   - URL: https://business.facebook.com/events_manager2
3. **Select your Pixel** (ID: 1130650692951273)
4. **Click "Test Events" tab**
5. **Enter your website URL** in the test field
6. **Perform actions on website**
7. **Watch events appear in real-time**

Expected Events in Order:
- ✅ PageView
- ✅ ViewContent (on product page)
- ✅ AddToCart (when clicking add to cart)
- ✅ InitiateCheckout (when starting checkout)
- ✅ AddPaymentInfo (when selecting payment)
- ✅ Purchase (when order completes)

## Troubleshooting

### Issue: No events showing in console

**Solutions:**
1. Make sure you're on the correct website
2. Hard refresh the page (Ctrl + Shift + R)
3. Clear browser cache
4. Check if ad blocker is disabled
5. Try incognito/private mode

### Issue: Events not in Facebook Events Manager

**Solutions:**
1. Check if Pixel ID is correct (1130650692951273)
2. Wait 5-10 minutes (sometimes delayed)
3. Check if you're in "Test Events" tab
4. Verify website URL is entered correctly
5. Try from different browser/device

### Issue: Purchase event not firing

**Solutions:**
1. Check browser console for errors
2. Verify order was successfully placed
3. Check if payment went through
4. Try with COD order (easier to test)

### Issue: Wrong values in events

**Solutions:**
1. Check product price format
2. Verify cart calculation is correct
3. Look for console errors
4. Take screenshot and share with dev team

## Individual Event Testing Commands

If you want to test specific events only:

```javascript
// Test if Pixel is loaded
checkPixelLoaded()

// Test ViewContent only
testViewContent()

// Test AddToCart only
testAddToCart()

// Test InitiateCheckout only
testInitiateCheckout()

// Test AddPaymentInfo only
testAddPaymentInfo()

// Test Purchase only
testPurchase()
```

## What to Check For

### ✅ Success Indicators:
- Green checkmarks in console (✅)
- Events showing in Pixel Helper (green icon)
- Events appearing in Facebook Events Manager
- Correct product names and prices
- Accurate order values

### ❌ Error Indicators:
- Red error messages in console
- "fbq is not defined" error
- Missing events in Pixel Helper
- Wrong prices or product info
- Events not in Events Manager after 15 minutes

## Best Practice Testing Flow

1. **First:** Use console command `testAllPixelEvents()` to verify Pixel works
2. **Second:** Do manual user flow to test real integration
3. **Third:** Use Pixel Helper to verify events during flow
4. **Fourth:** Check Events Manager after 5-10 minutes
5. **Finally:** Do a real test purchase (can cancel if COD)

## Pre-Launch Checklist

Before going live with marketing campaigns:

- [ ] Tested all 6 events manually
- [ ] Ran `testAllPixelEvents()` successfully
- [ ] Verified events in Pixel Helper
- [ ] Confirmed events in Facebook Events Manager
- [ ] Tested both COD and Online payment Purchase events
- [ ] Verified correct product names and prices
- [ ] Tested on mobile device
- [ ] Tested on different browsers (Chrome, Safari, Firefox)
- [ ] Confirmed with marketing team

## Sample Test Data

When running tests, these are the expected values:

**Test Product:**
- ID: TEST-PROD-001
- Name: Test Serum
- Category: Serum
- Price: ₹1,299

**Test Cart:**
- 2x Test Serum 1 @ ₹1,299 = ₹2,598
- 1x Test Face Oil @ ₹899 = ₹899
- Total: ₹3,497

## Common Questions

**Q: How long until events show in Facebook?**
A: Usually 5-10 minutes, but can take up to 1 hour during high traffic.

**Q: Do I need to test on production?**
A: Yes, but you can test in staging/development first if available.

**Q: Can I test with fake orders?**
A: Yes, but make sure to cancel/delete test orders from admin panel.

**Q: How do I know if Pixel is slowing down website?**
A: Meta Pixel loads asynchronously, so it won't slow down your site.

**Q: What if one event fails but others work?**
A: Check console for specific error, verify that code is present in that component.

---

**Need Help?**
- Check browser console first
- Use Pixel Helper extension
- Take screenshots of errors
- Contact dev team with details

**Status:** 🟢 All systems operational
