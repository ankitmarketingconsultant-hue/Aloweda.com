const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @desc    Get site content
// @route   GET /api/content
// @access  Public
router.get('/', async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    
    // If no content exists, create default
    if (!content) {
      content = await SiteContent.create({
        announcementBar: {
          enabled: true,
          messages: [
            { text: '🎉 Free Shipping on Orders Above ₹999', bgColor: '#2d5f3f' },
            { text: '💳 Flat 10% Discount on Online Payments', bgColor: '#1e40af' },
            { text: '🩺 Doctor Recommended Products', bgColor: '#7c3aed' }
          ]
        },
        homepageBanners: [
          {
            title: 'Face Wash',
            subtitle: 'Gentle but serious cleansers',
            description: 'Our face washes are formulated to deeply cleanse without stripping your skins natural moisture.',
            imageUrl: '/assets/FaceWash.png',
            buttonText: 'SHOP NOW',
            buttonLink: '/shop',
            order: 1,
            enabled: true
          }
        ],
        contactInfo: {
          phone: '+91 1234567890',
          email: 'info@aloweda.com',
          whatsappNumber: '+91 1234567890'
        }
      });
    }
    
    res.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
});

// @desc    Update announcement bar
// @route   PUT /api/content/announcement
// @access  Admin
router.put('/announcement', auth, admin, async (req, res) => {
  try {
    const { enabled, messages } = req.body;
    
    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent();
    }
    
    content.announcementBar = { enabled, messages };
    await content.save();
    
    res.json({
      success: true,
      message: 'Announcement bar updated',
      content: content.announcementBar
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update announcement'
    });
  }
});

// @desc    Update homepage banners
// @route   PUT /api/content/banners
// @access  Admin
router.put('/banners', auth, admin, async (req, res) => {
  try {
    const { banners } = req.body;
    
    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent();
    }
    
    content.homepageBanners = banners;
    await content.save();
    
    res.json({
      success: true,
      message: 'Banners updated',
      banners: content.homepageBanners
    });
  } catch (error) {
    console.error('Error updating banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banners'
    });
  }
});

// @desc    Update hero slider
// @route   PUT /api/content/hero-slider
// @access  Admin
router.put('/hero-slider', auth, admin, async (req, res) => {
  try {
    const { enabled, autoplay, interval, slides } = req.body;
    
    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent();
    }
    
    content.heroSlider = { enabled, autoplay, interval, slides };
    await content.save();
    
    res.json({
      success: true,
      message: 'Hero slider updated',
      heroSlider: content.heroSlider
    });
  } catch (error) {
    console.error('Error updating hero slider:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hero slider'
    });
  }
});

// @desc    Update featured sections
// @route   PUT /api/content/featured
// @access  Admin
router.put('/featured', auth, admin, async (req, res) => {
  try {
    const { sections } = req.body;
    
    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent();
    }
    
    content.featuredSections = sections;
    await content.save();
    
    res.json({
      success: true,
      message: 'Featured sections updated',
      sections: content.featuredSections
    });
  } catch (error) {
    console.error('Error updating featured sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured sections'
    });
  }
});

// @desc    Update about section
// @route   PUT /api/content/about
// @access  Admin
router.put('/about', auth, admin, async (req, res) => {
  try {
    const { title, content: aboutContent, imageUrl } = req.body;
    
    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent();
    }
    
    content.aboutSection = { title, content: aboutContent, imageUrl };
    await content.save();
    
    res.json({
      success: true,
      message: 'About section updated',
      aboutSection: content.aboutSection
    });
  } catch (error) {
    console.error('Error updating about section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update about section'
    });
  }
});

// @desc    Update contact info
// @route   PUT /api/content/contact
// @access  Admin
router.put('/contact', auth, admin, async (req, res) => {
  try {
    const { phone, email, address, whatsappNumber } = req.body;
    
    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent();
    }
    
    content.contactInfo = { phone, email, address, whatsappNumber };
    await content.save();
    
    res.json({
      success: true,
      message: 'Contact info updated',
      contactInfo: content.contactInfo
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact info'
    });
  }
});

module.exports = router;
