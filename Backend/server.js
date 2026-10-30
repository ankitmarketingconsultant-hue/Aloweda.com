require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');

const authRoutes = require('./routes/auth');
const bundleRoutes = require('./routes/bundle');
const couponRoutes = require('./routes/coupon');
const announcementRoutes = require('./routes/announcement');
const reviewRoutes = require('./routes/review');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');
const codRoutes = require('./routes/cod');
const adminRoutes = require('./routes/admin');
const importProductsRoutes = require('./routes/import-products');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');
const metaCapiTestRoutes = require('./routes/meta-capi-test');
const protect = require('./middleware/auth');
const User = require('./models/User');

// ── Vercel-safe MongoDB connection cache ──────────────────────────────
// Store connection promise on global so it survives across warm invocations
let connectionPromise = global._mongooseConnectionPromise || null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (connectionPromise) return connectionPromise;   // connection in progress

  connectionPromise = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 60000,
  });

  global._mongooseConnectionPromise = connectionPromise;

  try {
    await connectionPromise;
    console.log('MongoDB connected ✅');
  } catch (err) {
    connectionPromise = null;
    global._mongooseConnectionPromise = null;
    console.error('MongoDB error:', err.message);
    throw err;
  }
}

// ── Express app ───────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: [
    'https://aloweda-smoky.vercel.app',
    'https://aloweda-com-1kjn.vercel.app',
    'https://aloweda.com',
    'https://www.aloweda.com',
    'http://localhost:5173',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check — no DB needed
app.get('/', (req, res) => res.send('Auth backend is running ✅'));

// Connect DB lazily on first API request (skip health checks)
app.use(async (req, res, next) => {
  // Skip DB connection for health check routes
  if (req.path === '/' || req.path === '/api/health') {
    return next();
  }
  
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// ── Routes ────────────────────────────────────────────────────────────
// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const mongoUri = process.env.MONGO_URI ? 'configured' : 'missing';
    res.json({ 
      status: 'ok',
      database: dbStatus,
      mongoUri: mongoUri,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cod', codRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/import-products', importProductsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/meta-capi-test', metaCapiTestRoutes); // Meta CAPI testing endpoints

app.get('/api/profile', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

// ── Local dev ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running at: http://localhost:${PORT}`));
  });
}

module.exports = app;
