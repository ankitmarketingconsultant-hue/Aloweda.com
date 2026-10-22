require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createSingleAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    
    console.log('✅ MongoDB connected!');
    console.log('📁 Database:', mongoose.connection.name);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'alowedaadmin@aloweda.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create single admin account
    const hashedPassword = await bcrypt.hash('Aloweda2024', 10);
    
    const admin = await User.create({
      name: 'Aloweda Admin',
      email: 'alowedaadmin@aloweda.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: alowedaadmin@aloweda.com');
    console.log('🔐 Password: Aloweda2024');
    console.log('👤 Name: Aloweda Admin');
    console.log('🔑 Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🚀 Login at: https://aloweda-smoky.vercel.app/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createSingleAdmin();
