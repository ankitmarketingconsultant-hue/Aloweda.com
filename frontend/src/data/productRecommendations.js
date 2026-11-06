// Product Recommendation Mappings
// Maps concerns/bundles/skin types to actual product IDs from PRODUCTS array

import SC4  from '../SkinCareImg/SkinCare4.jpg'
import SC8  from '../SkinCareImg/SkinCare8.jpg'
import SC12 from '../SkinCareImg/SkinCare12.jpg'
import SC14 from '../SkinCareImg/SkinCare14.jpg'
import SC6  from '../SkinCareImg/SkinCare6.jpg'
import LC1  from '../LipCareImg/LipCare1.jpg'
import HairCareImg from '../assets/HairCare.png'
import TattooCleanser from '../assets/TattooCleanser.png'
import TattooButter   from '../assets/TattooButter.png'

export const concernToProducts = {
  acne: ['tone-texture', 'super-glow'],
  darkspots: ['super-glow', 'day-cream', 'radiance-cream'],
  dullness: ['super-glow', 'radiance-cream', 'day-cream'],
  dryness: ['day-cream', 'radiance-cream', 'saffron-oil'],
  oiliness: ['tone-texture', 'super-glow'],
  finelines: ['radiance-cream', 'day-cream'],
  sensitive: ['day-cream', 'saffron-oil'],
  texture: ['tone-texture', 'radiance-cream'],
  sundamage: ['day-cream', 'super-glow'],
  puffiness: ['super-glow', 'day-cream', 'radiance-cream'],
  general: ['day-cream', 'super-glow', 'saffron-oil'],
  lipcare: ['lip-butter'],
  ulcers: ['lip-butter'],
  haircare: ['hair-serum'],
  earlygreying: ['hair-serum'],
  // Tattoo concerns
  'fadingink': ['tattoo-cleanser', 'tattoo-butter'],
  'itching': ['tattoo-cleanser', 'tattoo-butter'],
  'dryness': ['tattoo-butter', 'tattoo-cleanser'],
  'notHealing': ['tattoo-cleanser', 'tattoo-butter'],
  'colorsFading': ['tattoo-butter', 'tattoo-cleanser'],
}

// Hair concern to product mappings
export const hairConcernToProducts = {
  hairfall: ['hair-serum'],
  dandruff: ['hair-serum'],
  dryness: ['hair-serum'],
  frizz: ['hair-serum'],
  oilyscalp: ['hair-serum'],
  splitends: ['hair-serum'],
  lackofgrowth: ['hair-serum'],
  dullhair: ['hair-serum'],
  none: []
}

// Lip concern to product mappings
export const lipConcernToProducts = {
  dryness: ['lip-butter'],
  darkening: ['lip-butter'],
  peeling: ['lip-butter'],
  lackofmoisture: ['lip-butter'],
  finelines: ['lip-butter'],
  none: []
}

export const bundleToProducts = {
  starter: ['day-cream', 'super-glow'],
  hydration: ['day-cream', 'saffron-oil'],
  brightening: ['super-glow', 'radiance-cream', 'day-cream'],
  acnecare: ['tone-texture', 'super-glow', 'day-cream'],
  pigmentation: ['super-glow', 'day-cream'],
  antiaging: ['radiance-cream', 'day-cream'],
  complete: ['day-cream', 'super-glow', 'tone-texture']
}

export const skinTypeToProducts = {
  oily: ['tone-texture', 'super-glow'],
  dry: ['day-cream', 'saffron-oil'],
  combination: ['day-cream', 'tone-texture'],
  sensitive: ['day-cream', 'saffron-oil'],
  normal: ['day-cream', 'super-glow']
}

export const productDatabase = {
  'day-cream': {
    id: 4,
    name: 'The Day Cream SPF 30',
    size: '50 G',
    ingredients: 'Hyaluronic Acid, SPF 30, Vitamin E',
    purpose: 'Daily moisturizer with broad-spectrum SPF 30 protection. Hydrates and shields skin from UV damage.',
    routine: 'morning',
    price: 499,
    mrp: 549,
    img: SC4,
  },
  'super-glow': {
    id: 8,
    name: 'Super Glow Serum',
    size: '30 ml',
    ingredients: 'Vitamin C 15%, Niacinamide 5%, Hyaluronic Acid, Ferulic Acid 1%',
    purpose: 'Brightens dull skin, fades dark spots and delivers a visible glow with potent antioxidants.',
    routine: 'morning',
    price: 649,
    mrp: 699,
    img: SC8,
  },
  'tone-texture': {
    id: 12,
    name: 'Tone & Texture Serum',
    size: '30 ml',
    ingredients: 'Niacinamide 10%, Acetyl Glucosamine, Ceramides',
    purpose: 'Smooths uneven texture, minimises pores and evens out skin tone for a refined complexion.',
    routine: 'morning',
    price: 599,
    mrp: 649,
    img: SC12,
  },
  'radiance-cream': {
    id: 14,
    name: 'Radiance Cream',
    size: '50 G',
    ingredients: 'Vitamin C 20%, Kojic Acid, Avocado Extract, Argan Oil',
    purpose: 'Nighttime brightening cream that fades pigmentation and boosts radiance while you sleep.',
    routine: 'evening',
    price: 499,
    mrp: 549,
    img: SC14,
  },
  'saffron-oil': {
    id: 6,
    name: 'Saffron Face Oil',
    size: '30 ml',
    ingredients: 'Saffron Essential Oil, Sweet Almond Oil, Grape Seed Oil, Honey, Ghee',
    purpose: 'Deeply nourishes and revives dull skin with a luxurious natural oil blend for an evening glow.',
    routine: 'evening',
    price: 799,
    mrp: null,
    img: SC6,
  },
  'lip-butter': {
    id: 17,
    name: 'Lip Butter',
    size: '8 G',
    ingredients: 'Shea Butter, Cocoa Butter, Beeswax, Honey',
    purpose: 'Zero-chemical lip treatment that heals, softens and protects dry or chapped lips.',
    routine: 'special',
    price: 95,
    mrp: 105,
    img: LC1,
  },
  'hair-serum': {
    id: 16,
    name: 'Total Hair Therapy Serum',
    size: '50 ml',
    ingredients: 'Redensyl 5%, Anagain 5%, Rice Water, Biotin',
    purpose: 'Clinically proven ingredients to reduce hair fall, stimulate new growth and add visible shine.',
    routine: 'special',
    price: 875,
    mrp: 975,
    img: HairCareImg,
  },
  'tattoo-cleanser': {
    id: 19,
    name: 'Tattoo Cleanser',
    size: '100 ml',
    ingredients: 'Orange, Lemon & Tangerine Extracts, Aloe Vera, Vitamin E',
    purpose: 'Sulphate-free cleanser that gently cleanses tattooed skin and preserves ink vibrancy.',
    routine: 'tattoo',
    price: 195,
    mrp: 245,
    img: TattooCleanser,
  },
  'tattoo-butter': {
    id: 20,
    name: 'Tattoo Butter',
    size: '50 G',
    ingredients: 'Shea, Cocoa, Mango & Kokum Butter, Beeswax, Fig Honey',
    purpose: 'Chemical-free butter that deeply nourishes tattooed skin and keeps colours vivid.',
    routine: 'tattoo',
    price: 499,
    mrp: 599,
    img: TattooButter,
  },
}
