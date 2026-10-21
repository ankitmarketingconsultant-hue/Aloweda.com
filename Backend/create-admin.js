require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin details
const ADMIN_EMAIL = 'admin@aloweda.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'Aloweda Admin';

console.log('🔄 Creating admin account...\n');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ Connected to MongoDB\n');
  
  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');
  
  // Check if admin exists
  const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL });
  
  if (existingAdmin) {
    console.log('⚠️  Admin already exists!');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('\nUse these credentials to login.\n');
  } else {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
    
    // Create admin user
    await usersCollection.insertOne({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Admin account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', ADMIN_EMAIL);
    console.log('🔑 Password: ', ADMIN_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 Now login at your website with these credentials');
  }
  
  await mongoose.connection.close();
  process.exit(0);
})
.catch(error => {
  console.error('❌ Error:', error.message);
  console.error('\n⚠️  Cannot connect to MongoDB Atlas');
  console.error('Please use MongoDB Atlas web interface to create admin manually\n');
  process.exit(1);
});
