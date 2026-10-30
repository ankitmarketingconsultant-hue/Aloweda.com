# Google OAuth Setup Guide for Aloweda

## Overview
This guide will help you set up Google OAuth for your Aloweda e-commerce application.

## Prerequisites
- Google Cloud Console account
- Your application running on a domain (or localhost for testing)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a Project" → "New Project"
3. Enter project name: "Aloweda" or any name you prefer
4. Click "Create"

## Step 2: Enable Google+ API

1. In your project dashboard, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" (unless you have Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - **App name**: Aloweda
   - **User support email**: Your email
   - **App logo**: (Optional) Upload Aloweda logo
   - **Application home page**: https://aloweda-smoky.vercel.app
   - **Developer contact information**: Your email
5. Click "Save and Continue"
6. On "Scopes" page, click "Add or Remove Scopes"
7. Select these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
8. Click "Save and Continue"
9. On "Test users" page (if in testing mode), add your test email addresses
10. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - **Name**: Aloweda Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5000` (for local development)
     - `https://aloweda-smoky.vercel.app` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback` (local)
     - `https://your-backend-domain.com/api/auth/google/callback` (production)
5. Click "Create"
6. **IMPORTANT**: Save your Client ID and Client Secret

## Step 5: Update Backend Environment Variables

Edit your `Backend/.env` file and update these values:

```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=AlowedaSecureSessionSecret2024
```

**For Production:**
```env
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
```

## Step 6: Deploy and Test

### Local Testing:
1. Start your backend: `cd Backend && npm start`
2. Start your frontend: `cd frontend && npm run dev`
3. Click "Sign in with Google" button
4. Authorize the application
5. You should be logged in!

### Production Deployment:
1. Update your production `.env` with the correct callback URL
2. Deploy your backend to Vercel/Heroku/etc.
3. Update the authorized redirect URIs in Google Cloud Console with your production URL
4. Deploy frontend
5. Test the Google sign-in flow

## Step 7: Publish OAuth App (When Ready)

1. Go back to "OAuth consent screen"
2. Click "Publish App"
3. This removes the "unverified app" warning

## Security Notes

⚠️ **NEVER commit your `.env` file to Git**
⚠️ **Keep your Client Secret secure**
⚠️ **Use HTTPS in production**
⚠️ **Regularly rotate your secrets**

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure your callback URL in `.env` exactly matches the one in Google Cloud Console
- Include protocol (http:// or https://)
- Don't forget trailing slashes if they're in the console

### Error: "access_denied"
- Make sure the user's email is added as a test user (if app is in testing mode)
- Check if the required scopes are enabled

### Popup blocked
- Users need to allow popups for your site
- Add a message telling users to enable popups if blocked

## Current Implementation Status

✅ Backend routes created
✅ Passport.js configured
✅ User model updated to support Google OAuth
✅ Frontend Google sign-in button functional
✅ Session management configured
✅ Mobile sign-up toggle visible

## Next Steps

1. Get Google OAuth credentials from Google Cloud Console
2. Update `.env` file with actual credentials
3. Test the flow locally
4. Deploy to production
5. Update production URLs in Google Cloud Console

## Support

If you encounter any issues, check:
- Backend logs for errors
- Browser console for frontend errors
- Network tab to see request/response
- Google Cloud Console logs

---

**Created**: 2024
**For**: Aloweda E-commerce Platform
