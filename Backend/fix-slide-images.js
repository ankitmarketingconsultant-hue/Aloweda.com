const mongoose = require('mongoose');
require('dotenv').config();
const SiteContent = require('./models/SiteContent');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const content = await SiteContent.findOne();
    
    if (content && content.heroSlider && content.heroSlider.slides) {
      // Fix image URLs for slides 6 and 7
      const slides = content.heroSlider.slides;
      
      // Slide 6: Total Hair Therapy
      if (slides[5]) {
        slides[5].imageUrl = '/assets/HairSerum.png';
        slides[5].title = 'Total Hair Therapy';
        slides[5].subtitle = 'Redensyl 5% + Anagain 5%';
        console.log('✅ Fixed Slide #6:', slides[5].title);
      }
      
      // Slide 7: Complete Skincare Range
      if (slides[6]) {
        slides[6].imageUrl = '/assets/FaceWash.png';
        slides[6].title = 'Complete Skincare Range';
        slides[6].subtitle = 'Nature Inspired Wellness';
        console.log('✅ Fixed Slide #7:', slides[6].title);
      }
      
      await content.save();
      console.log('\n✅ All slide images fixed!');
      
      // Show all slides
      console.log('\nAll Slides:');
      slides.forEach((slide, i) => {
        console.log(`  ${i+1}. ${slide.title} - ${slide.imageUrl}`);
      });
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
