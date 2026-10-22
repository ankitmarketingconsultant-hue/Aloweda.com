require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    // Delete existing admin
    await User.deleteOne({ email: 'alowedaadmin@aloweda.com' });
    console.log('🗑️  Old admin deleted');

    // Create new admin (pre-save hook will hash password automatically)
    const admin = await User.create({
      name: 'Aloweda Admin',
      email: 'alowedaadmin@aloweda.com',
      password: 'Aloweda2024', // Plain password - will be hashed by pre-save hook
      role: 'admin'
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: alowedaadmin@aloweda.com');
    console.log('🔐 Password: Aloweda2024');
    console.log('👤 Name: Aloweda Admin');
    console.log('🔑 Role: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Verify password works
    const isMatch = await admin.comparePassword('Aloweda2024');
    console.log('\n✅ Password verification:', isMatch ? 'SUCCESS' : 'FAILED');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAdmin();
