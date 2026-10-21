// Test if backend is accessible
const testUrls = [
  'http://localhost:5000',
  'https://aloweda-backend.vercel.app',
  process.env.BACKEND_URL
].filter(Boolean);

async function testBackend() {
  console.log('🔍 Testing backend availability...\n');
  
  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url);
      const text = await response.text();
      console.log(`✅ Response: ${text}\n`);
      return url;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }
  
  return null;
}

testBackend().then(workingUrl => {
  if (workingUrl) {
    console.log(`✅ Backend is running at: ${workingUrl}`);
    console.log('\n📝 You can now use add-coupons.html or manual import');
  } else {
    console.log('❌ Backend not accessible');
    console.log('Please start the backend server or use MongoDB Atlas manual import');
  }
});
