import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom'
import './App.css'
import HomePage from './Component/HomePage'
import PageTransition from './Component/PageTransition'
import BestSellerPage from './BestSeller/BestSeller'
import SkinCarePage from './ShopPages/SkinCare'
import HairCarePage from './ShopPages/HairPage'
import LipCarePage  from './ShopPages/LipCare'
import AllProductsPage from './ShopPages/Allproducts'
import ProductDetail from './ProductDetail/ProductDetail'
import Cart from './Cart/Cart'
// import CartTest from './Cart/CartTest' // Uncomment for testing
import BuildMyRegimen from './BuildMyRegimen/BuildMyRegimen'
import TattooQuiz from './TattooQuiz/TattooQuiz'
import WhatsAppButton from './Component/WhatsAppButton'
import ScrollToTop from './Component/ScrollToTop'
import Login from './Auth/Login'
import NotFound from './Pages/NotFound'
import AnnouncementBar from './Components/AnnouncementBar/AnnouncementBar'
import About from './Pages/About'
import Consultation from './Pages/Consultation'
import TermsAndConditions from './Pages/TermsAndConditions'

// Admin Panel Components
import AdminLogin from './Admin/AdminLogin'
import AdminRegister from './Admin/AdminRegister'
import QuickAdminSetup from './Admin/QuickAdminSetup'
import AdminDashboard from './Admin/AdminDashboard'
import SalesAnalytics from './Admin/SalesAnalytics'
import ProductsManagement from './Admin/ProductsManagement'
import OrdersManagement from './Admin/OrdersManagement'
import AddProduct from './Admin/AddProduct'
import VisualEditor from './Admin/VisualEditor'

// Import all products
import SC1  from './SkinCareImg/SkinCare1.png'
import SC2  from './SkinCareImg/SkinCare2.png'
import SC3  from './SkinCareImg/SkinCare3.jpg'
import SC4  from './SkinCareImg/SkinCare4.jpg'
import SC5  from './SkinCareImg/SkinCare5.jpg'
import SC6  from './SkinCareImg/SkinCare6.jpg'
import SC7  from './SkinCareImg/SkinCare7.jpg'
import SC8  from './SkinCareImg/SkinCare8.jpg'
import SC9  from './SkinCareImg/SkinCare9.jpg'
import SC10 from './SkinCareImg/SkinCare10.jpg'
import SC11 from './assets/lineandwrinkleserum.png'
import SC12 from './SkinCareImg/SkinCare12.jpg'
import SC13 from './SkinCareImg/SkinCare13.jpg'
import SC14 from './SkinCareImg/SkinCare14.jpg'
import SC15 from './SkinCareImg/SkinCare15.jpg'
import HairCareImg from './assets/HairCare.png'
import LC1 from './LipCareImg/LipCare1.jpg'
import LC2 from './LipCareImg/LipCare2.jpg'
import TattooCleanser from './assets/TattooCleanser.png'
import TattooButter from './assets/TattooButter.png'
import WinterCombo from './assets/Winter Combo.png'

// Product Detail Images
import RitualOfRadianceDetail from './ProductDetailsImages/RITUALOFRADIANCESuperGlowSerum30ml+TheDayCream+RadianceCream50gram.png'
import DayCream4Detail from './ProductDetailsImages/DayCream4.png'
import PerfectComplexionDetail from './ProductDetailsImages/PERFECTCOMPLEXIONRITUALPigmentControlSerum+TheDayCream+ComplexionCream+SmoothPerfectionSerum.png'
import YourSimpleRoutineDetail from './ProductDetailsImages/YOURSIMPLE ROUTINETheDayCream+TheNightCream+LipButter.png'
import TheNightCreamDetail from './ProductDetailsImages/TheNightCream.png'
import SaffronEssentialOilDetail from './ProductDetailsImages/SaffronEssentialOil.png'
import ComplexionCreamDetail from './ProductDetailsImages/ComplexionCream.png'
import SuperGlowSerumDetail from './ProductDetailsImages/SuperGlowSerum.png'
import PigmentControlSerumDetail from './ProductDetailsImages/PigmentControlSerum.png'
import PigmentSerum1Detail from './ProductDetailsImages/PigmentSerum1.png'
import PigmentSerum2Detail from './ProductDetailsImages/PigmentSerum2.png'
import PigmentSerum3Detail from './ProductDetailsImages/PigmentSerum3.png'
import PigmentSerum4Detail from './ProductDetailsImages/PigmentSerum4.png'
import PigmentSerum5Detail from './ProductDetailsImages/PigmentSerum5.png'
import LinesWrinklesSerumDetail from './assets/lineandwrinkleserum.png'
import ToneTextureSerumDetail from './ProductDetailsImages/Tone&TextureSerum30ml.png'
import RadianceCreamDetail from './ProductDetailsImages/RadianceCream.png'
import RadianceCream1Detail from './ProductDetailsImages/RadianceCream1.png'
import RadianceCream2Detail from './ProductDetailsImages/RadianceCream2.png'
import RadianceCream3Detail from './ProductDetailsImages/RadianceCream3.png'
import RadianceCream4Detail from './ProductDetailsImages/RadianceCream4.png'
import RadianceCream5Detail from './ProductDetailsImages/RadianceCream5.png'
import SmoothPerfectionSerumDetail from './ProductDetailsImages/alowedasmoothperfectionserum.png'

