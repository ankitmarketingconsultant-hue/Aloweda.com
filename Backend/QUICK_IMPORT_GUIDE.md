# ⚡ QUICK IMPORT GUIDE - Add Coupons in 2 Minutes!

## 🎯 Choose Your Method:

---

## ✅ METHOD 1: MongoDB Atlas Web Interface (EASIEST!)

### **Steps:**

1. **Open MongoDB Atlas**
   ```
   https://cloud.mongodb.com/
   ```

2. **Login with your credentials**

3. **Navigate to Collections**
   - Click "Database" → "Browse Collections"
   - Select cluster: `cluster0.zvplwpb`
   - Database: `aloweda`

4. **Find or Create `coupons` Collection**
   - If `coupons` collection doesn't exist, create it
   - Click on `coupons` collection

5. **Insert First Coupon (BJA899)**
   - Click **"INSERT DOCUMENT"** button
   - Toggle to **"{} JSON View"**
   - Paste this:
   ```json
   {
     "code": "BJA899",
     "description": "Buy any 3 products at ₹899 - Combo Deal",
     "type": "fixed",
     "discount": 0,
     "minOrderValue": 0,
     "usageLimit": null,
     "usedCount": 0,
     "perUserLimit": 10,
     "validFrom": {"$date": "2026-10-21T00:00:00.000Z"},
     "validTo": {"$date": "2025-12-31T23:59:59.999Z"},
     "source": "Excel Import",
     "campaign": "Combo Deals 2025",
     "isActive": true,
     "applicableCategories": [],
     "excludedProducts": []
   }
   ```
   - Click **"Insert"**

6. **Repeat for B4A1199** (Change code and description to "Buy any 4 at ₹1199")

7. **Repeat for B2A699** (Change code and description to "Buy any 2 at ₹699")

✅ **DONE!**

---

## ✅ METHOD 2: Using mongoimport (Command Line)

**If you have MongoDB Database Tools installed:**

```bash
cd c:\Users\mahaj\Aloweda\Aloweda\Backend
mongoimport --uri "mongodb+srv://aloweda_admin:Aloweda2024@cluster0.zvplwpb.mongodb.net/aloweda" --collection coupons --file coupons-import.json --jsonArray
```

**Or double-click:** `import-coupons.bat`

---

## ✅ METHOD 3: Using MongoDB Shell (mongosh)

1. **Open Command Prompt**

2. **Connect to MongoDB:**
   ```bash
   mongosh "mongodb+srv://aloweda_admin:Aloweda2024@cluster0.zvplwpb.mongodb.net/aloweda"
   ```

3. **Copy-paste this:**
   ```javascript
   db.coupons.insertMany([
     {
       code: "BJA899",
       description: "Buy any 3 products at ₹899 - Combo Deal",
       type: "fixed",
       discount: 0,
       minOrderValue: 0,
       usageLimit: null,
       usedCount: 0,
       perUserLimit: 10,
       validFrom: new Date("2026-10-21"),
       validTo: new Date("2025-12-31"),
       source: "Excel Import",
       campaign: "Combo Deals 2025",
       isActive: true,
       applicableCategories: [],
       excludedProducts: []
     },
     {
       code: "B4A1199",
       description: "Buy any 4 products at ₹1199 - Combo Deal",
       type: "fixed",
       discount: 0,
       minOrderValue: 0,
       usageLimit: null,
       usedCount: 0,
       perUserLimit: 10,
       validFrom: new Date("2026-10-21"),
       validTo: new Date("2025-12-31"),
       source: "Excel Import",
       campaign: "Combo Deals 2025",
       isActive: true,
       applicableCategories: [],
       excludedProducts: []
     },
     {
       code: "B2A699",
       description: "Buy any 2 products at ₹699 - Combo Deal",
       type: "fixed",
       discount: 0,
       minOrderValue: 0,
       usageLimit: null,
       usedCount: 0,
       perUserLimit: 10,
       validFrom: new Date("2026-10-21"),
       validTo: new Date("2025-12-31"),
       source: "Excel Import",
       campaign: "Combo Deals 2025",
       isActive: true,
       applicableCategories: [],
       excludedProducts: []
     }
   ]);
   ```

4. **Press Enter**

✅ **DONE!**

---

## 🔍 Verify Coupons Added

**In MongoDB Atlas:**
- Go to Collections → `aloweda` → `coupons`
- You should see 3 documents with codes: BJA899, B4A1199, B2A699

**Or test via API:**
```bash
curl http://localhost:5000/api/coupons \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 📋 Summary

**3 Coupons to Add:**
1. ✅ BJA899 - Buy 3 at ₹899
2. ✅ B4A1199 - Buy 4 at ₹1199
3. ✅ B2A699 - Buy 2 at ₹699

**Files Ready:**
- ✅ `coupons-import.json` - Ready to import
- ✅ `import-coupons.bat` - Windows batch script
- ✅ `import-via-mongosh.js` - MongoDB Shell script
- ✅ `add-coupons.html` - Browser tool

---

## 🎯 RECOMMENDED: Use MongoDB Atlas Web Interface

**Why?**
- ✅ No command line needed
- ✅ Visual confirmation
- ✅ Easy copy-paste
- ✅ Works from anywhere
- ✅ Takes only 2 minutes!

**Go to:** https://cloud.mongodb.com/ 🚀
