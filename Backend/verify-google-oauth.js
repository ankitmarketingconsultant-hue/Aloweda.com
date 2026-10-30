/**
 * Google OAuth Configuration Verification Script
 * Run this to check if your Google OAuth is properly configured
 */

require('dotenv').config();

const checks = {
  passed: [],
  failed: []
};

console.log('\n🔍 Verifying Google OAuth Configuration...\n');

// Check 1: Environment Variables
console.log('📋 Checking Environment Variables:');

const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'SESSION_SECRET'
];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value && value !== `your_${varName.toLowerCase()}_here`) {
    console.log(`   ✅ ${varName}: Configured`);
    checks.passed.push(varName);
  } else {
    console.log(`   ❌ ${varName}: Not configured or using placeholder`);
    checks.failed.push(varName);
  }
});

console.log('\n📁 Checking Files:');

// Check 2: Passport Config
const fs = require('fs');
const path = require('path');

const passportPath = path.join(__dirname, 'config', 'passport.js');
if (fs.existsSync(passportPath)) {
  console.log('   ✅ Passport configuration file exists');
  checks.passed.push('passport.js');
} else {
  console.log('   ❌ Passport configuration file missing');
  checks.failed.push('passport.js');
}

// Check 3: Dependencies
console.log('\n📦 Checking Dependencies:');

try {
  require('passport');
  console.log('   ✅ passport installed');
  checks.passed.push('passport');
} catch (e) {
  console.log('   ❌ passport not installed');
  checks.failed.push('passport');
}

try {
  require('passport-google-oauth20');
  console.log('   ✅ passport-google-oauth20 installed');
  checks.passed.push('passport-google-oauth20');
} catch (e) {
  console.log('   ❌ passport-google-oauth20 not installed');
  checks.failed.push('passport-google-oauth20');
}

try {
  require('express-session');
  console.log('   ✅ express-session installed');
  checks.passed.push('express-session');
} catch (e) {
  console.log('   ❌ express-session not installed');
  checks.failed.push('express-session');
}

// Summary
console.log('\n' + '═'.repeat(50));
console.log('📊 SUMMARY:');
console.log('═'.repeat(50));
console.log(`✅ Passed: ${checks.passed.length} checks`);
console.log(`❌ Failed: ${checks.failed.length} checks`);

if (checks.failed.length === 0) {
  console.log('\n🎉 All checks passed! Google OAuth is ready to use.');
  console.log('\n📝 Next Steps:');
  console.log('   1. Make sure you\'ve created OAuth credentials in Google Cloud Console');
  console.log('   2. Updated your .env file with actual Client ID and Secret');
  console.log('   3. Added the correct callback URL in Google Cloud Console');
  console.log('   4. Start your server and test the Google sign-in flow\n');
} else {
  console.log('\n⚠️  Some checks failed. Please fix these issues:');
  checks.failed.forEach(item => {
    console.log(`   - ${item}`);
  });
  console.log('\n📖 Refer to GOOGLE_OAUTH_SETUP.md for detailed instructions.\n');
}

console.log('═'.repeat(50) + '\n');
