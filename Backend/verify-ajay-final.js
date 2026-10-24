require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function verifyAjay() {
  try {
    const MONGO_URI = 'mongodb+srv://ajay_db_user:Aloweda2024@cluster0.x5zntix.mongodb.net/aloweda?retryWrites=true&w=majority';
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to Production DB\n');

    // Check ajay@aloweda.com
    const ajay = await User.findOne({ email: 'ajay@aloweda.com' });
    
    if (!ajay) {
      console.log('❌ ajay@aloweda.com NOT FOUND in database!');
      console.log('Creating now...');
      
      const newUser = await User.create({
        name: 'Dr. Ajay Patwardhan',
        email: 'ajay@aloweda.com',
        password: 'Aloweda2024',
        role: 'admin'
      });
      
      console.log('✅ Created ajay@aloweda.com as admin!');
    } else {
      console.log('✅ ajay@aloweda.com EXISTS');
      console.log('Name:', ajay.name);
      console.log('Email:', ajay.email);
      console.log('Role:', ajay.role);
      
      // Test password
      const passwordMatch = await bcrypt.compare('Aloweda2024', ajay.password);
      console.log('Password "Aloweda2024" matches:', passwordMatch);
      
      if (ajay.role !== 'admin') {
        console.log('\n⚠️ Role is NOT admin! Fixing...');
        ajay.role = 'admin';
        await ajay.save();
        console.log('✅ Role updated to admin!');
      }
    }

    // Also check what mahajanbhavya232 credentials are
    console.log('\n=== Checking mahajanbhavya232@gmail.com ===');
    const bhavya = await User.findOne({ email: 'mahajanbhavya232@gmail.com' });
    if (bhavya) {
      console.log('✅ Found:', bhavya.email);
      console.log('Role:', bhavya.role);
    } else {
      console.log('❌ mahajanbhavya232@gmail.com NOT found');
    }

    // Check alowedaadmin
    console.log('\n=== Checking alowedaadmin@aloweda.com ===');
    const admin = await User.findOne({ email: 'alowedaadmin@aloweda.com' });
    if (admin) {
      console.log('✅ Found:', admin.email);
      console.log('Role:', admin.role);
    }

    await mongoose.connection.close();
    console.log('\n✅ All done! Try logging in now with ajay@aloweda.com');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyAjay();
