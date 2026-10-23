const mongoose = require('mongoose');
require('dotenv').config();
const SiteContent = require('./models/SiteContent');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const content = await SiteContent.findOne();
    
    if (content) {
      console.log('\n📊 Current Content:');
      console.log('Hero Slides:', content.heroSlider?.slides?.length || 0);
      
      if (content.heroSlider?.slides) {
        content.heroSlider.slides.forEach((slide, i) => {
          console.log(`  ${i+1}. ${slide.title} (${slide.enabled ? 'Enabled' : 'Disabled'})`);
        });
      }
      
      console.log('\nAnnouncement Bar:', content.announcementBar?.enabled ? 'Enabled' : 'Disabled');
      console.log('  Text:', content.announcementBar?.text || 'Not set');
      
      console.log('\nHomepage Banners:', content.homepageBanners?.length || 0);
    } else {
      console.log('❌ No content found');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
