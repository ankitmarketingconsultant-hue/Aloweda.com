const mongoose = require('mongoose');
require('dotenv').config();
const SiteContent = require('./models/SiteContent');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const content = await SiteContent.findOne();
    
    if (content && content.heroSlider && content.heroSlider.slides[0]) {
      // Clear imageUrl for What's Aloweda slide (it uses special graphics layout)
      content.heroSlider.slides[0].imageUrl = '';
      content.heroSlider.slides[0].description = 'Special slide with 4 animated graphics: Ayurveda, Allopathy, Safe Synthetics, Knowledge & Innovation. This slide uses a custom layout on the homepage.';
      
      await content.save();
      console.log('✅ What\'s Aloweda slide updated - image URL cleared (uses special graphics)');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
