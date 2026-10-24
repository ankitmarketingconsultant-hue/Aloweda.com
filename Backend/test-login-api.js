const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login API on production...\n');
    
    const API_URL = 'https://aloweda-jitl.vercel.app'; // Production backend URL
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ajay@aloweda.com',
        password: 'Aloweda2024'
      })
    });

    const data = await response.json();
    
    console.log('=== API Response ===');
    console.log('Status:', response.status);
    console.log('Success:', response.ok);
    console.log('\n=== User Data ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.user && data.user.role === 'admin') {
      console.log('\n✅ Admin role confirmed!');
      console.log('Frontend should redirect to /admin/dashboard');
    } else {
      console.log('\n❌ Admin role NOT found in response!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();
