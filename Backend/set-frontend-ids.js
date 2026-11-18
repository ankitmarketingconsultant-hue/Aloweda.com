/**
 * One-time migration: assigns frontendId to all existing DB products.
 * Run once:  node set-frontend-ids.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

// Order matters — more specific entries first to avoid wrong matches
const FRONTEND_MAP = [
  { id: 21, fragments: ['winter combo'] },
  { id: 1,  fragments: ['simple routine', 'day cream + the night cream + lip butter'] },
  { id: 2,  fragments: ['perfect complexion ritual', 'pigment control serum + the day cream + complexion cream'] },
  { id: 3,  fragments: ['ritual of radiance', 'super glow serum 30 ml + the day cream'] },
  { id: 4,  fragments: ['hyaluronic acid, spf 30 & vitamin e', 'spf 30 & vitamin e : the day cream', 'the day cream 50 g'] },
  { id: 5,  fragments: ['the night cream 50', 'niacinamide 10 %, aloe vera', 'niacinamide 10 %'] },
  { id: 6,  fragments: ['saffron face oil', 'saffron essential oil'] },
  { id: 7,  fragments: ['complexion cream 50', 'micro crystalline wax: complexion', 'alpha arbutin 2%, vitamin c', 'alpha arbutin 1 %, vitamin c'] },
  { id: 8,  fragments: ['super glow serum', 'hyaluronic acid & ferulic acid', 'niacinamide 5%, hyaluronic acid & ferulic'] },
  { id: 9,  fragments: ['pigment control serum', 'alpha arbutin 2%, aloe vera', 'kojic acid 1%: pigment'] },
  { id: 10, fragments: ['wrinkles & lines cream', 'copper tripeptide, alpha arbutin'] },
  { id: 11, fragments: ['lines & wrinkles serum', 'encapsulated retinol', 'grape seed extract, & ceramides'] },
  { id: 12, fragments: ['tone & texture', 'acetyl glucosamine & ceramides', 'niacinamide 10 %, acetyl', 'niacinamide 1011'] },
  { id: 13, fragments: ['smooth perfection serum', 'salicylic acid 2%, witch hazel', 'squalene: smooth'] },
  { id: 14, fragments: ['radiance cream 50', 'vitamin c 20%, kojic acid', 'kojic acid, avocado extract & argan oil : radiance'] },
  { id: 15, fragments: ['anti acne face wash', 'anti-acne face wash for tattoo', 'salicylic acid 2% for oily'] },
  { id: 16, fragments: ['hair therapy serum', 'redensyl 5%', 'anagain 5%', 'rice water & biotin'] },
  { id: 17, fragments: ['lip butter 8 gram'] },
  { id: 18, fragments: ['lip butter 15 gram', 'not lip balm'] },
  { id: 19, fragments: ['tattoo cleanser'] },
  { id: 20, fragments: ['tattoo butter'] },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const products = await Product.find({});
  console.log(`Found ${products.length} products in DB\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const nameLower = product.name.toLowerCase();

    const match = FRONTEND_MAP.find(entry =>
      entry.fragments.some(frag => nameLower.includes(frag.toLowerCase()))
    );

    if (!match) {
      console.log(`⚠️  NO MATCH: "${product.name}"`);
      skipped++;
      continue;
    }

    if (product.frontendId === match.id) {
      console.log(`✓  Already correct (id=${match.id}): "${product.name}"`);
      continue;
    }

    await Product.findByIdAndUpdate(product._id, { frontendId: match.id });
    console.log(`✅ Set frontendId=${match.id}: "${product.name}"`);
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}, Skipped (no match): ${skipped}`);
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
