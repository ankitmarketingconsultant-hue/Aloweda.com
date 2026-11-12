require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./models/Review');

// ── Seed data: 3-4 product-specific reviews per product ──────────────────────
const REVIEWS = [
  // ── Product 1: YOUR SIMPLE ROUTINE (Day Cream + Night Cream + Lip Butter) ──
  { productId: '1', userName: 'Meera V.', rating: 5, title: 'Perfect daily combo!', comment: 'This 3-in-1 routine has completely transformed my skincare. The Day Cream keeps me protected all day, the Night Cream works wonders while I sleep, and the Lip Butter is incredibly nourishing. Worth every rupee!' },
  { productId: '1', userName: 'Sunita G.', rating: 5, title: 'Best value skincare set', comment: 'I was looking for a simple yet effective routine and this kit is exactly that. My skin feels hydrated, plump and my lips are no longer dry. The packaging is also very elegant. Highly recommend!' },
  { productId: '1', userName: 'Kavita R.', rating: 4, title: 'Great starter kit', comment: 'Really good combination of products. The night cream absorbs beautifully and I wake up with softer skin every morning. The lip butter smells divine. Would have given 5 stars but delivery took a little longer than expected.' },
  { productId: '1', userName: 'Deepa M.', rating: 5, title: 'Gifted this to my sister too!', comment: 'Bought this first for myself and loved it so much that I ordered it for my sister as well. The simplicity of just 3 products covering everything you need is brilliant. Skin is glowing!' },

  // ── Product 2: PERFECT COMPLEXION RITUAL ──
  { productId: '2', userName: 'Priya S.', rating: 5, title: 'My pigmentation is visibly reduced!', comment: 'I have been struggling with pigmentation for years. After just 3 weeks of using this ritual consistently, my dark spots have faded significantly. The Pigment Control Serum is a game changer. Cannot recommend this enough!' },
  { productId: '2', userName: 'Rohini K.', rating: 5, title: 'Complexion has evened out beautifully', comment: 'The combination of these 4 products is genius. Each one targets a different concern and together they give a comprehensive treatment. My skin tone is much more even now and I get compliments regularly.' },
  { productId: '2', userName: 'Ananya B.', rating: 4, title: 'Effective but requires patience', comment: 'Skin science takes time and this kit requires patience. After about a month I started seeing real results — less pigmentation, smoother texture, and an overall brighter complexion. The Smooth Perfection Serum is my favourite from this kit.' },
  { productId: '2', userName: 'Sneha T.', rating: 5, title: 'Acne marks gone in 6 weeks', comment: 'Post-acne marks that I had for months have significantly lightened. The Complexion Cream is very effective and does not clog pores. My skin feels clean and bright every single morning.' },

  // ── Product 3: RITUAL OF RADIANCE ──
  { productId: '3', userName: 'Arjun M.', rating: 5, title: 'Genuine glow in 2 weeks', comment: 'I was sceptical about serums but the Super Glow Serum proved me wrong. My skin has a natural radiance now that even my colleagues noticed. The Radiance Cream at night seals everything in perfectly.' },
  { productId: '3', userName: 'Pooja L.', rating: 5, title: 'This is the ritual my skin needed', comment: 'I have oily skin and was worried the Radiance Cream would make it worse. It is surprisingly lightweight. The whole 3-step ritual takes under 5 minutes and the results are absolutely stunning. Glowing skin is real!' },
  { productId: '3', userName: 'Tanya B.', rating: 4, title: 'Visible results within weeks', comment: 'Smooth, bright, and even-toned skin in just a few weeks. The Super Glow Serum applies very smoothly and layers well under the Day Cream. I did notice some initial tingling which settled after a few days.' },

  // ── Product 4: The Day Cream ──
  { productId: '4', userName: 'Rhea P.', rating: 5, title: 'Best daily moisturiser with SPF', comment: 'I have been using this every single morning for the past 2 months. No white cast, no stickiness, and my skin stays hydrated all day. The SPF 30 means I do not need a separate sunscreen. Absolute gem of a product.' },
  { productId: '4', userName: 'Nisha D.', rating: 5, title: 'No more separate sunscreen!', comment: 'The fact that this moisturiser has SPF 30 built in is incredible. My morning routine is so much simpler now. Skin feels velvety soft by midday and there is zero greasiness. Love it!' },
  { productId: '4', userName: 'Aisha K.', rating: 4, title: 'Good hydration, lightweight feel', comment: 'Really pleased with this cream. It spreads easily, absorbs quickly and does not feel heavy at all. Perfect for Indian weather. The only thing I wish for is a slightly higher SPF but for daily use it works great.' },
  { productId: '4', userName: 'Fatima J.', rating: 5, title: 'Hydrated skin all day', comment: 'I have dry skin and was looking for something that would keep me moisturised through a long day. This cream does exactly that. No need to reapply and my skin looks fresh even in the evening. Fantastic product!' },

  // ── Product 5: The Night Cream ──
  { productId: '5', userName: 'Smita R.', rating: 5, title: 'Woke up with younger looking skin', comment: 'I started using this night cream three weeks ago and the change in my skin texture is remarkable. Fine lines around my eyes look softer and my skin tone has evened out. Retinol and Niacinamide together is a powerful combination.' },
  { productId: '5', userName: 'Vandana C.', rating: 5, title: 'Anti-aging results are real', comment: 'At 38 I was starting to worry about fine lines. This night cream has genuinely made a difference. My skin looks plumper in the morning and the dullness I had is completely gone. Will repurchase without a second thought.' },
  { productId: '5', userName: 'Lakshmi T.', rating: 4, title: 'Effective but start slowly', comment: 'Retinol products need to be introduced slowly and I did get mild flaking in the first week. After that my skin adjusted and now it is absolutely glowing. The key is consistency. Very effective cream once your skin adapts.' },
  { productId: '5', userName: 'Ritu S.', rating: 5, title: 'My skin routine is complete now', comment: 'Using this with the Day Cream is the perfect combination. Day protection and night repair. My skin has never looked this healthy and even my husband noticed the difference. Brilliant formulation.' },

  // ── Product 6: Saffron Face Oil ──
  { productId: '6', userName: 'Divya M.', rating: 5, title: 'Luxury in a bottle!', comment: 'This Saffron Face Oil is absolutely divine. A few drops before bed and I wake up with the most radiant glow. The texture is light for an oil and it absorbs beautifully. My skin tone has become noticeably more even and bright.' },
  { productId: '6', userName: 'Pallavi S.', rating: 5, title: 'Natural saffron goodness', comment: 'I was looking for a clean beauty face oil and this is perfect. Pure Saffron, Sweet Almond, and Grape Seed Oils — all ingredients I recognise and trust. My skin loves it. I mix a drop with my night cream and my skin is transformed.' },
  { productId: '6', userName: 'Jyoti K.', rating: 4, title: 'Glowing skin in 2 weeks', comment: 'This face oil delivers on its promise. My skin looks plumper and has a natural glow that no highlighter can replicate. It is a little pricey but the quality justifies the cost. A little goes a long way!' },

  // ── Product 7: Complexion Cream ──
  { productId: '7', userName: 'Ankita R.', rating: 5, title: 'Dark spots are fading fast!', comment: 'I have had stubborn dark spots from old acne for years. After 4 weeks of using the Complexion Cream every night, they are visibly lighter. The Alpha Arbutin and Vitamin C combination is incredibly effective. Best brightening cream I have tried.' },
  { productId: '7', userName: 'Shalini B.', rating: 5, title: 'Finally an even skin tone', comment: 'Uneven skin tone has been my biggest concern and this cream addresses it directly. My complexion is so much more uniform now. No harsh chemicals, no irritation, just results. I will use this for life.' },
  { productId: '7', userName: 'Geeta P.', rating: 4, title: 'Brightening results in 3 weeks', comment: 'Consistent use is key with this product. I noticed a subtle brightening effect in the first two weeks and by week three my dark areas were genuinely lighter. It is a gentle but effective formula that I trust.' },

  // ── Product 8: Super Glow Serum ──
  { productId: '8', userName: 'Neha A.', rating: 5, title: 'The glow is REAL', comment: 'I have used many Vitamin C serums but this one is different. It absorbs instantly, does not pill under makeup, and within 10 days I had a glow that everyone commented on. The Ferulic Acid addition makes the Vitamin C so much more effective.' },
  { productId: '8', userName: 'Kritika S.', rating: 5, title: 'Bright and even skin in days', comment: 'My skin looked dull and tired before I started this serum. Just 2 weeks in and I look refreshed and bright even without makeup. The Niacinamide helps with my open pores too. Absolutely love this product.' },
  { productId: '8', userName: 'Isha M.', rating: 4, title: 'Great for daily use', comment: 'Lightweight, non-sticky, and effective. This serum layers beautifully under moisturiser and sunscreen. My skin tone has evened out noticeably. Giving 4 stars only because I wanted a pump dispenser but the dropper works fine.' },
  { productId: '8', userName: 'Prerna V.', rating: 5, title: 'Worth every penny', comment: 'Vitamin C serum at this price point with this quality is rare in India. My hyperpigmentation has reduced and my skin has a natural luminosity that I have not had in years. Reordering immediately!' },

  // ── Product 9: Pigment Control Serum ──
  { productId: '9', userName: 'Shruti K.', rating: 5, title: 'Pigmentation visibly reduced in 3 weeks', comment: 'I have melasma and have tried countless products. This Pigment Control Serum is by far the most effective over-the-counter option I have found. Alpha Arbutin and Kojic Acid together are powerful. My patches are significantly lighter now.' },
  { productId: '9', userName: 'Mansi R.', rating: 5, title: 'Best serum for dark spots', comment: 'Post-pregnancy pigmentation was my main concern. Three weeks into using this serum and I can already see my dark spots fading. The texture is perfect — not too thick, not too watery. Absorbs in seconds.' },
  { productId: '9', userName: 'Swati D.', rating: 4, title: 'Effective and gentle', comment: 'I was worried about irritation because of Kojic Acid but this serum is incredibly gentle. No burning, no redness. Just slow and steady lightening of my pigmented areas. I am very satisfied with the results.' },

  // ── Product 10: Wrinkles & Lines Cream ──
  { productId: '10', userName: 'Sunita P.', rating: 5, title: 'Fine lines have visibly softened', comment: 'I am in my mid-40s and fine lines were bothering me. After a month of using this Wrinkles & Lines Cream, the lines around my mouth and forehead are noticeably softer. The Copper Tripeptide ingredient is something I had read great things about and it delivers.' },
  { productId: '10', userName: 'Aarti N.', rating: 5, title: 'Plumper firmer skin', comment: 'My skin feels firmer and more lifted after using this cream consistently. The texture is rich but not heavy and it sinks in beautifully. I have received compliments about looking younger and I credit this cream entirely.' },
  { productId: '10', userName: 'Radha S.', rating: 4, title: 'Good anti-aging formula', comment: 'The combination of Retinol, Alpha Arbutin, and Niacinamide in this cream tackles multiple aging concerns at once. My skin texture has improved and the crow s feet around my eyes look much less prominent. Solid product.' },

  // ── Product 11: Lines & Wrinkles Serum ──
  { productId: '11', userName: 'Meenakshi B.', rating: 5, title: 'Encapsulated retinol is a game changer', comment: 'Encapsulated Retinol means it releases slowly and does not irritate the skin the way regular retinol does. I have had zero flaking or redness with this serum. Yet the results — smoother texture, softer lines — are very real. Outstanding formulation.' },
  { productId: '11', userName: 'Hema T.', rating: 4, title: 'Visible improvement in skin texture', comment: 'Using this serum for 5 weeks now and my skin texture is noticeably smoother. The fine lines on my forehead look shallower and my skin feels firmer overall. The Grape Seed Extract and Ceramides keep the skin barrier healthy throughout.' },
  { productId: '11', userName: 'Archana V.', rating: 5, title: 'Best retinol serum at this price', comment: 'I have used retinol products costing 3 times this price that were not as effective. The encapsulated formula is clearly superior and my skin has responded beautifully with zero irritation. This is now a permanent part of my night routine.' },

  // ── Product 12: Tone & Texture Serum ──
  { productId: '12', userName: 'Puja N.', rating: 5, title: 'Pores look smaller, texture is smooth', comment: 'I struggled with large pores and rough texture for years. After just 3 weeks of using this serum, my skin is noticeably smoother and my pores appear smaller. The Niacinamide and Ceramide combination is brilliant. My foundation goes on like a dream now.' },
  { productId: '12', userName: 'Bharati M.', rating: 5, title: 'Even skin tone in 2 weeks', comment: 'The Acetyl Glucosamine in this serum really helps with uneven skin tone. Combined with Niacinamide it is a powerful brightening duo. My skin looks healthier and more uniform than it ever has. I apply it morning and evening.' },
  { productId: '12', userName: 'Chandra K.', rating: 4, title: 'Good results for textured skin', comment: 'My bumpy skin texture has smoothed out significantly. The serum is lightweight and layers well. I did not see dramatic overnight results but over 4 weeks the improvement has been genuinely impressive. Steady and consistent results.' },

  // ── Product 13: Smooth Perfection Serum ──
  { productId: '13', userName: 'Asmita R.', rating: 5, title: 'Acne cleared in 2 weeks!', comment: 'Salicylic acid serums can be harsh but this one is beautifully balanced with Witch Hazel and Squalene. My breakouts reduced dramatically in 2 weeks and my skin feels clean without being stripped. The best acne serum I have ever used.' },
  { productId: '13', userName: 'Varsha P.', rating: 5, title: 'Finally clear skin!', comment: 'Oily acne-prone skin is tough to manage but this serum has changed everything. Pores are cleaner, breakouts are fewer, and my skin looks matte and healthy all day. I use it 3 times a week as recommended and the results are incredible.' },
  { productId: '13', userName: 'Usha M.', rating: 4, title: 'Effective BHA serum', comment: 'Salicylic Acid BHA 2% is the gold standard for acne and this serum delivers it in a gentle formula. My skin purged slightly in the first week (normal with BHA) and then cleared up beautifully. Highly satisfied with the results.' },

  // ── Product 14: Radiance Cream ──
  { productId: '14', userName: 'Kamla S.', rating: 5, title: 'Brightest my skin has ever looked', comment: 'Vitamin C 20% in a cream — I was not sure what to expect but the results are phenomenal. My skin has a warm healthy glow and my dull patches have disappeared. The Kojic Acid and Argan Oil combination is luxurious and effective.' },
  { productId: '14', userName: 'Nandita R.', rating: 5, title: 'Kojic Acid really works!', comment: 'I have been using this cream for 6 weeks and my dark patches from sun damage have faded significantly. My whole face looks brighter and more youthful. The texture is rich and velvety and it smells wonderful. Genuinely love this product.' },
  { productId: '14', userName: 'Madhavi K.', rating: 4, title: 'Effective brightening cream', comment: 'Good results for brightening and pigmentation. I saw visible improvement in about 4 weeks of consistent nightly use. The Avocado and Argan Oil keep the skin deeply moisturised throughout the treatment. Very good product overall.' },

  // ── Product 15: Anti Acne Face Wash ──
  { productId: '15', userName: 'Tanvi S.', rating: 5, title: 'Finally a face wash that controls oil!', comment: 'I have extremely oily skin and have tried countless cleansers. This Salicylic Acid face wash is the only one that actually keeps my skin matte without making it feel tight or stripped. My acne has reduced by at least 70% in 4 weeks. Life changing product!' },
  { productId: '15', userName: 'Minal R.', rating: 5, title: 'Clears pores beautifully', comment: 'I use this twice a day and my pores have never been this clean. The lather is gentle, the scent is pleasant, and my skin feels fresh and balanced after every wash. No over-drying, no irritation. Just clean and clear skin.' },
  { productId: '15', userName: 'Tejal B.', rating: 4, title: 'Good cleanser for acne-prone skin', comment: 'Salicylic Acid 2% is effective for keeping acne under control and this face wash delivers it gently. My breakouts are less frequent and the ones I do get heal faster. Would recommend to anyone with oily or combination skin.' },
  { productId: '15', userName: 'Sayali M.', rating: 5, title: 'Best purchase for my skin!', comment: 'I had hormonal acne for years and this face wash has made a significant difference. Within 3 weeks my active breakouts reduced and my skin tone is more even. Combined with the Pigment Control Serum this is an unbeatable duo.' },

  // ── Product 16: Hair Therapy Serum ──
  { productId: '16', userName: 'Ritu D.', rating: 5, title: 'New hair growth in 6 weeks!', comment: 'I was experiencing significant hair fall after my pregnancy and found this serum. After 6 weeks of consistent use I can see actual new baby hairs growing along my hairline. The Redensyl and Anagain combination is clinically proven and it shows.' },
  { productId: '16', userName: 'Swati N.', rating: 5, title: 'Hair fall has reduced dramatically', comment: 'I used to collect handfuls of hair in the shower. Now it is barely noticeable. This serum absorbs without making hair greasy and my scalp feels healthier. The Biotin and Rice Water add such a nice shine to my hair as well.' },
  { productId: '16', userName: 'Anupama B.', rating: 4, title: 'Visible improvement in density', comment: 'My hair was thinning at the crown and this serum has genuinely helped. More density and less breakage after about 8 weeks of use. I apply it to my scalp every other night and it has become an essential part of my haircare routine.' },
  { productId: '16', userName: 'Seema K.', rating: 5, title: 'Scientific approach to hair growth', comment: 'Redensyl, Anagain, Biotin — these are well-researched ingredients for hair growth and this serum combines them all. My hair is noticeably thicker and the fallout in my brush is minimal. Excellent product backed by real science.' },

  // ── Product 17: Lip Butter 8g ──
  { productId: '17', userName: 'Asha P.', rating: 5, title: 'The softest lips ever!', comment: 'I apply this Lip Butter before bed every night and the next morning my lips are incredibly soft. No chemicals, no preservatives — just pure butters, oils, and honey. My dry and chapped lips are completely healed. I have bought 4 of these already!' },
  { productId: '17', userName: 'Bindu R.', rating: 5, title: 'Perfect travel size', comment: 'The 8 gram size is perfect for my handbag and travels everywhere with me. One application lasts for hours and the natural honey scent is gorgeous. My lips have never been this healthy and soft. Cannot imagine my routine without it.' },
  { productId: '17', userName: 'Chitra M.', rating: 4, title: 'Natural and effective', comment: 'Knowing this has zero chemicals makes me feel good about using it multiple times a day. My lips stay moisturised and the natural tint from the honey gives a subtle healthy colour. Very good value for money.' },

  // ── Product 18: Lip Butter 15g ──
  { productId: '18', userName: 'Disha K.', rating: 5, title: 'This is not lip balm — it is better!', comment: 'The packaging boldly says "NOT LIP BALM" and they are right. This is so much more nourishing than any lip balm I have ever tried. Pure butters and oils heal even the most cracked lips. I gifted 5 of these to friends and everyone loves it.' },
  { productId: '18', userName: 'Esha S.', rating: 5, title: 'Healed my chronic chapped lips', comment: 'I have had chronically chapped lips my entire life and had given up hope. This Lip Butter healed them completely within 2 weeks. The 15 gram jar lasts a long time and the formula is so rich. Absolutely transformative product.' },
  { productId: '18', userName: 'Falak R.', rating: 4, title: 'Better value than the smaller size', comment: 'The 15 gram jar is much better value than the 8 gram. The formula is identical and equally wonderful. Lips stay soft, supple, and healthy. No artificial ingredients, no nasty preservatives. Just nature doing what it does best.' },

  // ── Product 19: Tattoo Cleanser ──
  { productId: '19', userName: 'Rohan V.', rating: 5, title: 'Best product for tattoo aftercare', comment: 'I have multiple tattoos and have tried many cleansers. This Aloweda Tattoo Cleanser is far superior to anything else I have used. It is gentle enough to use on fresh tattoos and keeps the colours vibrant on healed ones. The citrus fruit extracts are brilliant.' },
  { productId: '19', userName: 'Karan M.', rating: 5, title: 'Tattoo colours stay vivid', comment: 'I have been using this cleanser on my healed tattoos for 3 months and the colours have never looked this bright. No fading, no dullness. The Aloe Vera and Vitamin E combination keeps the skin around my tattoos incredibly soft too.' },
  { productId: '19', userName: 'Amit S.', rating: 4, title: 'Sulphate-free and gentle', comment: 'Finding a sulphate-free cleanser specifically designed for tattoos was difficult until I found this. My fresh tattoo healed without any irritation and the colour retention during healing was exceptional. Highly recommend to anyone getting a new tattoo.' },

  // ── Product 20: Tattoo Butter ──
  { productId: '20', userName: 'Dev R.', rating: 5, title: 'Colours pop after using this!', comment: 'I apply this Tattoo Butter after showering every day and my tattoo colours are more vibrant than the day I got them. The natural butters and oils create such a rich nourishing barrier for the skin. No chemicals means I can use it freely without worry.' },
  { productId: '20', userName: 'Raj K.', rating: 5, title: 'Healed my fresh tattoo perfectly', comment: 'Used this on my fresh tattoo as recommended and the healing was smooth and fast. No scabbing, no fading, and the colours are beautifully saturated. The Shea and Cocoa Butter combination is intensely nourishing. Will buy again and again.' },
  { productId: '20', userName: 'Vijay M.', rating: 4, title: 'Best tattoo moisturiser available', comment: 'I have tried many tattoo aftercare products but this butter is the best I have found. Rich, natural, and effective. My tattooed skin is always hydrated and the artwork looks sharp and vivid. The 50 gram jar lasts a good 2 months.' },

  // ── Product 21: Winter Combo ──
  { productId: '21', userName: 'Garima S.', rating: 5, title: 'Perfect winter skincare trio!', comment: 'This winter combo is genius. The Day Cream protects from the cold and sun, the Night Cream repairs the damage winter does to skin overnight, and the Lip Butter keeps lips from chapping. My skin has never survived winter this well. Absolute must-buy!' },
  { productId: '21', userName: 'Harini R.', rating: 5, title: 'Saved my skin this winter', comment: 'I live in Delhi and winters are brutal for my skin. This combo kept my skin hydrated, protected, and glowing throughout the entire season. Great value for money and the quality of each product is excellent. Already reordered for next winter!' },
  { productId: '21', userName: 'Indira M.', rating: 4, title: 'Great value bundle', comment: 'All three products are excellent individually and together they make a complete winter routine. The Lip Butter in particular is exceptional. Lovely gift set idea too — I bought one as a gift and the recipient loved it.' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log('✅ MongoDB connected');

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews');

    // Create dummy userIds (random ObjectIds — not linked to real users)
    const reviews = REVIEWS.map((r, i) => ({
      ...r,
      userId: new mongoose.Types.ObjectId(),
      userEmail: `user${i + 1}@aloweda.com`,
      isApproved: true,
      verifiedPurchase: i % 3 !== 0, // most are verified
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000), // random within last 90 days
    }));

    await Review.insertMany(reviews, { ordered: false });
    console.log(`✅ Inserted ${reviews.length} product-specific reviews`);

    await mongoose.disconnect();
    console.log('✅ Done!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();
