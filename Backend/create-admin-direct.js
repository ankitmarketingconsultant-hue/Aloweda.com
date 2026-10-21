require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Direct admin creation without using User model to avoid pre-save hook issues
async function createAdminDirect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const adminData = {
      name: 'AlowedaAdmin',
      email: 'admin@aloweda.com',
      password: 'Aloweda2024',
      role: 'admin',
      phone: '1234567890'
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Check if admin exists
    const usersCollection = mongoose.connection.collection('users');
    const existingAdmin = await usersCollection.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists! Updating password...');
      
      await usersCollection.updateOne(
        { email: adminData.email },
        { 
          $set: { 
            password: hashedPassword,
            role: 'admin',
            name: adminData.name
          } 
        }
      );
      
      console.log('\n✅ Admin password updated successfully!');
    } else {
      // Create new admin
      await usersCollection.insertOne({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: 'admin',
        phone: adminData.phone,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('\n✅ Admin user created successfully!');
    }

    console.log('\n═════════════════════════════════════════');
    console.log('👤 Username (Email): admin@aloweda.com');
    console.log('🔒 Password: Aloweda2024');
    console.log('👑 Role: admin');
    console.log('═════════════════════════════════════════');
    console.log('\n🌐 Login at:');
    console.log('   https://aloweda-smoky.vercel.app/admin/login');
    console.log('   OR');
    console.log('   http://localhost:5173/admin/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminDirect();
