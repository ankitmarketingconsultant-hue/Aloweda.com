const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      // Password not required if signing in with Google
      return !this.googleId;
    },
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  // Login Activity Tracking
  loginHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    sessionDuration: Number // in seconds, null if session still active
  }],
  currentSessionStart: {
    type: Date // Track when current session started
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  signupDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Password hash karne ka method
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password compare karne ka method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
