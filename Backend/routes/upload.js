const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Memory storage — no filesystem writes, works on Vercel serverless
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

// POST /api/upload/image — single image, returns base64 data URL
router.post('/image', auth, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const base64 = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    res.json({ success: true, message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
  }
});

// POST /api/upload/images — multiple images, returns array of base64 data URLs
router.post('/images', auth, admin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const imageUrls = req.files.map(file => {
      const base64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64}`;
    });
    res.json({ success: true, message: 'Images uploaded successfully', imageUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload images', error: error.message });
  }
});

module.exports = router;
