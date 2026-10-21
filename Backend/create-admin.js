require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Admin user details - CHANGE THESE!
    const adminData = {
      name: 'Admin',
      email: 'admin@aloweda.com',  // CHANGE THIS EMAIL
      password: 'admin123',          // CHANGE THIS PASSWORD
      role: 'admin',
      phone: '1234567890'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with this email!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      }
      
      process.exit(0);
    }

    // Create new admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('═══════════════════════════════════');
    console.log('📧 Email:', adminData.email);
    console.log('🔒 Password:', adminData.password);
    console.log('👤 Role:', adminData.role);
    console.log('═══════════════════════════════════');
    console.log('\n🌐 Login at: https://aloweda-smoky.vercel.app/admin/login');
    console.log('   OR locally: http://localhost:5173/admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
