const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('../config/passport');

const router = express.Router();

// Helper: generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  async (req, res) => {
    try {
      const token = generateToken(req.user._id);
      
      // Send response that can be captured by popup
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Google Sign In</title>
          </head>
          <body>
            <script>
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                payload: {
                  token: '${token}',
                  user: {
                    id: '${req.user._id}',
                    name: '${req.user.name}',
                    email: '${req.user.email}',
                    role: '${req.user.role}'
                  }
                }
              }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Google callback error:', error);
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error</title>
          </head>
          <body>
            <script>
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_ERROR',
                message: 'Authentication failed'
              }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    }
  }
);

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user with optional role (defaults to 'user' in schema)
    // Password will be automatically hashed by pre-save hook in User model
    const userData = {
      name,
      email,
      password, // Don't hash here - pre-save hook will do it!
      signupDate: new Date() // Track signup date
    };

    // Add optional fields if provided
    if (phone) userData.phone = phone;
    if (role && (role === 'admin' || role === 'user')) userData.role = role;

    const user = await User.create(userData);

    console.log('User created successfully:', user._id);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const token = generateToken(user._id);
    console.log('Token generated successfully');

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    console.error('Full error:', error);
    
    // Send more specific error message
    if (error.message.includes('JWT_SECRET')) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    res.status(500).json({ message: 'Server error, please try again later', detail: error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Track login activity
    const now = new Date();
    
    // If there's an active session, calculate its duration and save it
    if (user.currentSessionStart) {
      const sessionDuration = Math.floor((now - user.currentSessionStart) / 1000); // in seconds
      
      // Find the last login entry and update its sessionDuration
      if (user.loginHistory && user.loginHistory.length > 0) {
        const lastEntry = user.loginHistory[user.loginHistory.length - 1];
        if (!lastEntry.sessionDuration) {
          lastEntry.sessionDuration = sessionDuration;
        }
      }
    }
    
    const loginEntry = {
      timestamp: now,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent') || 'Unknown',
      sessionDuration: null // Will be filled on next login or explicit logout
    };

    // Update user login history (keep last 50 logins)
    user.loginHistory = user.loginHistory || [];
    user.loginHistory.push(loginEntry);
    if (user.loginHistory.length > 50) {
      user.loginHistory = user.loginHistory.slice(-50); // Keep only last 50
    }

    user.lastLogin = now;
    user.currentSessionStart = now; // Start new session
    user.loginCount = (user.loginCount || 0) + 1;

    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// @route   POST /api/auth/register (alias for signup)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user with optional role
    const userData = {
      name,
      email,
      password, // Will be hashed by pre-save hook in User model
      role: role || 'user', // Default to 'user', allow 'admin' if specified
    };

    if (phone) userData.phone = phone;

    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

module.exports = router;