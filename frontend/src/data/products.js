// ─── SHARED PRODUCT DATA ───────────────────────────────────────────────────
// All product images reuse the slider assets for now.
// Replace img paths once real product images are added.

import Slide1 from '../assets/HomeSlider1.png'
import Slide2 from '../assets/HomeSlider2.png'
import Slide3 from '../assets/HomeSlider3.png'
import Slide4 from '../assets/HomeSlider4.png'
import Slide5 from '../assets/HomeSlider5.png'
import SkinCare4 from '../SkinCareImg/SkinCare4.jpg'
import SkinCare6 from '../SkinCareImg/SkinCare6.jpg'
import SkinCare12 from '../SkinCareImg/SkinCare12.jpg'
import TattooCleanser from '../assets/TattooCleanser.png'
import TattooButter from '../assets/TattooButter.png'

export const CATEGORIES = [
  { id: 'skincare',     label: 'Smart Skincare', hasSubmenu: true },
  { id: 'serums',       label: 'Serums',         parent: 'skincare' },
  { id: 'creams',       label: 'Creams',         parent: 'skincare' },
  { id: 'moisturisers', label: 'Moisturisers',   parent: 'skincare' },
  { id: 'tattoo',       label: 'Tattoo Care',      parent: 'skincare' },
  { id: 'lip',          label: 'Lip Care',         parent: 'skincare' },
  { id: 'hair',         label: 'Hair Care',        parent: 'skincare' },
  { id: 'rituals',      label: 'Skincare Rituals', parent: 'skincare' },
  { id: 'facewash',     label: 'Face Wash',        parent: 'skincare' },
]

export const PRODUCTS = [
  {
    id: 1,
    name: 'Glow Essence Face Serum',
    category: 'serums',
    price: 799,
    mrp: 999,
    tag: 'Best Seller',
    rating: 4.7,
    reviews: 284,
    img: Slide1,
    desc: 'Brightens, hydrates and evens skin tone with Vitamin C & Niacinamide.',
    bestSeller: true,
  },
  {
    id: 2,
    name: 'The Day Cream SPF 30',
    category: 'creams',
    price: 899,
    mrp: 1099,
    tag: 'New',
    rating: 4.5,
    reviews: 167,
    img: SkinCare4,
    desc: 'Lightweight daily moisturiser with broad-spectrum SPF 30 protection.',
    bestSeller: true,
    model3D: '/models/DayCreamJar.glb',
  },
  {
    id: 3,
    name: 'Super Glow Face Serum',
    category: 'serums',
    price: 749,
    mrp: 949,
    tag: 'Trending',
    rating: 4.6,
    reviews: 203,
    img: SkinCare6,
    desc: 'Hyaluronic Acid & Peptide blend for plump, dewy skin in 2 weeks.',
    bestSeller: true,
  },
  {
    id: 4,
    name: 'Tone & Texture Serum',
    category: 'serums',
    price: 849,
    mrp: 1049,
    tag: 'Best Seller',
    rating: 4.8,
    reviews: 319,
    img: SkinCare12,
    desc: 'Alpha Arbutin & AHA formula for smooth, even-toned skin.',
    bestSeller: true,
  },
  {
    id: 5,
    name: 'Radiance Night Cream',
    category: 'creams',
    price: 999,
    mrp: 1299,
    tag: 'Premium',
    rating: 4.4,
    reviews: 142,
    img: Slide5,
    desc: 'Retinol & Squalane night repair cream for youthful, glowing skin.',
    bestSeller: false,
  },
  {
    id: 6,
    name: 'Deep Moisture Lotion',
    category: 'moisturisers',
    price: 649,
    mrp: 799,
    tag: 'Value Pick',
    rating: 4.3,
    reviews: 98,
    img: Slide1,
    desc: 'All-day hydration with Ceramides and Aloe Vera. Fragrance-free.',
    bestSeller: false,
  },
  {
    id: 7,
    name: 'Tattoo Cleanser 100 ml',
    subtitle: 'Concentrate: Gentle Citrus Fruit wash for your Timeless Tattoo',
    category: 'tattoo',
    price: 195,
    mrp: 245,
    tag: 'New',
    rating: 4.8,
    reviews: 89,
    img: TattooCleanser,
    desc: 'A gentle, sulphate-free tattoo cleanser specially formulated to cleanse tattooed skin without stripping away essential moisture. Infused with Aloe Vera, Vitamin E, and natural citrus extracts of Orange, Lemon, and Tangerine, it helps remove impurities while keeping skin feeling refreshed, hydrated, and comfortable. Mild plant-derived cleansing agents effectively cleanse the skin while supporting the natural skin barrier, making it ideal for both fresh and healed tattoos. The fragrance-free formula is designed to minimize irritation and leave tattooed skin clean, soft, and well cared for.',
    freeFrom: 'Sulphates, Parabens, Phthalates, Soap Gel, Alcohol & Fragrance',
    keyIngredients: {
      title: 'KEY INGREDIENTS',
      list: 'Aqua, Orange Extract, Lemon Extract, Tangerine Extract, Aloe Vera Extract, Lauryl Glucoside, Coco Glucoside, CocomideDiethanolamine (CDEA), Sodium Cocoyl Glutamate, Carbopool, Ultrez 20,Polyquaternium-7, Tocopherol, Acetate (Vitamin E Acetate), Glycerine,Phenoxyethanol, Disodium EDTA, No added Fragrance.'
    },
    howToUse: {
      title: 'HOW TO USE',
      steps: 'This formulation is very concentrated & thick. Apply a very small amount to wet tattooed skin & gently massage in circular motions to create a soft lather. Rinse thoroughly with water & pat dry. Follow with tattoo butter or moisturizer to help keep skin hydrated & comfortable. Suitable for daily use on healed tattoos & surrounding skin. Use once or twice a day. Always use after sweating, exposure to sunlight & contact with grime.'
    },
    shippingReturns: {
      title: 'SHIPPING & RETURNS',
      info: 'We process all domestic orders within 1 business day. Delivery typically takes 5-7 business days, while remote or interior locations may require 7-10 business days.'
    },
    bestSeller: false,
  },
  {
    id: 8,
    name: 'Tattoo Butter 50 Grams',
    category: 'tattoo',
    price: 799,
    mrp: 899,
    tag: 'Best Seller',
    rating: 4.9,
    reviews: 156,
    img: TattooButter,
    desc: 'NO CHEMICALS, NATURAL BUTTERS & OILS. A deeply restorative Tattoo Butter crafted to nourish, protect, and enhance the vibrancy of tattooed skin. This rich blend of shea, cocoa, mango, kokum, and clarified butter delivers intense hydration and supports faster skin recovery, while forming a protective barrier to lock in moisture. Enriched with fig honey, almond oil, and rosehip oil, it helps soften the skin, improve elasticity, and maintain a healthy appearance.',
    bestSeller: true,
  },
  {
    id: 9,
    name: 'Velvet Lip Butter',
    category: 'lip',
    price: 299,
    mrp: 399,
    tag: 'Fan Favourite',
    rating: 4.9,
    reviews: 412,
    img: Slide3,
    desc: 'Shea butter & Vitamin E lip treatment. Heals, softens, protects.',
    bestSeller: false,
  },
  {
    id: 10,
    name: 'Hair Repair Serum',
    category: 'hair',
    price: 699,
    mrp: 899,
    tag: 'New',
    rating: 4.5,
    reviews: 134,
    img: Slide4,
    desc: 'Keratin & Argan Oil serum for frizz control and shine boost.',
    bestSeller: false,
  },
  {
    id: 11,
    name: 'Glow Ritual Kit',
    category: 'rituals',
    price: 1499,
    mrp: 2097,
    tag: '3-Step Kit',
    rating: 4.8,
    reviews: 221,
    img: Slide5,
    desc: 'Complete 3-step ritual: Cleanse, Treat, Moisturise. Save 28%.',
    bestSeller: false,
  },
  {
    id: 12,
    name: 'Saffron Face Oil',
    category: 'serums',
    price: 1299,
    mrp: 1599,
    tag: 'Premium',
    rating: 4.9,
    reviews: 156,
    img: SkinCare6,
    desc: 'Pure Saffron & Vitamin E face oil for radiant, nourished skin.',
    bestSeller: false,
    model3D: '/models/SaffronFaceOilBott.glb',
  },
]

