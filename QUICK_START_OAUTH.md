# Quick Start: Google OAuth Setup

## 5-Minute Setup Guide

### 1️⃣ Google Cloud Console (5 min)
```
1. Go to: console.cloud.google.com
2. Create Project → "Aloweda"
3. APIs & Services → Credentials
4. Create OAuth Client ID → Web Application
5. Add URIs:
   - http://localhost:5000/api/auth/google/callback
   - Your production URL
6. Copy Client ID & Secret
```

### 2️⃣ Update .env File (1 min)
```bash
cd Backend
# Edit .env file and add:
GOOGLE_CLIENT_ID=paste_your_client_id
GOOGLE_CLIENT_SECRET=paste_your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### 3️⃣ Verify & Test (2 min)
```bash
# Verify configuration
node verify-google-oauth.js

# Start backend
npm start

# In another terminal, start frontend
cd ../frontend
npm run dev

# Open browser and test Google sign-in!
```

## That's It! 🎉

Your Google OAuth is now functional.

## Common Issues

❌ **"Popup blocked"** → Enable popups in browser
❌ **"redirect_uri_mismatch"** → Check callback URL matches exactly
❌ **"unauthorized_client"** → OAuth consent screen not configured

## Production Checklist

- [ ] Update callback URL in .env
- [ ] Update redirect URIs in Google Console
- [ ] Use HTTPS
- [ ] Publish OAuth app
- [ ] Test with real users

## Need Help?

📖 Full guide: `GOOGLE_OAUTH_SETUP.md`
🔍 Verify setup: `node verify-google-oauth.js`
