# Meta Pixel Setup - मार्केटिंग टीम के लिए गाइड 🎯

## क्या हो गया है? ✅

आपकी Aloweda वेबसाइट पर Meta (Facebook) Pixel पूरी तरह से इंस्टॉल और कॉन्फ़िगर हो गया है। अब यह 6 महत्वपूर्ण events को automatically track करेगा।

## Pixel ID
**आपका Pixel ID:** `1130650692951273`

## कौन से Events Track हो रहे हैं?

### 1. **PageView** (पेज व्यू)
- **कब होता है:** जब भी कोई वेबसाइट पर आता है
- **क्या track होता है:** सभी page visits

### 2. **ViewContent** (प्रोडक्ट देखा)
- **कब होता है:** जब कोई प्रोडक्ट की details देखता है
- **क्या track होता है:** 
  - प्रोडक्ट का नाम
  - कैटेगरी
  - कीमत
  - Product ID

### 3. **AddToCart** (कार्ट में जोड़ा)
- **कब होता है:** जब कोई "Add to Cart" button दबाता है
- **क्या track होता है:**
  - कौन सा प्रोडक्ट add किया
  - कितनी quantity
  - कुल कीमत

### 4. **InitiateCheckout** (चेकआउट शुरू किया)
- **कब होता है:** जब कोई checkout के लिए proceed करता है
- **क्या track होता है:**
  - Cart में क्या-क्या है
  - कितने items हैं
  - कुल amount

### 5. **AddPaymentInfo** (पेमेंट method चुना)
- **कब होता है:** जब COD या Online payment select करते हैं
- **क्या track होता है:**
  - कौन सा payment method चुना (COD/Online)
  - Order की total value

### 6. **Purchase** (खरीदारी पूरी हुई) 💰
- **कब होता है:** जब order successfully place होता है
- **क्या track होता है:**
  - Order ID
  - क्या-क्या खरीदा
  - कुल amount
  - Payment method

## Marketing के लिए फायदे 🎯

### 1. **Retargeting Campaigns बना सकते हैं**
- जिन्होंने product देखा पर cart में नहीं डाला → उन्हें ads दिखाओ
- जिन्होंने cart में डाला पर checkout नहीं किया → उन्हें reminder ads
- जिन्होंने checkout start किया पर complete नहीं किया → special offers

### 2. **Conversion Tracking**
- पूरा customer journey track कर सकते हैं:
  ```
  100 लोगों ने product देखा
      ↓
  40 ने cart में add किया (40% conversion)
      ↓
  25 ने checkout start किया (62.5% conversion)
      ↓
  20 ने order complete किया (80% conversion)
  ```

### 3. **Custom Audiences**
- Categories के हिसाब से audience बनाओ (Serum देखने वाले, Face Oil देखने वाले)
- Price range के हिसाब से (₹500-1000 range में देखने वाले)
- Cart abandoners (जिन्होंने cart में add किया पर buy नहीं किया)

### 4. **Lookalike Audiences**
- जिन्होंने खरीदा है उनके जैसे नए लोग ढूंढो
- Facebook automatically similar users को target करेगा

### 5. **Dynamic Product Ads**
- जो product किसी ने देखा था, वही ad में दिखाओ
- Personalized shopping experience

## कैसे Check करें कि सब काम कर रहा है? 🔍

### तरीका 1: Browser Console
1. Website खोलो
2. F12 दबाओ (Developer Tools)
3. Console tab में देखो
4. हर action पर green ✅ messages दिखेंगे:
   - `✅ Meta Pixel: ViewContent tracked`
   - `✅ Meta Pixel: AddToCart tracked`
   - वगैरह...

