const mongoose = require('mongoose');
require('dotenv').config();
const SiteContent = require('./models/SiteContent');

const graphics = [
  {
    label: 'Ayurveda',
    videoUrl: '/assets/Ayurveda.mp4',
    imageUrl: '/assets/ayurveda-icon.png',
    order: 1
  },
  {
    label: 'Allopathy',
    videoUrl: '/assets/Allopathy.mp4',
    imageUrl: '/assets/allopathy-icon.png',
    order: 2
  },
  {
    label: 'Safe Synthetics',
    videoUrl: '/assets/SafeSynthetics.mp4',
    imageUrl: '/assets/safe-synthetics-icon.png',
    order: 3
  },
  {
    label: 'Knowledge & Innovation',
    videoUrl: '/assets/Knowledge&Innovation.mp4',
    imageUrl: '/assets/innovation-icon.png',
    order: 4
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const content = await SiteContent.findOne();
    
    if (content && content.heroSlider && content.heroSlider.slides[0]) {
      // Add graphics to Slide #1 "What's Aloweda?"
      content.heroSlider.slides[0].graphics = graphics;
      
      await content.save();
      
      console.log('✅ Added 4 graphics to "What\'s Aloweda?" slide:');
      graphics.forEach(g => console.log(`  - ${g.label}`));
    } else {
      console.log('❌ Slide not found');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
