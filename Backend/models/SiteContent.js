const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  // Announcement Bar
  announcementBar: {
    enabled: {
      type: Boolean,
      default: true
    },
    messages: [{
      text: String,
      link: String,
      bgColor: String
    }]
  },

  // Homepage Banners
  homepageBanners: [{
    title: String,
    subtitle: String,
    description: String,
    imageUrl: String,
    buttonText: String,
    buttonLink: String,
    order: Number,
    enabled: {
      type: Boolean,
      default: true
    }
  }],

  // Featured Sections
  featuredSections: [{
    type: {
      type: String,
      enum: ['facewash', 'skincare', 'haircare', 'lipcare', 'custom']
    },
    title: String,
    subtitle: String,
    description: String,
    imageUrl: String,
    buttonText: String,
    buttonLink: String,
    enabled: {
      type: Boolean,
      default: true
    }
  }],

  // About Section
  aboutSection: {
    title: String,
    content: String,
    imageUrl: String
  },

  // Contact Info
  contactInfo: {
    phone: String,
    email: String,
    address: String,
    whatsappNumber: String
  },

  // Social Media Links
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },

  // SEO Settings
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('SiteContent', siteContentSchema);
