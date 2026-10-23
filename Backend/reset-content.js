require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('./models/SiteContent');

async function resetContent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing content
    await SiteContent.deleteMany({});
    console.log('🗑️ Deleted old content');

    // Create new content with default slides
    const content = await SiteContent.create({
      heroSlider: {
        enabled: true,
        autoplay: true,
        interval: 5000,
        slides: [
          {
            title: 'Welcome to Aloweda',
            subtitle: 'Nature Inspired Wellness',
            description: 'Discover premium skincare solutions crafted with natural ingredients',
            imageUrl: '/assets/FaceWash.png',
            buttonText: 'SHOP NOW',
            buttonLink: '/shop',
            order: 1,
            enabled: true
          },
          {
            title: 'Super Glow Serum',
            subtitle: 'Radiant Skin in 30 Days',
            description: 'Experience the power of Vitamin C and Niacinamide',
            imageUrl: '/assets/serumSliderImage.png',
            buttonText: 'EXPLORE SERUMS',
            buttonLink: '/serums',
            order: 2,
            enabled: true
          },
          {
            title: 'Night Care Ritual',
            subtitle: 'Wake Up Refreshed',
            description: 'Overnight skin repair with Retinol and Hyaluronic Acid',
            imageUrl: '/assets/CreamSliderImage.png',
            buttonText: 'SHOP CREAMS',
            buttonLink: '/creams',
            order: 3,
            enabled: true
          },
          {
            title: 'Lip Care Collection',
            subtitle: 'Natural Botanical Butters',
            description: 'Zero chemicals, pure nourishment for your lips',
            imageUrl: '/assets/LipsSlider.png',
            buttonText: 'SHOP LIP CARE',
            buttonLink: '/lipcare',
            order: 4,
            enabled: true
          },
          {
            title: 'Hair Care Solutions',
            subtitle: 'Health, Growth & Lustre',
            description: 'Complete hair care for stronger, healthier hair',
            imageUrl: '/assets/HairCareslider.png',
            buttonText: 'EXPLORE HAIR CARE',
            buttonLink: '/hair',
            order: 5,
            enabled: true
          }
        ]
      },
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
      },
      aboutSection: {
        title: "What's Aloweda?",
        content: "We blend ancient Ayurvedic wisdom with modern Allopathic science, safe synthetics, and cutting-edge innovation to create skincare that truly works. Not just another brand—a complete cuticle care revolution.",
        imageUrl: '/assets/FaceWash.png'
      }
    });

    console.log('✅ Created new content with', content.heroSlider.slides.length, 'hero slides');
    console.log('🎉 Content reset successful!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetContent();