// All products database
const ALL_PRODUCTS = [
  // Skin Care Products
  { 
    id: 1, 
    img: YourSimpleRoutineDetail, // Changed to new detail image
    images: [YourSimpleRoutineDetail], // Only show new image
    name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', 
    category: 'Combo', 
    keywords: 'day cream night cream lip butter routine combo kit summer care spf hyaluronic acid retinol niacinamide sun protection hydration', 
    price: 'Rs. 899.00',
    mrp: 'Rs. 1,199.00',
    description: "YOUR SUMMER CARE ROUTINE\n\n1. THE DAY CREAM: Apply a layer 15 minutes before stepping out in the Sun. Repeat if you are in the Sun for more than 4 hours.\n\nA lightweight, protective SPF 30 Day Cream formulated with Hyaluronic Acid to hydrate, nourish, and shield the skin from daily sun damage, this advanced blend combines broad-spectrum UV filters with skin-loving actives for complete daytime care. A combination of chemical and mineral sunscreens helps protect against both UVA and UVB rays, reducing the risk of sunburn, tanning, and premature ageing.\n\n2. THE NIGHT CREAM: Wake up to smoother, brighter, and deeply nourished skin with The Night Cream.\n\nA rich overnight treatment cream formulated with Retinol, Niacinamide, Hyaluronic Acid, and Vitamin E to help visibly improve skin texture, support overnight renewal, and promote a smoother, more radiant-looking complexion. Nourishing Argan Oil and Carrot Oil help condition and soften the skin, while Aloe Vera Extract, Glycerin, Butylene Glycol, and Xylitol provide lasting hydration and help maintain moisture balance throughout the night. Enhanced with a Multi Vitamin Complex and skin-conditioning emollients for a supple, refreshed feel, this luxurious cream helps support a healthy-looking skin barrier while you sleep. Infused with an elegant Saffron Fragrance for a calming nighttime skincare ritual.\n\n3. LIP BUTTER: Apply and massage gently, thrice a day.\n\nPamper your lips with our rich and creamy Lip Butter, crafted with a luxurious blend of natural oils, nourishing butters, and Vitamin E. Designed to deeply hydrate, protect, and restore, it leaves your lips soft, supple, and irresistibly smooth. Its Non-Sticky & Lightweight, glides effortlessly, perfect for daily use.", 
    ingredients: 'Refer individual products for complete ingredient list. Key ingredients include: Hyaluronic Acid, SPF 30, Vitamin E, Retinol, Niacinamide, Aloe Vera Extract, Carrot Oil, Argan Oil, Shea Butter, Cocoa Butter, Beeswax, Honey', 
    howToUse: 'Morning: Apply The Day Cream 15 minutes before sun exposure. Repeat if in sun for more than 4 hours. Evening: Apply The Night Cream before bed. Leave overnight. Lip Butter: Apply and massage gently, thrice a day. Refer individual products for detailed usage instructions.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.'
  },
  { 
    id: 2, 
    img: PerfectComplexionDetail, // Changed to new detail image
    images: [PerfectComplexionDetail], // Only show new image
    name: 'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream + Complexion Cream + Smooth Perfection Serum', 
    category: 'Combo', 
    keywords: 'pigment control serum day cream complexion smooth perfection ritual combo kit alpha arbutin vitamin c dark spots even tone ceramides spf', 
    price: 'Rs. 1,299.00',
    mrp: 'Rs. 1,599.00',
    description: "PERFECT COMPLEXION ROUTINE\n\nA lightweight, hydrating serum designed to visibly reduce dark spots, even out skin tone, and calm irritation—without compromising your skin barrier. This pigment-correcting formula harnesses the power of 2% Alpha Arbutin, paired with Aloe Vera and Ceramides to deliver effective brightening while supporting sensitive or compromised skin.\n\n2. THE DAY CREAM: Apply a layer 15 minutes before stepping out in the Sun.\n\nA lightweight, protective SPF 30 Day Cream formulated to hydrate, nourish, and shield the skin from daily sun damage, this advanced blend combines broad-spectrum UV filters with skin-loving actives for complete daytime care. A combination of chemical and mineral sunscreens helps protect against both UVA and UVB rays, reducing the risk of sunburn, tanning, and premature ageing.\n\n3. COMPLEXION CREAM: Apply Twice a day: AM + PM. Allow your skin to absorb it completely in 2 minutes. Apply more before going to bed. Allow it to work for 8 hours.\n\nA targeted skin tone care cream formulated with Alpha Arbutin and a multi-form Vitamin C complex to help improve the appearance of uneven skin tone and dullness. Enriched with Aloe Vera, Cucumber Extract, Avocado Extract, Vitamin E, Calamine, and botanical oils, it helps moisturise, soothe, and support a clearer-looking complexion with regular use. Micro Crystalline Wax polishes your skin.\n\n4. SMOOTH PERFECTION SERUM: Apply Thrice a Week ONLY. Allow your skin to absorb it completely in 2 minutes.", 
    ingredients: 'Refer individual products for complete ingredient list. Key ingredients include: Alpha Arbutin 2%, Kojic Acid 1%, Vitamin C 15%, Salicylic Acid 2%, Ceramides, Aloe Vera, Cucumber Extract, Avocado Extract, Vitamin E, Calamine, SPF 30, Hyaluronic Acid', 
    howToUse: 'Morning: Apply Pigment Control Serum, then The Day Cream 15 minutes before sun exposure. Evening: Apply Pigment Control Serum, then Complexion Cream (allow to work for 8 hours). Smooth Perfection Serum: Use thrice a week only. Refer individual products for detailed usage instructions.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.'
  },
  { 
    id: 3, 
    img: RitualOfRadianceDetail, // Changed main image to new one
    images: [RitualOfRadianceDetail], // Only show new image, no gallery
    name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', 
    category: 'Combo', 
    keywords: 'super glow serum day cream radiance ritual combo kit glow vitamin c ferulic acid niacinamide kojic acid radiant skin 30 days brightening', 
    price: 'Rs. 1,149.00',
    mrp: 'Rs. 1,299.00',
    description: "RADIANCE RITUAL: Gives you radiant skin in 30 DAYS!\n\n1. SUPER GLOW SERUM: Apply Twice a day: Apply in the morning and evening (AM + PM)\n\nA high-performance, lightweight skin-brightening serum formulated with 3-O-Ethyl Ascorbic Acid, Niacinamide, Kojic Acid, and Ferulic Acid to help improve the appearance of uneven tone and dullness. Enriched with Sodium Hyaluronate, Ceramide NP and soothing Allantoin, it helps hydrate, smooth, and support a healthier-looking skin barrier. Vitamin C, a powerful antioxidant, helps brighten dull skin and support a smoother appearance, while Ferulic Acid works to stabilise and enhance antioxidant activity, protecting the skin from daily environmental stressors. Niacinamide complements the formula by helping refine skin texture, support the skin barrier, and promote a balanced, healthy-looking glow.\n\n2. THE DAY CREAM: Apply a layer 15 minutes before stepping out in the Sun. Repeat if you are in the Sun for more than 4 hours. You need not apply if you are staying indoors.\n\nA lightweight, protective SPF 30 Day Cream formulated with Hyaluronic Acid to hydrate, nourish, and shield the skin from daily sun damage, this advanced blend combines broad-spectrum UV filters with skin-loving actives for complete daytime care. A combination of chemical and mineral sunscreens helps protect against both UVA and UVB rays, reducing the risk of sunburn, tanning, and premature ageing.\n\n3. RADIANCE CREAM: Apply at Night, before going to bed. Allow it to act for 8 hours as you sleep.\n\nA potent Vitamin C brightening cream formulated with 20% ascorbic acid to visibly enhance radiance, even out skin tone, and reduce the appearance of dullness and dark spots. This high-performance formula helps support collagen production while defending the skin against environmental stress. Enriched with aloe vera extract and honey, it soothes and nourishes the skin, while glycerine and sodium hyaluronate deliver deep hydration for a plump, smooth feel. Vitamin E boosts antioxidant protection, working synergistically with Vitamin C to improve skin clarity and glow. Gentle exfoliation from lactic acid helps refine texture, while allantoin calms and comforts the skin. With a lightweight, fast-absorbing texture, this cream leaves the skin brighter, softer, and visibly revitalized with regular use.", 
    ingredients: 'Refer individual products for complete ingredient list. Key ingredients include: 3-O-Ethyl Ascorbic Acid, Vitamin C 20%, Niacinamide, Ferulic Acid, Kojic Acid, Hyaluronic Acid, SPF 30, Sodium Hyaluronate, Ceramide NP, Allantoin, Aloe Vera Extract, Honey, Vitamin E, Lactic Acid', 
    howToUse: 'Morning: Super Glow Serum (AM + PM), then The Day Cream 15 minutes before sun exposure. Evening: Super Glow Serum, then Radiance Cream at night (allow to act for 8 hours). Refer individual products for detailed usage instructions.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.'
  },
  { 
    id: 4, 
    img: DayCream4Detail, // Changed main image to new one
    images: [DayCream4Detail], // Only show new image, no gallery
    name: 'Hyaluronic Acid, SPF 30 & Vitamin E : The Day Cream 50 G', 
    category: 'Cream', 
    keywords: 'hyaluronic acid spf vitamin e day cream moisturizer sunscreen protection hydrating revitalising uva uvb broad spectrum', 
    price: 'Rs. 499.00',
    mrp: 'Rs. 549.00',
    description: "Aloweda's The Day Cream: Hydrating | Protective | Revitalising throughout the day!\n\nA lightweight, protective SPF 30 Day Cream formulated to hydrate, nourish, and shield the skin from daily sun damage, this advanced blend combines broad-spectrum UV filters with skin-loving actives for complete daytime care. A combination of chemical and mineral sunscreens helps protect against both UVA and UVB rays, reducing the risk of sunburn, tanning, and premature ageing.\n\nInfused with hyaluronic acid and glycerine, it delivers long-lasting hydration, while phospholipids enhance skin barrier function and improve moisture retention. Antioxidant-rich vitamin E, argan oil, and carrot oil help defend against environmental stressors, while cucumber extract and calamine soothe and refresh the skin. A multi vitamin complex supports overall skin health, leaving the complexion soft, smooth, and radiant. With a non-greasy texture and a refreshing hint of tangerine, this day cream is ideal for everyday use, providing hydration, comfort, and sun protection in one step.\n\nHow to Use: Apply over entire face & neck with upward circular motions, 15 minutes before stepping out in sun. Allow your skin to absorb cream. No need for additional sunscreen. Reapply as needed during the day for it to work for 8 to 10 hours.\n\nWhen to Use: Daytime use, every morning as the final step of your skincare routine. Reapply as needed during prolonged sun exposure.\n\nTip to Improve Effect: For optimal protection, apply 15–20 minutes before sun exposure and reapply every 2–3 hours, especially after sweating or wiping the skin. Pair with protective clothing for extended outdoor activity.", 
    ingredients: 'Aqua, Hyaluronic Acid, Butyl Methoxy dibenzoyl methane, Benzophenone-3, Micronized Titanium Dioxide, Zinc Oxide, Vitamin E, Phospholipids, Cucumber Extract, Argan oil, Carrot oil, Butylene Glycol, Ethyl hexyl Methoxycinnamate Cetyl alcohol, Glyceryl mono stearate, Stearic Acid, Ethyl hexyl glycerine, Sodium Metabisulfite, glycerine, Carbomer, Ceteareth-20, Triethanolamine, Isopropyl myristate, Disodium EDTA, Calamine, Xylitol, Multi Vitamin Complex, Phenoxyethanol & Tangerine fragrance', 
    howToUse: 'Apply over entire face & neck with upward circular motions, 15 minutes before stepping out in sun. Allow your skin to absorb cream. No need for additional sunscreen. Reapply as needed during the day for it to work for 8 to 10 hours.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '50 Grams in Recyclable, Environment Friendly glass cream jar with HDPE Cap'
  },
  { 
    id: 5, 
    img: TheNightCreamDetail, // Changed to new detail image
    images: [TheNightCreamDetail], // Only show new image
    name: 'Retinol 1%, Niacinamide 10 %, Aloe Vera Extract & Carrot oil: The Night Cream 50 G', 
    category: 'Cream', 
    keywords: 'retinol niacinamide aloe vera carrot oil night cream anti aging restore brighten replenish argan vitamin e saffron fragrance', 
    price: 'Rs. 549.00',
    mrp: 'Rs. 599.00',
    model3D: '/models/TheNightCream.glb',
    description: "Aloweda's The Night Cream: Restore. Brighten. Replenish – While You Sleep!\n\nWake up to smoother, brighter, and deeply nourished skin with The Night Cream. A rich overnight treatment cream formulated with Retinol, Niacinamide, Hyaluronic Acid, and Vitamin E to help visibly improve skin texture, support overnight renewal, and promote a smoother, more radiant-looking complexion.\n\nNourishing Argan Oil and Carrot Oil help condition and soften the skin, while Aloe Vera Extract, Glycerin, Butylene Glycol, and Xylitol provide lasting hydration and help maintain moisture balance throughout the night. Enhanced with a Multi Vitamin Complex and skin-conditioning emollients for a supple, refreshed feel, this luxurious cream helps support a healthy-looking skin barrier while you sleep. Infused with an elegant Saffron Fragrance for a calming nighttime skincare ritual.\n\nHow to Use: Apply a small amount to clean, dry skin at night. Gently massage until absorbed. Avoid eye area. Allow the formula to work while you sleep.\n\nWhen to Use: Use AT NIGHT ONLY as Retinol becomes inactive in sunlight, 2–3 times a week initially. Increase frequency as skin adapts.\n\nTip to Improve Effect: Use our The Day Cream which has moisturizer and sunscreen during the day.", 
    ingredients: 'Aqua, Retinol, Niacinamide, Vitamin E, Carrot oil, Hyaluronic Acid, Argan oil, Vitamin E, Aloe Vera Extract, Butylene Glycol, Cetyl alcohol, Glyceryl mono stearate, Stearic Acid, Ethyl hexyl glycerine, Sodium Metabisulfite, glycerine, Carbomer, Ceteareth-20, Triethanolamine, Isopropyl myristate, Disodium EDTA, Calamine, Xylitol, Multi Vitamin Complex, Phenoxyethanol & Saffron fragrance', 
    howToUse: 'Apply a small amount to clean, dry skin at night. Gently massage until absorbed. Avoid eye area. Allow the formula to work while you sleep. Use AT NIGHT ONLY, 2–3 times a week initially. Increase frequency as skin adapts. Use our The Day Cream which has moisturizer and sunscreen during the day. Discontinue use if irritation occurs. Patch test recommended before first use.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '50 Grams in Recyclable, Environment Friendly glass cream jar with HDPE Cap'
  },
  { 
    id: 6, 
    img: SaffronEssentialOilDetail, // Changed to new detail image
    images: [SaffronEssentialOilDetail], // Only show new image
    name: 'Saffron Face Oil 30 ml: Saffron Essential Oil, Sweet Almond oil, Grape Seed Oil, Honey & Ghee', 
    category: 'Oil', 
    keywords: 'saffron face oil almond grape seed honey ghee natural glow hydrate tone luxurious nourish sesame jojoba no preservatives no chemicals', 
    price: 'Rs. 799.00',
    model3D: '/models/SaffronFaceOilBott.glb', 
    description: "Aloweda's Saffron Face Oil: Glow | Hydrate | Tone during your sleep!\n\nA luxurious facial oil crafted to deeply nourish and enhance skin vitality. Infused with saffron and a blend of essential oils including sweet almond, this formula replenishes moisture, improves skin softness, and promotes a naturally radiant complexion. Rich yet lightweight, it absorbs effortlessly, leaving skin supple, smooth, and glowing without heaviness.\n\nHow to Use: Take a small amount and warm it between your fingertips. Gently massage onto clean skin until absorbed.\n\nWhen to Use: Night use is recommended, or anytime skin feels dry, dull, or in need of intensive nourishment.\n\nTip to Improve Effect: Apply on slightly damp skin after cleansing to help lock in moisture. For enhanced results, use as an overnight skin nourishment mask and rinse gently in the morning if desired.", 
    ingredients: 'Saffron Essential Oil 1%, Sweet Almond oil, Grape Seed Oil, Sesame Oil, Jojoba Oil, Ghee & Fig Honey. NO PRESERVATIVES, NO CHEMICALS, NO ADDED FRAGRANCE', 
    howToUse: 'Take a small amount and warm it between your fingertips. Gently massage onto clean skin until absorbed. Night use is recommended, or anytime skin feels dry, dull, or in need of intensive nourishment. Tip: Apply on slightly damp skin after cleansing to help lock in moisture. For enhanced results, use as an overnight skin nourishment mask and rinse gently in the morning if desired.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '30 ml in glass bottle with pump'
  },
  { 
    id: 7, 
    img: ComplexionCreamDetail, // Changed to new detail image
    images: [ComplexionCreamDetail], // Only show new image
    name: 'Alpha Arbutin 2%, Vitamin C 15 % & Micro Crystalline Wax: Complexion Cream 50 G', 
    category: 'Cream', 
    keywords: 'alpha arbutin vitamin c complexion brightening pigmentation dark spots lighten brighten polish micro crystalline wax avocado argan calamine magnolia', 
    price: 'Rs. 499.00',
    mrp: 'Rs. 549.00',
    model3D: '/models/DayCreamJar.glb', 
    description: "Aloweda's Complexion Cream: LIGHTEN, BRIGHTEN & POLISH\n\nThis luxurious skin-conditioning cream for complexion is formulated with Alpha Arbutin, Sodium Ascorbyl Phosphate and Magnesium Ascorbyl Phosphate to help visibly brighten skin and improve the appearance of uneven tone for a more radiant-looking complexion.\n\nEnriched with Avocado Extract, Argan Oil, Carrot Oil, Cucumber Extract, Aloe Vera Extract, and a Multi Vitamin Complex to provide deep nourishment and antioxidant care, while Glycerin, Xylitol, and Isopropyl Myristate help maintain lasting hydration and skin softness. Calamine and Allantoin-inspired soothing elements help comfort dry-looking skin, while Ceramide-supportive emollients and Vitamin E help support a smoother, healthier-looking skin barrier. Finished with an elegant Magnolia Fragrance for a refined skincare experience.\n\nHow to Use: Gently apply using fingers or a cotton pad over entire face, neck including the eye area. Apply at night for it to act overnight. The cream is a bit sticky than other creams because of Honey. Avoid the eye area.\n\nWhen to Use: Preferably use at night. Begin with once-daily application or as advised by a skincare professional.\n\nTip to Improve Effect: Use our The Day Cream while using this product. Avoid combining with other strong exfoliating or active treatments unless recommended. Patch test before first use.", 
    ingredients: 'Aqua, Alpha Arbutin, 3-oethyl ascorbic acid, Sodium Ascorbyl Phosphate, Magnesium Ascorbyl Phosphate, Micro Crystalline Wax, Avocado Extract, Argan oil, Carrot oil, Cucumber Extract, Vitamin E, Cetyl alcohol, Glyceryl mono stearate, Stearic Acid, Ethyl hexyl glycerine, Sodium Metabisulfite, glycerine, Carbomer, Ceteareth-20, Triethanolamine, Isopropyl myristate, Disodium EDTA, Aloe vera Extract, Hydroquinone, Calamine, Xylitol, Multi Vitamin Complex, Phenoxyethanol & Magnolia Fragrance', 
    howToUse: 'Gently apply using fingers or a cotton pad over entire face, neck including the eye area. Apply at night for it to act overnight. The cream is a bit sticky than other creams because of Honey. Avoid the eye area. Preferably use at night. Begin with once-daily application or as advised by a skincare professional. Use our The Day Cream while using this product. Avoid combining with other strong exfoliating or active treatments unless recommended. Patch test before first use.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '50 g in a recyclable, eco-friendly glass jar with HDPE cap'
  },
  { 
    id: 8, 
    img: SuperGlowSerumDetail, // Changed to new detail image
    images: [SuperGlowSerumDetail], // Only show new image
    name: 'Vitamin C 15%, Niacinamide 5%, Hyaluronic Acid & Ferulic Acid 1% Serum 30 ml for Super Glow', 
    category: 'Serum', 
    keywords: 'vitamin c ferulic acid niacinamide super glow serum brightening radiance texture smoothness advanced 3-o-ethyl ascorbic acid ceramide hyaluronate', 
    price: 'Rs. 649.00',
    mrp: 'Rs. 699.00',
    model3D: '/models/AlovedaSuperGlowSerum.glb', 
    description: "Aloweda's Super Glow Serum: RADIANCE. TEXTURE. SMOOTHNESS\nAdvanced Brightening & Barrier Repair Serum\n\nThis advanced high-performance radiance serum is formulated with 3-O-Ethyl Ascorbic Acid, Niacinamide, Ferulic Acid, and Kojic Acid to help visibly brighten skin, improve the appearance of uneven tone, and support a more luminous complexion.\n\nSodium Hyaluronate, Sodium PCA, and Propanediol provide deep hydration and help maintain skin moisture balance, while Ceramide NP helps support the skin barrier for a smoother, healthier-looking appearance. Enriched with Allantoin and Grape Seed Extract for soothing antioxidant care, this lightweight serum helps leave skin feeling soft, replenished, and revitalized with a refined glow.\n\nVitamin C in the form of 3-O-ethyl Ascorbic Acid is extremely powerful BUT very sensitive & unstable. So Ferulic acid is added to stabilizes and provides antioxidant support to Vitamin C.\n\nHow to Use: Wash face with water / mild cleansing agent. Pat dry. Pump 2–3 drops of serum in the palm or directly on the face. Apply evenly on face and neck by gently tapping it on the skin with your fingertips with circular motions. Do Not massage. Allow the serum to be completely absorbed by the skin.\n\nWhen to Use: Twice a day: early morning and before going to bed at night.\n\nTip to Improve Effect: For optimal results, consistently use our The Day Cream during the day. Avoid layering with other strong exfoliating or brightening treatments over this serum as this serum is slightly acidic in nature.", 
    ingredients: 'Aqua, 3-o-ethyl ascorbic acid, Niacinamide, Ferulic Acid, Sodium Hyaluronate, Kojic Acid, Allantoin, Ceramide NP, Propanediol, phenoxyethanol, Ethylhexyglycerine, Propylene Glycol, Sodium PCA, Xanthan Gum, Carbomer, Grape Seed Extract, Potassium Sorbate, Sodium Citrate, fragrance', 
    howToUse: 'Wash face with water / mild cleansing agent. Pat dry. Pump 3-5 drops of serum on the face. Apply evenly on face and neck by gently tapping it on the skin with your fingertips with circular motions. Do Not massage. Allow the serum to be completely absorbed by the skin. Use twice a day: early morning and before going to bed at night.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '30 ml Serum in Glass bottle with Pump'
  },
  { 
    id: 9, 
    img: PigmentControlSerumDetail, 
    images: [PigmentControlSerumDetail, PigmentSerum1Detail, PigmentSerum2Detail, PigmentSerum3Detail, PigmentSerum4Detail, PigmentSerum5Detail], 
    name: 'Alpha Arbutin 2%, Aloe Vera Extract, Ceramides & Kojic Acid 1%: Pigment Control Serum 30 ml', 
    category: 'Serum', 
    keywords: 'alpha arbutin aloe vera ceramides kojic acid pigment control dark spots fades melasma blackheads blemishes clear skin brightening 45 days', 
    price: 'Rs. 599.00',
    mrp: 'Rs. 649.00',
    model3D: '/models/PigmentControlSerum.glb', 
    description: "Aloweda's Pigment Control Serum: FADES MELASMA, BLACKHEADS & BLEMISHES for a clear skin!\n\nA gentle yet effective brightening and hydration cream designed to improve uneven skin tone and restore a healthy glow. Powered by 2% alpha arbutin and 1% kojic acid, it helps visibly reduce dark spots, pigmentation, Melasma, blackheads and dullness for a clearer, more radiant complexion in about 45 Days.\n\nInfused with aloe vera extract and allantoin, the formula soothes and calms the skin, while sodium hyaluronate and propanediol provide deep hydration and a plumping effect. Ceramide NP strengthens the skin barrier, helping retain moisture and protect against environmental stress. Lightweight humectants and a smooth gel-cream base ensure quick absorption without greasiness. With regular use, this serum leaves the skin softer, brighter, and more even-toned, with a fresh and healthy-looking finish.\n\nTIP: Combine this serum with our Complexion Cream + use The Day Cream for great results.\n\nHow to use: Wash face with water / mild cleansing agent. Pat dry. Pump 2–3 drops of serum in the palm or directly on the face. Apply evenly on face and neck by gently tapping it on the skin with your fingertips with circular motions. Do Not massage. Allow the serum to be completely absorbed by the skin. You may want to follow with moisturiser.\n\nWhen to apply: Ideally before going to bed. Not advisable to expose face to sunlight after applying Alpha Arbutin.", 
    ingredients: 'Aqua, Alpha Arbutin 1%, Aloe Vera Extract, Ceramide NP, Kojic Acid 1%, Sodium Hyaluronate, Propanediol, Ceramide NP, Ethylhexyl glycerine, Allantoin, Propylene Glycol, Xanthan Gum, Carbomer, Potassium Sorbate, Sodium Citrate, Phenoxyethanol & fragrance', 
    howToUse: 'Wash face with warm water. Pump out 5 to 10 drops in your palm & spread on your facial skin evenly with fingertip. DO NOT MASSAGE. Allow skin to absorb it completely in about 5 minutes. Use twice a day in the morning and at night. Ideally before going to bed. Not advisable to expose face to sunlight after applying Alpha Arbutin.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '30 ml serum in glass bottle with pump'
  },
  { 
    id: 10, 
    img: SC10, 
    images: [SC10], 
    name: 'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin & Niacinamide: Wrinkles & Lines Cream 50 G', 
    category: 'Cream', 
    keywords: 'retinol copper tripeptide alpha arbutin niacinamide wrinkles lines anti aging youthful toned textured skin gotu kola avocado tuberose', 
    price: 'Rs. 549.00',
    mrp: 'Rs. 599.00', 
    description: "Aloweda's Wrinkles & Lines Cream: For YOUTHFUL, TONED & TEXTURED SKIN.\n\nA high-performance advanced skin-correcting cream formulated to visibly reduce wrinkles, improve skin tone, and enhance overall radiance. Powered by retinol, it promotes cell turnover and helps smooth fine lines, while copper tripeptide-1 supports skin repair and boosts firmness.\n\nBrightening actives like alpha arbutin, niacinamide, and hydroquinone work together to reduce pigmentation, dark spots, and uneven tone for a clearer complexion. Enriched with nourishing oils such as argan, carrot, and avocado, the cream deeply moisturizes and revitalizes the skin, while hyaluronic acid and glycerine provide intense hydration and a plumping effect. Gotu kola and cucumber extracts help soothe and calm, while vitamin E and a multi vitamin complex offer antioxidant protection against environmental stress.\n\nWith a rich yet smooth texture and a subtle tuberose fragrance, this cream leaves the skin softer, firmer, and more luminous with continued use, making it ideal for comprehensive anti-ageing and skin brightening care.\n\nHow to Use: Apply a small, pea-sized amount to clean, dry skin. Gently massage until absorbed. Avoid the eye and lip area.\n\nWhen to Use: Night use only. Start with 2–3 times a week, then increase frequency gradually as skin tolerance builds.\n\nTip to Improve Effect: Use our The Day Cream for broad-spectrum sunscreen every morning while using this product. Avoid layering with other retinol, exfoliating acids, or strong actives unless advised. Patch test before first use.", 
    ingredients: 'Aqua, Retinol, Copper Tripeptide-1, Alpha Arbutin, Niacinamide, Gotu Kola Extract, Cetyl alcohol, Glyceryl mono stearate, Stearic Acid, Sodium Metabisulfite, glycerine, Carbomer, Ceteareth-20, Isopropyl myristate, Disodium EDTA, Avocado Extract, Argan oil, Carrot oil, Cucumber Extract, Vitamin E, Hyaluronic Acid, Retinol, Niacinamide, Hydroquinone, Calamine, Xylitol, Multi Vitamin Complex, Phenoxyethanol & Tuberose fragrance', 
    howToUse: 'Wash face with cold water. Apply over entire face & neck with upward circular motions at night. Allow your skin to absorb cream. Initially apply thrice a week, later as required. Night use only. Start with 2–3 times a week, then increase frequency gradually as skin tolerance builds. Use our The Day Cream for broad-spectrum sunscreen every morning while using this product. Avoid layering with other retinol, exfoliating acids, or strong actives unless advised. Patch test before first use.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '50 Grams in Recyclable, Environment Friendly glass cream jar with HDPE Cap'
  },
  { 
    id: 11, 
    img: LinesWrinklesSerumDetail, 
    images: [LinesWrinklesSerumDetail], 
    name: 'Encapsulated Retinol 1 %, Grape Seed Extract, & Ceramides : Lines & Wrinkles Serum 30 ml', 
    category: 'Serum', 
    keywords: 'retinol grape seed ceramides lines wrinkles anti aging serum renews youthful soothing encapsulated kojic acid aloe vera minimal irritation', 
    price: 'Rs. 549.00',
    mrp: 'Rs. 599.00',
    description: "RENEWS. YOUTHFUL. SOOTHING.\n\nA gentle yet effective encapsulated retinol renewal Serum designed to smooth, hydrate, and brighten the skin with minimal irritation. Encapsulated retinol delivers a slow, controlled release to help reduce fine lines, improve texture, and support skin renewal, while kojic acid works to visibly reduce pigmentation and uneven tone.\n\nHydration and barrier support come from glycerine, sodium hyaluronate, and sodium PCA, helping to keep the skin plump and moisturized. Ceramide NP strengthens the skin barrier, while aloe vera extract and allantoin soothe and calm, making the formula suitable for regular use. Antioxidant-rich grape seed extract helps protect against environmental stress and supports overall skin health.\n\nWith a lightweight, smooth texture and quick absorption, this serum leaves the skin softer, clearer, and more radiant over time, making it ideal for modern anti-ageing and brightening care.\n\nHow to Use: Wash face with warm water. Pump out 5 to 10 drops in your palm & spread on your facial skin evenly with fingertip. DO NOT MASSAGE. Allow skin to absorb it completely in about 5 minutes. TO BE USED ONLY AT NIGHT SINCE RETINOL BECOMES INEFFECTIVE WHEN EXPOSED TO LIGHT.\n\nWhen to Use: Use at night only. Begin with alternate-night schedule for two weeks. Increase frequency gradually to every night as your skin's tolerance builds.", 
    ingredients: 'Aqua, Encapsulated Retinol, Grape Seed Extract, Ceramide NP, Aloe Vera Extract, Glycerine, Propanediol, Allantoin, Kojic Acid, Phenoxyethanol, Ethylhexylglycerine, Sodium Hyaluronate, Propylene Glycol, Sodium PCA, Xanthan Gum, Carbomer, Potassium Sorbate, Sodium Citrate & fragrance', 
    howToUse: "Wash face with warm water. Pump out 5 to 10 drops in your palm & spread on your facial skin evenly with fingertip. DO NOT MASSAGE. Allow skin to absorb it completely in about 5 minutes. TO BE USED ONLY AT NIGHT SINCE RETINOL BECOMES INEFFECTIVE WHEN EXPOSED TO LIGHT. Use at night only. Begin with alternate-night schedule for two weeks. Increase frequency gradually to every night as your skin's tolerance builds.",
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '30 ml recyclable Serum pump'
  },
  { 
    id: 12, 
    img: SC12, 
    name: 'Niacinamide 10 %, Acetyl Glucosamine & Ceramides 30 ml Serum for Tone & Texture', 
    category: 'Serum', 
    keywords: 'niacinamide acetyl glucosamine ceramides tone texture smooth skin smoothens tones boosts clear complexion avocado kojic acid grape seed', 
    price: 'Rs. 599.00', 
    mrp: 'Rs. 649.00',
    model3D: '/models/GlowedaToneTexture.glb', 
    description: "Aloweda's Tone & Texture Serum: SMOOTHENS, TONES & BOOSTS TEXTURE for a clear Complexion.\n\nA targeted brightening and barrier-repair Serum formulated to improve uneven skin tone, refine texture, and boost overall radiance. Niacinamide works to visibly reduce dullness and strengthen the skin barrier, while acetyl glucosamine and kojic acid help fade dark spots and support a more even complexion.\n\nEnriched with ceramides and avocado extract, the formula deeply nourishes and reinforces the skin's natural protective barrier, preventing moisture loss. A blend of glycerine, sodium hyaluronate, and sodium PCA delivers long-lasting hydration, keeping the skin plump and smooth. Allantoin soothes and calms, while antioxidant-rich grape seed extract helps protect against environmental stress.\n\nWith a lightweight, non-greasy texture, this serum absorbs quickly, leaving the skin softer, clearer, and visibly brighter with regular use.\n\nHow to Use: Wash face with water / mild cleansing agent. Pat dry. Pump 2–3 drops of serum on the face. Apply evenly on face and neck by gently tapping it on the skin with your fingertips with circular motions. Do Not massage. Allow the serum to be completely absorbed by the skin.\n\nWhen to Use: Preferably use at night. Can also be used in the morning followed by sunscreen.\n\nTip to Improve Effect: For best results, use consistently.", 
    ingredients: 'Aqua, Niacinamide, Acetyl Glucosamine, Ceramide, Avocado Extract, Glycerine, Propanediol, Phenoxyethanol, Kojic Acid, Ethylhexylglycerine, Allantoin, Carbomer, Sodium Hyaluronate, Ceramide NP, Propylene Glycol, Sodium PCA, Xanthan Gum, Grape Seed Extract, Potassium Sorbate, Sodium Citrate & fragrance', 
    howToUse: 'Wash face with water / mild cleansing agent. Pat dry. Pump 2–3 drops of serum on the face. Apply evenly on face and neck by gently tapping it on the skin with your fingertips with circular motions. Do Not massage. Allow the serum to be completely absorbed by the skin. You may want to follow with moisturiser or sunscreen. Preferably use at night. Can also be used in the morning followed by sunscreen. For best results, use consistently.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: 'Recyclable 30 ml Serum pump'
  },
  { 
    id: 13, 
    img: SmoothPerfectionSerumDetail, 
    images: [SmoothPerfectionSerumDetail], 
    name: 'Salicylic Acid 2%, Witch Hazel Extract & Squalene: Smooth Perfection Serum 30 ml', 
    category: 'Serum', 
    keywords: 'salicylic acid witch hazel squalene smooth perfection acne pores bha skin perfecting exfoliate clarify kojic acid aloe vera ceramide', 
    price: 'Rs. 549.00',
    mrp: 'Rs. 599.00',
    model3D: '/models/AlowvedaSmoothPerfe.glb', 
    description: "Aloweda's Skin Perfecting BHA Serum\n\nA lightweight skin-refining serum formulated with 2% BHA (Salicylic Acid), Kojic Acid, and Witch Hazel Extract to help gently exfoliate, visibly clarify pores, and improve the appearance of uneven-looking skin for a smoother, clearer complexion.\n\nSqualane, Aloe Vera Extract, Glycerin, Sodium Hyaluronate, and Sodium PCA provide lasting hydration and help maintain skin moisture balance without feeling heavy. Ceramide NP helps support the skin barrier, while Allantoin and Grape Seed Extract provide soothing antioxidant care for a calm, refreshed feel. Enhanced with Propanediol and skin-conditioning actives, this serum helps leave skin looking balanced, refined, and revitalized with a healthy-looking glow.\n\nSalicylic Acid is a great ingredient for skin BUT it can cause irritation. The accompanying cast of other ingredients in this serum provides protection against irritation while providing all benefits. Patch test before first use is desirable though not mandatory.\n\nHow to Use: Apply a thin layer to clean, dry skin. Gently spread over the face or targeted areas. Avoid the eye and lip area.\n\nWhen to Use: Use at night only. Start with just twice a week, then increase frequency as skin tolerance builds.\n\nTip to Improve Effect: Always apply a broad-spectrum sunscreen during the day like our THE DAY CREAM while using this product. Avoid using other exfoliating acids or retinoids on the same night.", 
    ingredients: 'Aqua, BHA 2% (Salicylic Acid), Witch Hazel Extract, Squalane, Aloe Vera Extract, Glycerine, Propanediol, Allantoin, Kojic Acid, Phenoxyethanol, Ethylhexylglycerine, Sodium Hyaluronate, Ceramide NP, Propylene Glycol, Sodium PCA, Xanthan Gum, Carbomer, Grape Seed Extract, Potassium Sorbate, Sodium Citrate & fragrance', 
    howToUse: 'Wash face with warm water. Apply 5 to 10 drops of serum on the facial skin and gently spread it. Allow it to be absorbed by the skin completely. Initially, apply on alternate days, then as required. Use at night only. Start with 2–3 times a week, then increase frequency as skin tolerance builds. Always apply broad-spectrum sunscreen during the day.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '30 ml recyclable Serum pump'
  },
  { 
    id: 14, 
    img: RadianceCreamDetail, 
    images: [RadianceCreamDetail, RadianceCream1Detail, RadianceCream2Detail, RadianceCream3Detail, RadianceCream4Detail, RadianceCream5Detail], 
    name: 'Vitamin C 20%, Kojic Acid, Avocado Extract & Argan Oil : Radiance Cream 50 G', 
    category: 'Cream', 
    keywords: 'vitamin c kojic acid avocado argan oil radiance brightening glow brighten moisturise clear complexion ascorbic acid aloe vera honey lactic acid', 
    price: 'Rs. 499.00',
    mrp: 'Rs. 549.00',
    description: "Aloweda's Radiance Cream: BRIGHTEN, MOISTURISE & CLEAR COMPLEXION.\n\nA potent Vitamin C brightening cream formulated with 20% ascorbic acid to visibly enhance radiance, even out skin tone, and reduce the appearance of dullness and dark spots. This high-performance formula helps support collagen production while defending the skin against environmental stress.\n\nEnriched with aloe vera extract and honey, it soothes and nourishes the skin, while glycerine and sodium hyaluronate deliver deep hydration for a plump, smooth feel. Vitamin E boosts antioxidant protection, working synergistically with Vitamin C to improve skin clarity and glow. Gentle exfoliation from lactic acid helps refine texture, while allantoin calms and comforts the skin. With a lightweight, fast-absorbing texture, this cream leaves the skin brighter, softer, and visibly revitalized with regular use.\n\nA nourishing skin-brightening cream formulated with a triple Vitamin C complex and Kojic Acid to help improve the appearance of dullness and uneven skin tone. Enriched with Aloe Vera, Cucumber Extract, Vitamin E, Avocado Extract, and botanical oils, it helps moisturize, soften, and support a more radiant-looking complexion.\n\nHow to Use: Wash face with warm water. Apply small amount on face and neck, preferably at night. Do not massage. Allow skin to absorb it completely. As the cream contains exfoliating agents its desirable to use sunscreen or our Day Cream during the day, particularly if you are stepping out in the Sun, for best results.\n\nWhen to Use: Use once daily, preferably at night.\n\nTip to Improve Effect: For best results, use consistently and apply a broad-spectrum sunscreen during the day. Avoid layering with other strong exfoliating or brightening treatments at the same time.", 
    ingredients: 'Aqua, Ascorbic Acid (Vitamin C) 15%, Aloe Vera Extract, Xanthan Gum, Honey, Vitamin E, Glycerine, Allantoin, Lactic Acid, Propylene Glycol, Sodium Hyaluronate, Potassium Sorbate, Phenoxyethanol, Fragrance', 
    howToUse: 'Wash face with warm water. Apply small amount on face and neck, preferably at night. Do not massage. Allow skin to absorb it completely. As the cream contains exfoliating agents its desirable to use sunscreen or our Day Cream during the day, particularly if you are stepping out in the Sun, for best results. Use once daily, preferably at night. If used in the morning, follow with sunscreen. For best results, use consistently and apply a broad-spectrum sunscreen during the day. Avoid layering with other strong exfoliating or brightening treatments at the same time.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '50 Grams in Recyclable, Environment Friendly glass cream jar with HDPE Cap'
  },
  { 
    id: 15, 
    img: SC15, 
    name: 'Anti Acne Face wash: 100 ml, Salicylic Acid 2% for Oily & Acne Prone Skin', 
    category: 'Face Wash', 
    keywords: 'anti acne face wash salicylic acid oily acne prone cleanser panthenol turmeric neem vitamin e glycerine pimples scarring ph balance', 
    price: 'Rs. 225.00',
    model3D: '/models/AlowedaAntiAcneFac.glb', 
    description: "Description: This face wash has Salicylic Acid 2% with Panthenol (Vitamin B3), Turmeric and Neem extract with Vitamin E and Glycerine to help prevent bouts of pimples, treat pimples when active & help prevent scarring. It's good for all skin types particularly for those who have proneness for acne as it helps maintain skin pH, reduce oil, remove dead Cells and opens clogged pores. Its very gentle and will cause no irritation to the skin. However, you may want to do a skin test.\n\nIngredients: Salicylic acid 2%, Panthenol (B3), Turmeric Extract, Neem Extract, Citric Acid, Vitamin E and Glycerine in face wash base.\n\nTheir Role: Salicylic Acid 2% with Panthenol (Vitamin B3), Turmeric and Neem extract with Vitamin E and Glycerine help prevent bout of pimples, treat pimples quickly before scarring. It's good for all skin types particularly for those who have proneness for acne as it helps maintain skin pH, reduce oil, remove dead Cells and open clogged pores. Its very gentle and will cause no irritation to the skin.\n\nRecommended use: Squeeze small amount in your palm, lather with water and apply gently on your face. Allow it to act for 3-5 minutes. Rinse with water. Use twice or thrice a day.", 
    ingredients: 'Salicylic acid 2%, Turmeric Extract, Neem Extract, Citric Acid, Vitamin E and Glycerine in face wash base, Panthenol (Vitamin B3)', 
    howToUse: 'Squeeze small amount in your palm, lather with water and apply gently on your face. Allow it to act for 3-5 minutes. Rinse with water. Use twice or thrice a day.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: 'Flip top HDPE recyclable bottle of 100 ml'
  },
  
  // Hair Care Products
  { 
    id: 16, 
    img: HairCareImg, 
    name: 'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', 
    category: 'Hair Serum', 
    keywords: 'redensyl anagain rice water biotin hair therapy serum growth hair fall strength shine caffeine pea sprout scalp follicle stem cells thickness density', 
    price: 'Rs. 875.00',
    mrp: 'Rs. 975.00',
    model3D: '/models/HairTherapySerum.glb', 
    description: "Aloweda's Total Hair Therapy Serum – Growth, Strength and healthy shine\n\nHair is a very prominent part of our face. The problems we face with hair are: a. Too sparse b. Too thin c. Early greying d. Loss caused by illness or alopecia (Hair fall).\n\nThis serum contains Redensyl and Anagain to stimulate hair growth and improve thickness. Other important ingredients are Rice water, Caffeine and Biotin (In skin absorbable form). Please consult your doctor to ensure that you do not have vitamin & iron deficiency, thyroid dysfunction and any other illness that can be the cause of damage to hair.\n\nThis serum is designed to support healthier, fuller-looking hair from root to tip. Powered by advanced botanical actives like Larix Europaea wood extract and pea sprout extract, it helps stimulate the scalp and promote stronger, thicker hair over time. Caffeine and biotin work synergistically to energize hair follicles and reduce breakage, while zinc and amino acids support overall scalp health.\n\nInfused with green tea, turmeric, and grape seed extracts, this serum provides antioxidant protection against environmental stress, helping maintain a healthy scalp environment. Rice water, aloe vera, and humectants like glycerin, sodium hyaluronate, and sodium PCA deliver deep hydration, improving hair texture and manageability without weighing it down.\n\nWith a non-greasy, water-based formula, this serum absorbs quickly, leaving the scalp refreshed and the hair looking stronger, smoother, and more resilient with regular use.\n\nRevitalize your hair from root to tip with our Total Hair Therapy Serum, a scientifically formulated blend of Redensyl 5%, Anagain 5%, Rice Water, and Biotin. Designed to target hair thinning, breakage, and lack of volume, this powerhouse serum nourishes the scalp and strengthens strands for visibly healthier, thicker hair.\n\nKey Benefits:\n\n• Stimulates Hair Growth – Redensyl activates hair follicle stem cells to promote natural regrowth.\n\n• Reduces Hair Fall – Anagain, derived from pea sprouts, extends the hair's growth phase and reduces shedding.\n\n• Strengthens & Repairs – Rice water delivers amino acids and vitamins that fortify weak strands.\n\n• Boosts Shine & Thickness – Biotin improves hair texture, elasticity, and overall resilience.\n\n• Non-Greasy – Absorbs quickly into the scalp and hair without leaving residue.\n\nSuitable for: Men & women, all hair types, especially thinning or damaged hair.\n\nResult: Stronger roots, reduced hair fall, improved density, and naturally shiny, fuller hair.\n\nThis serum is formulated based on scientific information about benefits of local application of various ingredients. We do not make fake claims of GROWING NEW HAIR! This serum takes care of your hair by strengthening the ROOTS.\n\nKey Ingredients Explained:\n\n• Redensyl (5%): A biotech-derived, non-hormonal hair growth active often called a natural alternative to hair transplants. It combines plant-based molecules (like DHQG and EGCG2) with glycine and zinc. It activates stem cells in hair follicles, boosts growth phase, reduces hair fall, and improves hair density & strength. Clinical studies show it can reduce hair loss by up to 17% in 3 months.\n\n• Anagain (5%): Natural active derived from pea sprout extract. It targets hair follicles, acts on dermal papilla cells, restores hair growth cycle, prolongs growth phase & shortens resting/shedding phase. Reduces hair fall and improves thickness.\n\n• Rice Water: Rich in amino acids, vitamins (B, E), minerals, and antioxidants. Strengthens hair strands, repairs damage, promotes growth, adds shine & smoothness, and soothes scalp.\n\n• Caffeine: Reduces hair fall and thinning, stimulates natural hair growth, improves scalp circulation and follicle nourishment, strengthens and thickens hair over time.\n\n• Biotin (Vitamin B7/H): Known as the 'hair vitamin,' plays key role in keratin production. Strengthens weak, thinning hair, promotes healthier, thicker growth, reduces breakage and split ends, boosts natural shine and smoothness.", 
    ingredients: 'Aqua, Sodium Metabisulfite, Larix Europaea Wood Extract, Glycine, Zinc Chloride, Camellia Sinensis Leaf Extract, Pisum Sativum (Pea) Sprout Extract, Sodium Benzoate, Curcuma Longa (Turmeric) Root Extract, Rice water, Caffeine, Biotin, Pentylene Glycol, Phytic Acid, Aloe vera Extract, Glycerin, Propanediol, Phenoxyethanol, Sodium Hyaluronate, Propylene Glycol, Sodium PCA, Xanthan Gum, Carbomer, Grape seed Extract, Potassium Sorbate, Sodium Citrate', 
    howToUse: 'Apply 4-6 drops of Hair Growth Serum to your scalp, gently massaging it in to stimulate blood flow and absorption. Use 2-3 times a week, ideally before bed, and leave it on overnight for best results.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '50 ml serum in glass bottle with dropper'
  },
  
  // Lip Care Products
  { 
    id: 17, 
    img: LC1, 
    name: 'Lip Butter 8 Gram: Butters, Oils & Honey.ZERO CHEMICALS, NO PRESERVATIVES', 
    category: 'Lip Butter', 
    keywords: 'lip butter butters oils honey natural organic chemical free preservative free nourish plump shine castor jojoba shea cocoa kokum mango beeswax vitamin e', 
    price: 'Rs. 95.00',
    mrp: 'Rs. 105.00', 
    description: "Aloweda's Lip Butter: NOURISH. PLUMP. SHINE.\n\nTHIS IS NOT A LIP BALM. So no harmful Petrochemical derivatives like paraffin.\n\nPamper your lips with our rich and creamy Lip Butter, crafted with a luxurious blend of natural oils, nourishing butters, and Vitamin E. Designed to deeply hydrate, protect, and restore, it leaves your lips soft, supple, and irresistibly smooth. Its Non-Sticky & Lightweight, glides effortlessly, perfect for daily use.\n\nLips are exposed to hot food and beverages, spices, pollution, dry cold air, toothpaste, mouth washes & chemicals in lip sticks. This causes cracks, flaking of outer layer & ulceration that leads to unhealthy and lustreless lips that are susceptible to infection. Vitamin deficiency causes ulceration called Angular Stomatitis. Stress causes Aphthous ulcers. LIP BUTTER is a one stop solution for all these problems.\n\nPlease note that Lip balms in the Market contain cheap Petroleum based ingredients. They can cause Cancer. These ingredients are getting phased out, globally. We never use them in our any skin product.\n\nThe Role of ingredients:\n\n• Castor oil, Sunflower oil, Jojoba Oil, Soya bean oil: Together they are an excellent combination of light and heavy oils that sooth the lips and provide oily quote.\n\n• Shea butter, Cocoa butter: These butters provide moisturization and nourishment. They help heal chapped lips and leave them smooth and soft. They also have delectable sweet scent.\n\n• Kokum & Mango butter: They nourish the lips, prevent infections, heal cracks and ulcers.\n\n• Fig Honey from Western Ghats of India: Helps fight infections and promotes healing of cracks. Honey alone is in use for this purpose for centuries. The We honey we use is Fig Honey from Western Ghats of India.\n\n• Beeswax: creates a protective layer on the skin. It's also a humectant, which means that it attracts water. Both of these qualities can help the skin stay hydrated. Beeswax is also a natural exfoliator, ideal for sloughing away dead skin cells.\n\n• Aloe vera extract: helps fight inflammation and reduces irritation.\n\n• Vitamin E: Dissolves in oils and butters and is a wonder Vitamin for skin and lips. It provides a barrier to retain moisture that helps the plump look of lips. It has anti-ageing properties, protects lips from damage caused by sun light and helps in healing chapped lips.\n\n• Essential oils of Tangerine OR Watermelon OR Strawberry with Mint: Depends on which flavour you choose. Nice taste and fragrance for the product that stays on the lips whole night. It's rich in vitamins and has antioxydants too.", 
    ingredients: 'Aqua, Castor oil, Sunflower oil, Jojoba Oil, Soya bean oil, Shea & Kokum butter, Mango Butter, Honey, Beeswax, Aloe vera extract, BHA, Vitamin E Acetate, Cetyl Alcohol, Sorbic acid, Sodium Hyaluronate, Essential oils based of flavour: Strawberry essential oil/ Mint Essential oil /Watermelon essential oil/ Tangerine Essential oil / Vanilla essential oil', 
    howToUse: 'Wipe lips with wet tissue. Apply generously with fingers and gently massage for about 30 seconds. No harm if swallowed. You may want to apply twice a day. Tip: Best before going to bed. Leave overnight for best results.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '8 Grams in Recyclable, Environment Friendly HDPE pack'
  },
  { 
    id: 18, 
    img: LC2, 
    name: 'Lip Butter 15 Gram: Butters, Oils & Honey. NO CHEMICALS, NO PRESERVATIVES. NOT LIP BALM', 
    category: 'Lip Butter', 
    keywords: 'lip butter butters oils honey natural organic chemical free preservative free balm nourish plump shine castor jojoba shea cocoa kokum mango beeswax vitamin e', 
    price: 'Rs. 299.00', 
    description: "Aloweda's Lip Butter: NOURISH. PLUMP. SHINE.\n\nTHIS IS NOT A LIP BALM. So no harmful Petrochemical derivatives like paraffin.\n\nPamper your lips with our rich and creamy Lip Butter, crafted with a luxurious blend of natural oils, nourishing butters, and Vitamin E. Designed to deeply hydrate, protect, and restore, it leaves your lips soft, supple, and irresistibly smooth. Its Non-Sticky & Lightweight, glides effortlessly, perfect for daily use.\n\nLips are exposed to hot food and beverages, spices, pollution, dry cold air, toothpaste, mouth washes & chemicals in lip sticks. This causes cracks, flaking of outer layer & ulceration that leads to unhealthy and lustreless lips that are susceptible to infection. Vitamin deficiency causes ulceration called Angular Stomatitis. Stress causes Aphthous ulcers. LIP BUTTER is a one stop solution for all these problems.\n\nPlease note that Lip balms in the Market contain cheap Petroleum based ingredients. They can cause Cancer. These ingredients are getting phased out, globally. We never use them in our any skin product.\n\nThe Role of ingredients:\n\n• Castor oil, Sunflower oil, Jojoba Oil, Soya bean oil: Together they are an excellent combination of light and heavy oils that sooth the lips and provide oily quote.\n\n• Shea butter, Cocoa butter: These butters provide moisturization and nourishment. They help heal chapped lips and leave them smooth and soft. They also have delectable sweet scent.\n\n• Kokum & Mango butter: They nourish the lips, prevent infections, heal cracks and ulcers.\n\n• Fig Honey from Western Ghats of India: Helps fight infections and promotes healing of cracks. Honey alone is in use for this purpose for centuries. The We honey we use is Fig Honey from Western Ghats of India.\n\n• Beeswax: creates a protective layer on the skin. It's also a humectant, which means that it attracts water. Both of these qualities can help the skin stay hydrated. Beeswax is also a natural exfoliator, ideal for sloughing away dead skin cells.\n\n• Aloe vera extract: helps fight inflammation and reduces irritation.\n\n• Vitamin E: Dissolves in oils and butters and is a wonder Vitamin for skin and lips. It provides a barrier to retain moisture that helps the plump look of lips. It has anti-ageing properties, protects lips from damage caused by sun light and helps in healing chapped lips.\n\n• Essential oils of Tangerine OR Watermelon OR Strawberry with Mint: Depends on which flavour you choose. Nice taste and fragrance for the product that stays on the lips whole night. It's rich in vitamins and has antioxydants too.", 
    ingredients: 'Aqua, Castor oil, Sunflower oil, Jojoba Oil, Soya bean oil, Shea & Kokum butter, Mango Butter, Honey, Beeswax, Aloe vera extract, BHA, Vitamin E Acetate, Cetyl Alcohol, Sorbic acid, Sodium Hyaluronate, Essential oils based of flavour: Strawberry essential oil/ Mint Essential oil /Watermelon essential oil/ Tangerine Essential oil / Vanilla essential oil', 
    howToUse: 'Wipe lips with wet tissue. Apply generously with fingers and gently massage for about 30 seconds. No harm if swallowed. You may want to apply twice a day. Tip: Best before going to bed. Leave overnight for best results.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5–7 business days, while remote or interior locations may require 7–10 business days.',
    packaging: '15 gram in a recyclable, eco-friendly HDPE container'
  },
  
  // Tattoo Care Products
  { 
    id: 19, 
    img: TattooCleanser, 
    images: [TattooCleanser],
    name: 'Tattoo Cleanser 100 ml', 
    category: 'Tattoo', 
    keywords: 'tattoo cleanser citrus fruit wash gentle sulphate free aloe vera vitamin e orange lemon tangerine tattoo care healed fresh', 
    price: 'Rs. 299.00',
    mrp: 'Rs. 349.00',
    tag: 'New',
    description: 'A gentle, sulphate-free tattoo cleanser specially formulated to cleanse tattooed skin without stripping away essential moisture. Infused with Aloe Vera, Vitamin E, and natural citrus extracts of Orange, Lemon, and Tangerine, it helps remove impurities while keeping skin feeling refreshed, hydrated, and comfortable. Mild plant-derived cleansing agents effectively cleanse the skin while supporting the natural skin barrier, making it ideal for both fresh and healed tattoos. The fragrance-free formula is designed to minimize irritation and leave tattooed skin clean, soft, and well cared for.',
    freeFrom: 'Sulphates, Parabens, Phthalates, Soap Gel, Alcohol & Fragrance',
    ingredients: 'Ingredients: Aqua, Orange Extract, Lemon Extract, Tangerine Extract, Aloe Vera Extract, Lauryl Glucoside, Coco Glucoside, CocomideDiethanolamine (CDEA), Sodium Cocoyl Glutamate, Carbopool, Ultrez 20,Polyquaternium-7, Tocopherol, Acetate (Vitamin E Acetate), Glycerine,Phenoxyethanol, Disodium EDTA, No added Fragrance.',
    howToUse: 'How to Use:\n\nThis formulation is very concentrated & thick. Apply a very small amount to wet tattooed skin & gently massage in circular motions to create a soft lather. Rinse thoroughly with water & pat dry. Follow with tattoo butter or moisturizer to help keep skin hydrated & comfortable. Suitable for daily use on healed tattoos & surrounding skin. Use once or twice a day. Always use after sweating, exposure to sunlight & contact with grime.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5-7 business days, while remote or interior locations may require 7-10 business days.'
  },
  { 
    id: 20, 
    img: TattooButter, 
    images: [TattooButter],
    name: 'Tattoo Butter 50 Grams, NO CHEMICALS, NATURAL BUTTERS & OILS', 
    category: 'Tattoo', 
    keywords: 'tattoo butter natural butters oils shea cocoa mango kokum protection vibrant tattoo care chemical free nourish protect hydrate flaunt gotu kola lemongrass rosehip', 
    price: 'Rs. 799.00',
    mrp: 'Rs. 899.00',
    tag: 'Best Seller',
    outOfStock: true,
    description: 'YOU MUST FLAUNT YOUR UNIQUE INKS !\n\nA deeply restorative Tattoo Butter crafted to nourish, protect, and enhance the vibrancy of tattooed skin. This rich blend of shea, cocoa, mango, kokum, and clarified butter delivers intense hydration and supports faster skin recovery, while beeswax forms a protective barrier to lock in moisture. Enriched with fig honey, almond oil, and rosehip oil, it helps soften the skin, improve elasticity, and maintain a healthy glow.\n\nBotanical actives like gotu kola and lemongrass extracts promote skin repair and resilience, while niacinamide and panthenol strengthen the skin barrier and improve overall texture. A natural infusion of rosemary, cardamom, and sandalwood essential oils provides a soothing, earthy aroma while supporting skin comfort.\n\nIdeal for both fresh and healed tattoos, this balm keeps skin supple, calm, and well-conditioned, helping preserve the clarity and richness of your ink.\n\nNO CHEMICALS. NO ADDITIVES. NO PRESERVATIVES. NO PETROLIUM DERIVATIVES. NO ARTIFICIAL FRAGRANCE.',
    ingredients: 'Shea Butter, Cocoa Butter, Mango Butter, Kokum Butter, Clarified Butter, Fig Honey, Rosemery Essential oil, Rose Hip Oil, Almond Oil, Gotu Kola Extract, Beeswax, Niacinamide, Panthenol, Lemongrass Extract, Cardamom Essential Oil & Sandalwood Essential oil.\n\nNO CHEMICALS. NO ADDITIVES. NO PRESERVATIVES. NO PETROLIUM DERIVATIVES. NO FRAGRANCE.',
    howToUse: 'Spread a thin layer of this butter on your tattoo. DO NOT MASSAGE. Allow it to be absorbed by the skin. You can apply twice a day. Ideally give your tattoo a thick layer before going to bed.',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5-7 business days, while remote or interior locations may require 7-10 business days.'
  },
  {
    id: 21,
    img: WinterCombo,
    images: [WinterCombo],
    name: 'Winter Combo : The Day Cream 50 Gram + The Night Cream 50 Gram + Lip Butter 15 Gram',
    category: 'Combo',
    keywords: 'winter combo day cream night cream lip butter routine combo kit spf hyaluronic acid retinol niacinamide vitamin e hydration winter care',
    price: 'Rs. 699.00',
    description: "YOUR WINTER CARE ROUTINE\n\n1. THE DAY CREAM:\nApply a generous layer 15 minutes before stepping out in the Sun. Reapply if you are exposed to the Sun for more than 4 hours.\n\nA lightweight yet deeply hydrating SPF 30 Day Cream formulated with Hyaluronic Acid to hydrate, nourish, and protect your skin throughout the day. Its blend of broad-spectrum UV filters and skin-loving actives helps protect against daily UVA and UVB exposure while helping prevent dryness, tanning, and premature signs of ageing. The combination of chemical and mineral sunscreens provides everyday sun protection, while Hyaluronic Acid helps keep winter-dry skin feeling soft, smooth, and hydrated.\n\n2. THE NIGHT CREAM:\nWake up to smoother, softer, and deeply nourished skin with The Night Cream. A rich overnight treatment cream formulated with Retinol, Niacinamide, Hyaluronic Acid, and Vitamin E to help visibly improve skin texture, support overnight renewal, and promote a smoother, more radiant-looking complexion.\n\nNourishing Argan Oil and Carrot Oil help condition and soften dry skin, while Aloe Vera Extract, Glycerin, Butylene Glycol, and Xylitol provide lasting hydration and help maintain moisture balance throughout the night. Enhanced with a Multi Vitamin Complex and skin-conditioning emollients, this luxurious cream helps support a healthy-looking skin barrier and replenish moisture while you sleep. Infused with an elegant Saffron Fragrance for a calming nighttime skincare ritual.\n\n3. LIP BUTTER:\nApply and massage gently three times a day, or whenever needed.\n\nPamper your lips with our rich and creamy Lip Butter, crafted with a luxurious blend of natural oils, nourishing butters, and Vitamin E. Designed to deeply hydrate, protect, and restore, it helps keep winter-dry lips soft, supple, and smooth. Its non-sticky and lightweight texture glides effortlessly onto the lips, making it perfect for everyday winter care.",
    ingredients: 'Please see description of Individual Products',
    howToUse: 'Please see description of Individual Products',
    shipping: 'We process all domestic orders within 1 business day. Delivery typically takes 5-7 business days, while remote or interior locations may require 7-10 business days.'
  }
]

