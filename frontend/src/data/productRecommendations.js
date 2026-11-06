// Product Recommendation Mappings
// Maps concerns/bundles/skin types to actual product IDs from PRODUCTS array

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
    routine: 'morning'
  },
  'super-glow': {
    id: 8,
    name: 'Super Glow Serum',
    size: '30 ml',
    ingredients: 'Vitamin C 15%, Niacinamide 5%, Hyaluronic Acid, Ferulic Acid 1%',
    purpose: 'Brightens dull skin, fades dark spots and delivers a visible glow with potent antioxidants.',
    routine: 'morning'
  },
  'tone-texture': {
    id: 12,
    name: 'Tone & Texture Serum',
    size: '30 ml',
    ingredients: 'Niacinamide 10%, Acetyl Glucosamine, Ceramides',
    purpose: 'Smooths uneven texture, minimises pores and evens out skin tone for a refined complexion.',
    routine: 'morning'
  },
  'radiance-cream': {
    id: 14,
    name: 'Radiance Cream',
    size: '50 G',
    ingredients: 'Vitamin C 20%, Kojic Acid, Avocado Extract, Argan Oil',
    purpose: 'Nighttime brightening cream that fades pigmentation and boosts radiance while you sleep.',
    routine: 'evening'
  },
  'saffron-oil': {
    id: 6,
    name: 'Saffron Face Oil',
    size: '30 ml',
    ingredients: 'Saffron Essential Oil, Sweet Almond Oil, Grape Seed Oil, Honey, Ghee',
    purpose: 'Deeply nourishes and revives dull skin with a luxurious natural oil blend for an evening glow.',
    routine: 'evening'
  },
  'lip-butter': {
    id: 17,
    name: 'Lip Butter',
    size: '8 G',
    ingredients: 'Shea Butter, Cocoa Butter, Beeswax, Honey',
    purpose: 'Zero-chemical lip treatment that heals, softens and protects dry or chapped lips.',
    routine: 'special'
  },
  'hair-serum': {
    id: 16,
    name: 'Total Hair Therapy Serum',
    size: '50 ml',
    ingredients: 'Redensyl 5%, Anagain 5%, Rice Water, Biotin',
    purpose: 'Clinically proven ingredients to reduce hair fall, stimulate new growth and add visible shine.',
    routine: 'special'
  },
  'tattoo-cleanser': {
    id: 19,
    name: 'Tattoo Cleanser',
    size: '100 ml',
    ingredients: 'Orange, Lemon & Tangerine Extracts, Aloe Vera, Vitamin E',
    purpose: 'Sulphate-free cleanser that gently cleanses tattooed skin and preserves ink vibrancy.',
    routine: 'tattoo'
  },
  'tattoo-butter': {
    id: 20,
    name: 'Tattoo Butter',
    size: '50 G',
    ingredients: 'Shea, Cocoa, Mango & Kokum Butter, Beeswax, Fig Honey',
    purpose: 'Chemical-free butter that deeply nourishes tattooed skin and keeps colours vivid.',
    routine: 'tattoo'
  },
}
