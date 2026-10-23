const mongoose = require('mongoose');
require('dotenv').config();
const SiteContent = require('./models/SiteContent');

const newSlides = [
  {
    title: 'Total Hair Therapy',
    subtitle: 'Redensyl 5% + Anagain 5%',
    description: 'Advanced hair growth formula with clinically proven ingredients',
    imageUrl: '/assets/HairSerum.png',
    buttonText: 'SHOP NOW',
    buttonLink: '/product/total-hair-therapy',
    order: 6,
    enabled: true
  },
  {
    title: 'Complete Skincare Range',
    subtitle: 'Nature Inspired Wellness',
    description: 'Discover our complete range of natural skincare products',
    imageUrl: '/assets/FaceWash.png',
    buttonText: 'EXPLORE ALL',
    buttonLink: '/shop',
    order: 7,
    enabled: true
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const content = await SiteContent.findOne();
    
    if (content) {
      // Add 2 new slides
      content.heroSlider.slides.push(...newSlides);
      
      // Set announcement bar text
      content.announcementBar.text = '🔥 Free Shipping on Orders Above ₹999';
      content.announcementBar.link = '/shop';
      content.announcementBar.enabled = true;
      
      await content.save();
      
      console.log('✅ Added 2 new slides! Total slides:', content.heroSlider.slides.length);
      console.log('✅ Updated announcement bar text');
      
      content.heroSlider.slides.forEach((slide, i) => {
        console.log(`  ${i+1}. ${slide.title}`);
      });
    } else {
      console.log('❌ No content found');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
