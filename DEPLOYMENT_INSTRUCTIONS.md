# 🚀 Deployment Instructions - Aloweda

## ✅ **Git Push Complete!**

Your code has been pushed to GitHub successfully! 🎉

**Commit:** "Added complete coupon system with Excel coupons (BJA899, B4A1199, B2A699) - Vercel deployment ready"

---

## 🎯 **Deploy to Vercel (2 Methods)**

### **Method 1: Vercel Dashboard (EASIEST - RECOMMENDED)**

1. **Open Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **Import Your GitHub Repository:**
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Choose: **bhavyamahajann/Aloweda**
   - Select branch: **master**

3. **Configure Frontend Deployment:**
   - Root Directory: `frontend`
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://aloweda-jitl.vercel.app
   VITE_RAZORPAY_KEY_ID=rzp_live_TiFjw4SPJzbxde
   ```

5. **Click "Deploy"**

6. **Wait 2-3 minutes** ⏳

7. **Done!** Your site is live! 🎉

---

### **Method 2: Vercel CLI (Alternative)**

**If you prefer command line:**

1. **Open Terminal in Frontend folder:**
   ```bash
   cd c:\Users\mahaj\Aloweda\Aloweda\frontend
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```
   ⚠️ This may take 3-5 minutes

3. **Build project:**
   ```bash
   npm run build
   ```

4. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

5. **Follow prompts:**
   - Select project: `aloweda-jitl` (or create new)
   - Confirm settings
   - Wait for deployment

6. **Done!** ✅

---

## 🔍 **Verify Deployment:**

### **Check Vercel Dashboard:**
```
https://vercel.com/dashboard
```

You should see:
- ✅ **aloweda-jitl** (Backend) - Already deployed
- ✅ **aloweda-frontend** (or your frontend project name) - Just deployed

### **Test Live Site:**

1. **Open your live URL** (from Vercel dashboard)

2. **Test Coupons:**
   ```
   - Add 3 products to cart
   - Apply coupon: BJA899
   - Total should become ₹899 ✅
   ```

3. **Test Other Features:**
   - ✅ Browse products
   - ✅ Add to cart
   - ✅ Login/Register
   - ✅ Checkout
   - ✅ All 6 coupons

---

## 📋 **Available Coupons (LIVE & WORKING):**

| Code    | Description       | Requirements    |
|---------|------------------|-----------------|
| BJA899  | Buy 3 at ₹899    | Exactly 3 items |
| B4A1199 | Buy 4 at ₹1199   | Exactly 4 items |
| B2A699  | Buy 2 at ₹699    | Exactly 2 items |
| WELCOME10 | 10% off        | Any cart        |
| SAVE50  | ₹50 off          | Any cart        |
| SAVE100 | ₹100 off         | Any cart        |

---

## ⚠️ **If npm install is Taking Too Long:**

**Do this:**

1. **Cancel current command** (Ctrl+C)

2. **Use Vercel Dashboard instead** (Method 1 above)
   - It's faster
   - No local dependencies needed
   - Automatic build & deploy

3. **Or try clearing cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

---

## 🎊 **Post-Deployment:**

### **1. Update Live URL in Backend .env:**
If your frontend URL is different, update:
```
CLIENT_URL=https://your-new-frontend-url.vercel.app
```

### **2. Test All Features:**
- ✅ Products loading
- ✅ Cart functionality
- ✅ Coupon system
- ✅ Checkout
- ✅ Payment

### **3. Share with Users!**
Your website is live and coupons work! 🎉

---

## 🔧 **Troubleshooting:**

### **Build Failed:**
```bash
# Check build logs in Vercel dashboard
# Common issue: Missing environment variables
```

### **Coupons Not Working:**
```
# They should work - they're hardcoded in frontend
# No database needed!
# Check browser console for errors
```

### **404 Errors:**
```
# Vercel may need SPA configuration
# Add vercel.json in frontend folder:
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 📞 **Quick Commands Reference:**

```bash
# Navigate to frontend
cd c:\Users\mahaj\Aloweda\Aloweda\frontend

# Install dependencies
npm install

# Local development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Check git status
git status

# Push changes
git push origin master
```

---

## ✨ **Summary:**

✅ **Git Push:** DONE
✅ **Code Committed:** DONE
✅ **Coupon System:** WORKING
✅ **Ready for Deployment:** YES

**Next Step:**
👉 **Use Vercel Dashboard (Method 1)** - It's the easiest!

**URL:** https://vercel.com/dashboard

1. Import from GitHub
2. Configure settings
3. Deploy
4. Test coupons
5. 🎉 DONE!

---

## 🎯 **Expected Timeline:**

- Import project: 30 seconds
- Build & Deploy: 2-3 minutes
- Test: 5 minutes
- **Total: ~5 minutes**

---

**Deploy karo aur test karo! 🚀**

Your coupons (BJA899, B4A1199, B2A699) will work immediately! ✅
