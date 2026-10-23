const mongoose = require('mongoose');
require('dotenv').config();
const SiteContent = require('./models/SiteContent');

// Correct slide content matching the live website
const correctSlides = [
  {
    title: "What's Aloweda?",
    subtitle: 'Another Skincare? No, Cuticle care!',
    description: 'We blend ancient Ayurvedic wisdom with modern Allopathic science, safe synthetics, and cutting-edge innovation to create skincare that truly works. Not just another brand—a complete cuticle care revolution.',
    imageUrl: '/assets/AlowedaLogo.png',
    buttonText: 'SHOP NOW',
    buttonLink: '/shop',
    order: 1,
    enabled: true
  },
  {
    title: 'Serums',
    subtitle: 'Spread & Tap! They vanish in 5 minutes!',
    description: 'Our highly concentrated serums are designed to penetrate deep into your skin, delivering powerful active ingredients exactly where they\'re needed. Lightweight, fast-absorbing, and incredibly effective.',
    imageUrl: '/assets/serumSliderImage.png',
    buttonText: 'SHOP NOW',
    buttonLink: '/serums',
    order: 2,
    enabled: true
  },
  {
    title: 'Creams',
    subtitle: 'Allow them to melt into your skin',
    description: 'Our creams are designed to melt into your skin effortlessly. Rich, nourishing formulas that provide deep hydration without feeling heavy. Just apply and let them work their magic.',
    imageUrl: '/assets/CreamSliderImage.png',
    buttonText: 'SHOP NOW',
    buttonLink: '/moisturisers',
    order: 3,
    enabled: true
  },
  {
    title: 'Face Wash',
    subtitle: 'Gentle but serious cleansers',
    description: 'Our face washes are formulated to deeply cleanse without stripping your skin\'s natural moisture. Perfect pH balance, gentle on skin, tough on dirt and impurities.',
    imageUrl: '/assets/FaceWash.png',
    buttonText: 'SHOP NOW',
    buttonLink: '/facewash',
    order: 4,
    enabled: true
  },
  {
    title: 'Lip Care',
    subtitle: 'No to Chemicals. Yes to Botanical butters, oils & Vitamins',
    description: 'Pure, natural lip care with botanical butters and nourishing oils. Zero chemicals, zero preservatives. Just nature\'s best ingredients to keep your lips soft, smooth, and healthy.',
    imageUrl: '/assets/LipsSlider.png',
    buttonText: 'SHOP NOW',
    buttonLink: '/lipcare',
    order: 5,
    enabled: true
  },
  {
    title: 'Tattoo Care',
    subtitle: 'Ink protection meets skin nourishment',
    description: 'Specially formulated tattoo butter to protect your ink while nourishing your skin. Keep your tattoos vibrant and your skin healthy with our unique botanical blend.',
    imageUrl: '/assets/TattooButterslider.png',
    buttonText: 'SHOP NOW',
    buttonLink: '/tattoo-care',
    order: 6,
    enabled: true
  },
  {
    title: 'Hair Care',
    subtitle: 'Health, Growth & Lustre',
    description: 'Advanced hair care solutions with clinically proven ingredients like Redensyl 5% and Anagain 5%. Transform your hair from root to tip with our science-backed formulations.',
    imageUrl: '/assets/HairCareslider.png',
    buttonText: 'SHOP NOW',
    buttonLink: '/haircare',
    order: 7,
    enabled: true
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    const content = await SiteContent.findOne();
    
    if (content) {
      // Replace all slides with correct content
      content.heroSlider.slides = correctSlides;
      
      await content.save();
      
      console.log('✅ All slides updated with correct content!');
      console.log('\nSlides in database:');
      content.heroSlider.slides.forEach((slide, i) => {
        console.log(`  ${i+1}. ${slide.title} - "${slide.subtitle}"`);
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
