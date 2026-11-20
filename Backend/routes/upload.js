const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// ── Cloudinary setup (used if env vars are set) ───────────────────────
let cloudinary = null;
let cloudinaryStorage = null;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  const { v2: _cloudinary } = require('cloudinary');
  _cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  cloudinary = _cloudinary;
}

// Always use memory storage — if Cloudinary is configured we upload from buffer,
// otherwise we return base64 data URL as fallback
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

// Helper: upload a buffer to Cloudinary and return secure URL
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'aloweda-products', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// POST /api/upload/image — single image
router.post('/image', auth, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let imageUrl;

    if (cloudinary) {
      // Upload to Cloudinary — returns a persistent CDN URL
      imageUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
    } else {
      // Fallback: base64 data URL (works but large — set up Cloudinary for production)
      const base64 = req.file.buffer.toString('base64');
      imageUrl = `data:${req.file.mimetype};base64,${base64}`;
    }

    res.json({ success: true, message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
  }
});

// POST /api/upload/images — multiple images
router.post('/images', auth, admin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    let imageUrls;

    if (cloudinary) {
      imageUrls = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer, file.mimetype))
      );
    } else {
      imageUrls = req.files.map(file => {
        const base64 = file.buffer.toString('base64');
        return `data:${file.mimetype};base64,${base64}`;
      });
    }

    res.json({ success: true, message: 'Images uploaded successfully', imageUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload images', error: error.message });
  }
});

module.exports = router;
