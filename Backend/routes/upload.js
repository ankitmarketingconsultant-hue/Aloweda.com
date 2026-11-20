const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Use memory storage — no filesystem writes, works on Vercel serverless
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// @desc    Upload single image — returns base64 data URL stored directly in DB
// @route   POST /api/upload/image
// @access  Admin
router.post('/image', auth, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Convert to base64 data URL — no external storage needed
    const base64 = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image', error: error.message });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Admin
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
      url: `/uploads/${file.filename}`,
      filename: file.filename
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      images: imageUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// @desc    Delete uploaded image
// @route   DELETE /api/upload/image/:filename
// @access  Admin
router.delete('/image/:filename', auth, admin, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// @desc    Get list of uploaded images
// @route   GET /api/upload/images
// @access  Admin
router.get('/images', auth, admin, (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.ogg'].includes(ext);
      })
      .map(file => ({
        filename: file,
        url: `/uploads/${file}`,
        uploadedAt: fs.statSync(path.join(uploadsDir, file)).mtime
      }))
      .sort((a, b) => b.uploadedAt - a.uploadedAt); // Sort by newest first

    res.json({
      success: true,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get images',
      error: error.message
    });
  }
});

module.exports = router;
