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
    name: 'Hyaluronic Acid, SPF 30 & Vitamin E : The Day Cream 50 G',
    size: '50 G',
    ingredients: 'Aqua, Hyaluronic Acid, Butyl Methoxy dibenzoyl methane, Benzophenone-3, Micronized Titanium Dioxide, Zinc Oxide, Vitamin E, Phospholipids, Cucumber Extract, Argan oil, Carrot oil, Butylene Glycol, Ethyl hexyl Methoxycinnamate Cetyl alcohol, Glyceryl mono stearate, Stearic Acid, Ethyl hexyl glycerine, Sodium Metabisulfite, glycerine, Carbomer, Ceteareth-20, Triethanolamine, Isopropyl myristate, Disodium EDTA, Calamine, Xylitol, Multi Vitamin Complex, Phenoxyethanol & Tangerine fragrance',
    purpose: "A lightweight, protective SPF 30 Day Cream formulated to hydrate, nourish, and shield the skin from daily sun damage. Combines broad-spectrum UV filters with skin-loving actives. No need for additional sunscreen.",
    routine: 'morning',
    price: 499,
    mrp: 549,
    img: SC4,
  },
  'super-glow': {
    id: 8,
    name: 'Vitamin C 15%, Niacinamide 5%, Hyaluronic Acid & Ferulic Acid 1% Serum 30 ml for Super Glow',
    size: '30 ml',
    ingredients: 'Aqua, 3-o-ethyl ascorbic acid, Niacinamide, Ferulic Acid, Sodium Hyaluronate, Kojic Acid, Allantoin, Ceramide NP, Propanediol, phenoxyethanol, Ethylhexyglycerine, Propylene Glycol, Sodium PCA, Xanthan Gum, Carbomer, Grape Seed Extract, Potassium Sorbate, Sodium Citrate, fragrance',
    purpose: "Advanced brightening & barrier repair serum with 3-O-Ethyl Ascorbic Acid, Niacinamide, Ferulic Acid and Kojic Acid. Visibly brightens skin, improves uneven tone and supports a luminous complexion.",
    routine: 'morning',
    price: 649,
    mrp: 699,
    img: SC8,
  },
  'tone-texture': {
    id: 12,
    name: 'Niacinamide 10 %, Acetyl Glucosamine & Ceramides 30 ml Serum for Tone & Texture',
    size: '30 ml',
    ingredients: 'Aqua, Niacinamide, Acetyl Glucosamine, Ceramide, Avocado Extract, Glycerine, Propanediol, Phenoxyethanol, Kojic Acid, Ethylhexylglycerine, Allantoin, Carbomer, Sodium Hyaluronate, Ceramide NP, Propylene Glycol, Sodium PCA, Xanthan Gum, Grape Seed Extract, Potassium Sorbate, Sodium Citrate & fragrance',
    purpose: "Targeted brightening and barrier-repair serum that improves uneven skin tone, refines texture and boosts radiance. Niacinamide reduces dullness while ceramides deeply nourish and reinforce the skin barrier.",
    routine: 'morning',
    price: 599,
    mrp: 649,
    img: SC12,
  },
  'radiance-cream': {
    id: 14,
    name: 'Vitamin C 20%, Kojic Acid, Avocado Extract & Argan Oil : Radiance Cream 50 G',
    size: '50 G',
    ingredients: 'Aqua, Ascorbic Acid (Vitamin C) 15%, Aloe Vera Extract, Xanthan Gum, Honey, Vitamin E, Glycerine, Allantoin, Lactic Acid, Propylene Glycol, Sodium Hyaluronate, Potassium Sorbate, Phenoxyethanol, Fragrance',
    purpose: "Potent Vitamin C brightening cream with 20% ascorbic acid. Visibly enhances radiance, evens out skin tone and reduces dullness and dark spots. Use once daily, preferably at night.",
    routine: 'evening',
    price: 499,
    mrp: 549,
    img: SC14,
  },
  'saffron-oil': {
    id: 6,
    name: 'Saffron Face Oil 30 ml: Saffron Essential Oil, Sweet Almond oil, Grape Seed Oil, Honey & Ghee',
    size: '30 ml',
    ingredients: 'Saffron Essential Oil 1%, Sweet Almond oil, Grape Seed Oil, Sesame Oil, Jojoba Oil, Ghee & Fig Honey. NO PRESERVATIVES, NO CHEMICALS, NO ADDED FRAGRANCE',
    purpose: "Luxurious facial oil that deeply nourishes and enhances skin vitality. Replenishes moisture, improves skin softness and promotes a naturally radiant complexion. Rich yet lightweight — absorbs effortlessly.",
    routine: 'evening',
    price: 799,
    mrp: null,
    img: SC6,
  },
  'lip-butter': {
    id: 17,
    name: 'Lip Butter 8 Gram: Butters, Oils & Honey. ZERO CHEMICALS, NO PRESERVATIVES',
    size: '8 G',
    ingredients: 'Aqua, Castor oil, Sunflower oil, Jojoba Oil, Soya bean oil, Shea & Kokum butter, Mango Butter, Honey, Beeswax, Aloe vera extract, BHA, Vitamin E Acetate, Cetyl Alcohol, Sorbic acid, Sodium Hyaluronate, Essential oils',
    purpose: "Rich and creamy lip butter crafted with natural oils, nourishing butters and Vitamin E. Deeply hydrates, protects and restores lips. Non-sticky and lightweight — NOT a lip balm. Zero petrochemicals.",
    routine: 'special',
    price: 95,
    mrp: 105,
    img: LC1,
  },
  'hair-serum': {
    id: 16,
    name: 'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml',
    size: '50 ml',
    ingredients: 'Aqua, Sodium Metabisulfite, Larix Europaea Wood Extract, Glycine, Zinc Chloride, Camellia Sinensis Leaf Extract, Pisum Sativum (Pea) Sprout Extract, Sodium Benzoate, Curcuma Longa (Turmeric) Root Extract, Rice water, Caffeine, Biotin, Pentylene Glycol, Phytic Acid, Aloe vera Extract, Glycerin, Propanediol, Phenoxyethanol, Sodium Hyaluronate, Propylene Glycol, Sodium PCA, Xanthan Gum, Carbomer, Grape seed Extract, Potassium Sorbate, Sodium Citrate',
    purpose: "Scientifically formulated blend of Redensyl 5%, Anagain 5%, Rice Water and Biotin. Reduces hair fall, stimulates new growth and improves density. Non-greasy formula absorbs quickly into the scalp.",
    routine: 'special',
    price: 875,
    mrp: 975,
    img: HairCareImg,
  },
  'tattoo-cleanser': {
    id: 19,
    name: 'Tattoo Cleanser 100 ml',
    size: '100 ml',
    ingredients: 'Aqua, Orange Extract, Lemon Extract, Tangerine Extract, Aloe Vera Extract, Lauryl Glucoside, Coco Glucoside, CocomideDiethanolamine (CDEA), Sodium Cocoyl Glutamate, Carbopool, Ultrez 20, Polyquaternium-7, Tocopherol Acetate (Vitamin E Acetate), Glycerine, Phenoxyethanol, Disodium EDTA. No added Fragrance.',
    purpose: "Gentle, sulphate-free tattoo cleanser formulated to cleanse tattooed skin without stripping moisture. Infused with Aloe Vera, Vitamin E and natural citrus extracts. Ideal for both fresh and healed tattoos.",
    routine: 'tattoo',
    price: 195,
    mrp: 245,
    img: TattooCleanser,
  },
  'tattoo-butter': {
    id: 20,
    name: 'Tattoo Butter 50 Grams, NO CHEMICALS, NATURAL BUTTERS & OILS',
    size: '50 G',
    ingredients: 'Shea Butter, Cocoa Butter, Mango Butter, Kokum Butter, Clarified Butter, Fig Honey, Rosemary Essential oil, Rose Hip Oil, Almond Oil, Gotu Kola Extract, Beeswax, Niacinamide, Panthenol, Lemongrass Extract, Cardamom Essential Oil & Sandalwood Essential oil. NO CHEMICALS. NO ADDITIVES. NO PRESERVATIVES.',
    purpose: "Deeply restorative tattoo butter that nourishes, protects and enhances ink vibrancy. Rich blend of shea, cocoa, mango, kokum and clarified butter with fig honey and botanical actives. No chemicals, no preservatives.",
    routine: 'tattoo',
    price: 499,
    mrp: 599,
    img: TattooButter,
  },
}