export const PRODUCT_REVIEWS = {
  1: [
    { name: 'Priya S.', loc: 'Mumbai', rating: 5, text: 'My skin has genuinely transformed. The glow is real and lasts all day.', date: '12 Jul 2026' },
    { name: 'Rhea K.', loc: 'Pune', rating: 5, text: 'Best serum I\'ve ever used. Faded my dark spots in 3 weeks.', date: '28 Jun 2026' },
    { name: 'Ananya T.', loc: 'Delhi', rating: 4, text: 'Great product, subtle scent, absorbs fast. Would re-buy.', date: '15 Jun 2026' },
  ],
  2: [
    { name: 'Meera V.', loc: 'Bangalore', rating: 5, text: 'Love that it has SPF. My skin stays hydrated all day.', date: '10 Jul 2026' },
    { name: 'Sunita G.', loc: 'Chennai', rating: 4, text: 'Light texture, no white cast. Great for daily use.', date: '2 Jul 2026' },
  ],
  3: [
    { name: 'Arjun M.', loc: 'Delhi', rating: 5, text: 'Skin looks plump and dewy. My wife noticed the difference.', date: '18 Jul 2026' },
    { name: 'Kavya L.', loc: 'Hyderabad', rating: 4, text: 'Works well, a little pricey but worth it.', date: '5 Jul 2026' },
  ],
  4: [
    { name: 'Sneha R.', loc: 'Bangalore', rating: 5, text: 'Texture has improved so much. My pores look smaller.', date: '20 Jul 2026' },
    { name: 'Pooja M.', loc: 'Mumbai', rating: 5, text: 'Holy grail product. Don\'t stop making this!', date: '14 Jul 2026' },
    { name: 'Tanya B.', loc: 'Kolkata', rating: 4, text: 'Smooth skin in 2 weeks. Happy with the results.', date: '8 Jul 2026' },
  ],
}