### तरीका 2: Meta Pixel Helper (सबसे आसान)
1. Chrome extension install करो: [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Website पर जाओ
3. Extension icon हरा हो जाएगा और बताएगा कि events fire हो रहे हैं

### तरीका 3: Facebook Events Manager
1. [Facebook Events Manager](https://business.facebook.com/events_manager2) पर जाओ
2. अपना Pixel select करो (`1130650692951273`)
3. "Test Events" tab में जाओ
4. Website पर actions करो
5. Real-time में events दिखेंगे

## अब क्या करना है? 📋

### Step 1: Verify करो (5 मिनट)
- [ ] Website पर जाओ
- [ ] एक product खोलो → ViewContent fire होना चाहिए
- [ ] Add to Cart करो → AddToCart fire होना चाहिए
- [ ] Checkout करो → InitiateCheckout fire होना चाहिए
- [ ] Payment method select करो → AddPaymentInfo fire होना चाहिए
- [ ] Test order place करो → Purchase fire होना चाहिए

### Step 2: Facebook Ads Manager में Setup (30 मिनट)
1. **Conversion Campaign बनाओ**
   - Objective: Conversions
   - Conversion Event: Purchase
   
2. **Custom Audiences बनाओ**
   - Product viewers (last 30 days)
   - Add to cart (last 14 days)
   - Checkout initiators (last 7 days)
   
3. **Lookalike Audiences**
   - Purchasers की 1% lookalike बनाओ

### Step 3: Retargeting Campaigns (1 घंटा)
1. **Cart Abandoners Campaign**
   - Target: जिन्होंने AddToCart किया पर Purchase नहीं
   - Offer: 10% extra discount
   
2. **Checkout Abandoners Campaign**
   - Target: जिन्होंने InitiateCheckout किया पर Purchase नहीं
   - Urgency message: "Complete your order in 24 hours"

3. **Product Viewers Campaign**
   - Target: जिन्होंने ViewContent किया पर AddToCart नहीं
   - Show: Same products they viewed

## Performance Monitor कैसे करें? 📊

### Weekly Check करो:
1. **Events Manager Dashboard** में जाओ
2. Check करो:
   - कितने PageViews हुए
   - कितने ViewContent events
   - कितने AddToCart
   - कितने Purchases
   
3. **Conversion Rate Calculate करो:**
   ```
   ViewContent → AddToCart conversion rate
   AddToCart → Purchase conversion rate
   ```

4. **Ad Performance देखो:**
   - किस campaign से ज्यादा purchases आ रहे
   - कौन सी audience ज्यादा convert कर रही है

## Important Tips 💡

1. ✅ **Events Test जरूर करो** - कोई भी campaign chalane से pehle
2. ✅ **Attribution Window Set करो** - 7-day click, 1-day view recommended
3. ✅ **Purchase को Primary Goal रखो** - बाकी सब intermediate metrics हैं
4. ✅ **Custom Conversions बनाओ** - specific products या categories के लिए
5. ✅ **Regular Monitor करो** - events सही fire हो रहे हैं या नहीं

## Common Issues & Solutions 🔧

### Problem: Events नहीं दिख रहे
**Solution:** 
- Ad blocker off करो
- Incognito mode में test करो
- Pixel Helper extension check करो

### Problem: Purchase event fire नहीं हो रहा
**Solution:**
- Browser console check करो for errors
- Test order place करके देखो
- Developer से confirm करो

### Problem: Wrong data track हो रaha
**Solution:**
- Console में exact values check करो
- Developer को screenshots भेजो

## Contact for Support 📞

अगर कोई problem हो या कुछ समझ नहीं आ रहा:
1. Browser console का screenshot लो
2. Problem detail में बताओ
3. Development team को escalate करो

---

## Summary - Quick Checklist ✅

- [x] Meta Pixel install हो गया है (Pixel ID: 1130650692951273)
- [x] 6 events track हो रहे हैं (PageView, ViewContent, AddToCart, InitiateCheckout, AddPaymentInfo, Purchase)
- [x] सभी events में proper data जा रहा है (product name, price, quantity, etc.)
- [ ] आपने test करके verify किया है
- [ ] Facebook Ads Manager में campaigns बनाने हैं
- [ ] Weekly performance monitor करना है

**Status:** 🟢 **LIVE & WORKING**

**Setup Date:** December 2024

अब आप पूरी confidence के साथ Facebook/Instagram ads चला सकते हैं और हर rupee का ROI track कर सकते हैं! 🚀

---

**Questions?** Development team से contact करें या Events Manager में "Test Events" section check करें।
