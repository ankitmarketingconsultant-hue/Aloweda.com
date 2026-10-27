require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const migrateUsers = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users where lastLogin is null/undefined
    const usersToMigrate = await User.find({
      $or: [
        { lastLogin: null },
        { lastLogin: { $exists: false } }
      ]
    });

    console.log(`📊 Found ${usersToMigrate.length} users to migrate`);

    let migratedCount = 0;

    for (const user of usersToMigrate) {
      // Set lastLogin to signupDate (or createdAt as fallback)
      user.lastLogin = user.signupDate || user.createdAt;
      
      // Set loginCount to 1 if it's 0 or undefined
      if (!user.loginCount || user.loginCount === 0) {
        user.loginCount = 1;
      }

      // Add initial login history entry
      if (!user.loginHistory || user.loginHistory.length === 0) {
        user.loginHistory = [{
          timestamp: user.lastLogin,
          ipAddress: 'Migration',
          userAgent: 'Auto-migrated from signup data',
          sessionDuration: null
        }];
      }

      await user.save();
      migratedCount++;
      console.log(`✅ Migrated: ${user.email}`);
    }

    console.log(`\n🎉 Migration complete! Updated ${migratedCount} users`);
    console.log('📝 All users now have lastLogin data');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run migration
migrateUsers();
