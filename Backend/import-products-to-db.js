require('dotenv').config();
const mongoose = require('mongoose');
const Bundle = require('./models/Bundle');

// All products from your frontend
const ALL_PRODUCTS = [
  {
    name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter',
    category: 'combo',
    price: 899,
    mrp: 1199,
    stock: 50,
    description: 'Complete skincare routine with day cream, night cream, and lip butter',
    image: 'YourSimpleRoutine.png'
  },
  {
    name: 'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream + Complexion Cream + Smooth Perfection Serum',
    category: 'combo',
    price: 1299,
    mrp: 1599,
    stock: 50,
    description: 'Perfect complexion routine with multiple serums and creams',
    image: 'PerfectComplexion.png'
  },
  {
    name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram',
    category: 'combo',
    price: 1149,
    mrp: 1299,
    stock: 50,
    description: 'Complete radiance ritual for glowing skin',
    image: 'RitualOfRadiance.png'
  },
  {
    name: 'Hyaluronic Acid, SPF 30 & Vitamin E : The Day Cream 50 G',
    category: 'cream',
    price: 499,
    mrp: 549,
    stock: 100,
    description: 'Hydrating day cream with SPF 30 protection',
    image: 'DayCream.png'
  },
  {
    name: 'Retinol 1%, Niacinamide 10 %, Aloe Vera Extract & Carrot oil: The Night Cream 50 G',
    category: 'cream',
    price: 549,
    mrp: 599,
    stock: 100,
    description: 'Anti-aging night cream with retinol and niacinamide',
    image: 'NightCream.png'
  },
  {
    name: 'Saffron Face Oil 30 ml: Saffron Essential Oil, Sweet Almond oil, Grape Seed Oil, Honey & Ghee',
    category: 'oil',
    price: 799,
    mrp: 799,
    stock: 75,
    description: 'Luxurious saffron face oil for radiant skin',
    image: 'SaffronOil.png'
  },
  {
    name: 'Alpha Arbutin 2%, Vitamin C 15 % & Micro Crystalline Wax: Complexion Cream 50 G',
    category: 'cream',
    price: 499,
    mrp: 549,
    stock: 100,
    description: 'Brightening complexion cream with Alpha Arbutin',
    image: 'ComplexionCream.png'
  },
  {
    name: 'Vitamin C 15%, Niacinamide 5%, Hyaluronic Acid & Ferulic Acid 1% Serum 30 ml for Super Glow',
    category: 'serum',
    price: 649,
    mrp: 699,
    stock: 100,
    description: 'Super glow serum with Vitamin C and Ferulic Acid',
    image: 'SuperGlowSerum.png'
  },
  {
    name: 'Alpha Arbutin 2%, Aloe Vera Extract, Ceramides & Kojic Acid 1%: Pigment Control Serum 30 ml',
    category: 'serum',
    price: 599,
    mrp: 649,
    stock: 100,
    description: 'Pigment control serum for even skin tone',
    image: 'PigmentControlSerum.png'
  },
  {
    name: 'Salicylic Acid 2%, Hyaluronic Acid, Niacinamide 5%: Smooth Perfection Serum 30 ml',
    category: 'serum',
    price: 599,
    mrp: 649,
    stock: 100,
    description: 'Smoothing serum for perfect skin texture',
    image: 'SmoothPerfectionSerum.png'
  },
  {
    name: 'Vitamin C 20%, Hyaluronic Acid, Vitamin E & Honey: Radiance Cream 50 G',
    category: 'cream',
    price: 549,
    mrp: 599,
    stock: 100,
    description: 'High potency Vitamin C radiance cream',
    image: 'RadianceCream.png'
  },
  {
    name: 'Retinol 1%, Hyaluronic Acid & Vitamin E: Lines & Wrinkles Serum 30 ml',
    category: 'serum',
    price: 649,
    mrp: 699,
    stock: 100,
    description: 'Anti-aging serum for lines and wrinkles',
    image: 'LinesWrinklesSerum.png'
  },
  {
    name: 'Niacinamide 10%, Alpha Arbutin 2%, Hyaluronic Acid: Tone & Texture Serum 30 ml',
    category: 'serum',
    price: 599,
    mrp: 649,
    stock: 100,
    description: 'Serum for improved skin tone and texture',
    image: 'ToneTextureSerum.png'
  },
  {
    name: 'Anti Acne Face Wash 150 ml: Salicylic Acid 2%, Niacinamide, Tea Tree Oil',
    category: 'facewash',
    price: 349,
    mrp: 399,
    stock: 150,
    description: 'Anti-acne face wash with salicylic acid',
    image: 'AntiAcneFaceWash.png'
  },
  {
    name: 'Hair Therapy Serum 50 ml: Biotin, Caffeine, Argan Oil',
    category: 'haircare',
    price: 699,
    mrp: 749,
    stock: 75,
    description: 'Hair therapy serum for healthy hair growth',
    image: 'HairTherapySerum.png'
  },
  {
    name: 'Lip Butter 15 G: Shea Butter, Cocoa Butter, Vitamin E',
    category: 'lipcare',
    price: 299,
    mrp: 349,
    stock: 150,
    description: 'Nourishing lip butter for soft lips',
    image: 'LipButter.png'
  },
  {
    name: 'Tattoo Care Cleanser 100 ml',
    category: 'tattoo',
    price: 399,
    mrp: 449,
    stock: 100,
    description: 'Gentle cleanser for tattoo aftercare',
    image: 'TattooCleanser.png'
  },
  {
    name: 'Tattoo Care Butter 50 G',
    category: 'tattoo',
    price: 499,
    mrp: 549,
    stock: 100,
    description: 'Healing butter for tattoo care',
    image: 'TattooButter.png'
  },
  {
    name: 'Winter Care Combo',
    category: 'combo',
    price: 1399,
    mrp: 1699,
    stock: 50,
    description: 'Complete winter skincare combo',
    image: 'WinterCombo.png'
  }
];

async function importProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing products (optional)
    // await Bundle.deleteMany({});
    // console.log('🗑️  Cleared existing products');

    // Check if products already exist
    const existingCount = await Bundle.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} products already exist in database`);
      console.log('Do you want to skip import? (This script will exit)');
      process.exit(0);
    }

    // Insert all products
    const result = await Bundle.insertMany(ALL_PRODUCTS);
    
    console.log('\n✅ Products imported successfully!');
    console.log(`📦 Total products added: ${result.length}`);
    console.log('\n═══════════════════════════════════════');
    console.log('Products in database:');
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}`);
    });
    console.log('═══════════════════════════════════════\n');
    console.log('🌐 Now refresh your admin panel to see products!');
    console.log('   https://aloweda-smoky.vercel.app/admin/products\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

importProducts();