export default function App() {
  return (
    <BrowserRouter>
      <AnnouncementBar />
      <AppContent />
    </BrowserRouter>
  )
}

// Main App Content with Routes
function AppContent() {
  const [showLogin, setShowLogin] = useState(false)
  
  // Initialize cart from localStorage or empty array
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('alowedaCart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      return []
    }
  })
  
  const [user, setUser] = useState(null) // User state
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('alowedaCart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cart])

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData)
    showNotification(`Welcome back, ${userData.name}!`)
  }

  // Add to cart function
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        // Update quantity if product already in cart
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity }]
      }
    })
    // Show success notification
    showNotification(`${product.name} added to cart!`)
  }

  // Simple notification system
  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  // Get cart count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Custom navigate function for backward compatibility
  const handleNavigate = (path, params) => {
    if (path === 'home') {
      navigate('/')
    } else if (path === 'product' && params?.productId) {
      navigate(`/product/${params.productId}`)
    } else if (path === 'shop') {
      navigate('/shop')
    } else if (path === 'skincare') {
      navigate('/skincare')
    } else if (path === 'haircare' || path === 'hair') {
      navigate('/haircare')
    } else if (path === 'lipcare' || path === 'lip') {
      navigate('/lipcare')
    } else if (path === 'bestsellers') {
      navigate('/bestsellers')
    } else if (path === 'cart') {
      navigate('/cart')
    } else if (path === 'serums') {
      navigate('/serums')
    } else if (path === 'creams') {
      navigate('/creams')
    } else if (path === 'moisturisers') {
      navigate('/moisturisers')
    } else if (path === 'tattoo') {
      navigate('/tattoo')
    } else if (path === 'tattoo-quiz') {
      navigate('/tattoo-quiz')
    } else if (path === 'rituals') {
      navigate('/rituals')
    } else {
      navigate(`/${path}`)
    }
  }

  return (
    <>
      <PageTransition />
      <Routes>
        {/* Home Route */}
        <Route 
          path="/" 
          element={
            <HomePage 
              onNavigate={handleNavigate} 
              onLoginClick={() => setShowLogin(true)} 
              cartCount={cartCount} 
              onAddToCart={addToCart} 
              allProducts={ALL_PRODUCTS}
              cart={cart}
            />
          } 
        />

        {/* Product Detail Route */}
        <Route 
          path="/product/:productId" 
          element={<ProductDetailWrapper onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} onAddToCart={addToCart} cartCount={cartCount} />} 
        />

        {/* Shop Routes */}
        <Route 
          path="/shop" 
          element={<AllProductsPage onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} />} 
        />

        {/* Skin Care Routes */}
        <Route 
          path="/skincare" 
          element={<SkinCarePage onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} />} 
        />
        <Route 
          path="/serums" 
          element={<SkinCarePage onNavigate={handleNavigate} categoryFilter="serums" pageTitle="Serums" onLoginClick={() => setShowLogin(true)} />} 
        />
        <Route 
          path="/creams" 
          element={<SkinCarePage onNavigate={handleNavigate} categoryFilter="creams" pageTitle="Creams" onLoginClick={() => setShowLogin(true)} />} 
        />
        <Route 
          path="/moisturisers" 
          element={<SkinCarePage onNavigate={handleNavigate} categoryFilter="moisturisers" pageTitle="Moisturisers" onLoginClick={() => setShowLogin(true)} />} 
        />
        <Route 
          path="/tattoo" 
          element={<SkinCarePage onNavigate={handleNavigate} categoryFilter="tattoo" pageTitle="Tattoo Care" onLoginClick={() => setShowLogin(true)} />} 
        />
        <Route 
          path="/rituals" 
          element={<SkinCarePage onNavigate={handleNavigate} categoryFilter="rituals" pageTitle="Skin Rituals" onLoginClick={() => setShowLogin(true)} />} 
        />

        {/* Hair Care Route */}
        <Route 
          path="/haircare" 
          element={<HairCarePage onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} />} 
        />

        {/* Lip Care Route */}
        <Route 
          path="/lipcare" 
          element={<LipCarePage onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} />} 
        />

        {/* Best Sellers Route */}
        <Route 
          path="/bestsellers" 
          element={<BestSellerPage onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} cartCount={cartCount} />} 
        />

        {/* Build My Regimen Route */}
        <Route 
          path="/build-my-regimen" 
          element={<BuildMyRegimen onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} cartCount={cartCount} onAddToCart={addToCart} />} 
        />

        {/* Tattoo Care Quiz Route */}
        <Route
          path="/tattoo-quiz"
          element={<TattooQuiz onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} cartCount={cartCount} onAddToCart={addToCart} />}
        />

        {/* About Route */}
        <Route 
          path="/about" 
          element={<About onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} cartCount={cartCount} />} 
        />

        {/* Consultation Route */}
        <Route 
          path="/consultation" 
          element={<Consultation onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} cartCount={cartCount} />} 
        />

        {/* Terms & Conditions Route */}
        <Route 
          path="/terms" 
          element={<TermsAndConditions onNavigate={handleNavigate} onLoginClick={() => setShowLogin(true)} cartCount={cartCount} />} 
        />

        {/* Cart Route */}
        <Route 
          path="/cart" 
          element={
            <Cart 
              cart={cart} 
              onNavigate={handleNavigate} 
              onUpdateQuantity={updateQuantity} 
              onRemoveItem={removeFromCart}
              onLoginClick={() => setShowLogin(true)}
              cartCount={cartCount}
              user={user}
            />
          } 
        />

        {/* Admin Panel Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/setup" element={<QuickAdminSetup />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<SalesAnalytics />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="visual-editor" element={<VisualEditor />} />
        </Route>

        {/* Catch-all redirect to 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <WhatsAppButton />
      <ScrollToTop />
      {showLogin && <Login onNavigate={handleNavigate} onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#2d5f3f',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10000,
          maxWidth: '400px',
          animation: 'slideInUp 0.3s ease',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          ✓ {notification}
        </div>
      )}
    </>
  )
}

// Wrapper component for Product Detail to handle URL params
function ProductDetailWrapper({ onNavigate, onLoginClick, onAddToCart, cartCount }) {
  const { productId } = useParams()
  const product = ALL_PRODUCTS.find(p => p.id === parseInt(productId))
  
  if (!product) {
    return <Navigate to="/" replace />
  }

  // Get related products from same category
  const relatedProducts = ALL_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
  
  return (
    <ProductDetail 
      product={product} 
      onNavigate={onNavigate} 
      onBack={() => window.history.back()}
      relatedProducts={relatedProducts}
      onLoginClick={onLoginClick}
      onAddToCart={onAddToCart}
      cartCount={cartCount}
    />
  )
}
