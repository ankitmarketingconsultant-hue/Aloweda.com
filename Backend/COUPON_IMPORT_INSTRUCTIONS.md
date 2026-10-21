# 🎟️ Coupon Import Instructions

## ✅ Your 3 Coupons Ready to Import:

1. **BJA899** - Buy any 3 at ₹899
2. **B4A1199** - Buy any 4 at ₹1199  
3. **B2A699** - Buy any 2 at ₹699

---

## 📝 Method 1: Import via MongoDB Atlas (Recommended)

### Steps:
1. **Open MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login** with your credentials
3. **Navigate to your cluster**: `cluster0.zvplwpb.mongodb.net`
4. Click **"Browse Collections"**
5. Find or create collection: **`coupons`**
6. Click **"Insert Document"**
7. Switch to **"JSON View"**
8. **Copy the content** from `coupons-import.json` file
9. **Paste** and click **"Insert"**
10. ✅ Done! Repeat for all 3 coupons

---

## 📝 Method 2: Import via MongoDB Compass

### Steps:
1. **Open MongoDB Compass**
2. **Connect** using connection string:
   ```
   mongodb+srv://aloweda_admin:Aloweda2024@cluster0.zvplwpb.mongodb.net/aloweda
   ```
3. **Select database**: `aloweda`
4. **Select collection**: `coupons` (or create it)
5. Click **"Add Data"** → **"Import JSON/CSV"**
6. Select file: **`coupons-import.json`**
7. Click **"Import"**
8. ✅ Done!

---

## 📝 Method 3: Via Backend API (When Server is Running)

### Prerequisites:
- Backend server must be running
- You must be logged in as Admin
- Get your admin JWT token

### API Request:
```bash
POST https://your-backend-url.vercel.app/api/coupons
Headers:
  Authorization: Bearer YOUR_ADMIN_TOKEN
  Content-Type: application/json

Body: (Send one coupon at a time)
{
  "code": "BJA899",
  "description": "Buy any 3 products at ₹899 - Combo Deal",
  "type": "fixed",
  "discount": 0,
  "minOrderValue": 0,
  "validTo": "2025-12-31",
  "isActive": true
}
```

Repeat for B4A1199 and B2A699.

---

## 📝 Method 4: Direct Script (Requires Internet)

If your internet is working and MongoDB Atlas is accessible:

```bash
cd Backend
node add-coupons.js
```

---

## ⚠️ Current Issue

**Network Error**: `ENOTFOUND _mongodb._tcp.cluster0.zvplwpb.mongodb.net`

This means:
- ❌ No internet connection, OR
- ❌ MongoDB Atlas cluster is paused/stopped, OR
- ❌ Your IP address is not whitelisted in MongoDB Atlas

### Solution:
1. Check internet connection
2. Login to MongoDB Atlas
3. Check if cluster is running
4. Go to **Network Access** → Add your IP address (or allow `0.0.0.0/0` for development)

---

## ✨ Verify Coupons Added

After importing, verify by:

1. **Via API**:
   ```bash
   GET https://your-backend-url.vercel.app/api/coupons
   Authorization: Bearer YOUR_ADMIN_TOKEN
   ```

2. **Via MongoDB Atlas/Compass**:
   - Open `aloweda` database
   - Check `coupons` collection
   - You should see 3 documents

---

## 📋 Coupon Details Reference

| Code    | Description                | Cart Value | Products |
|---------|----------------------------|------------|----------|
| BJA899  | Buy 3 at ₹899              | Shows ₹899 | Any 3    |
| B4A1199 | Buy 4 at ₹1199             | Shows ₹1199| Any 4    |
| B2A699  | Buy 2 at ₹699              | Shows ₹699 | Any 2    |

**Note**: "Except combos" means these coupons don't apply to products that are already part of existing combo deals.

---

## 🎯 Next Steps

After importing coupons:
1. ✅ Test coupon validation API
2. ✅ Implement frontend coupon input field
3. ✅ Create Coupon Management admin page
4. ✅ Add coupon analytics dashboard

---

**File Created**: `coupons-import.json` (Ready to import!)
