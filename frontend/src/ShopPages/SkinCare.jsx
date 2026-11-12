import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import './ShopPage.css'
import './SkinCare.css'
import { handleNavigation } from '../utils/navigation'

import SC1  from '../SkinCareImg/SkinCare1.png'
import SC2  from '../SkinCareImg/SkinCare2.png'
import SC3  from '../SkinCareImg/SkinCare3.jpg'
import SC4  from '../SkinCareImg/SkinCare4.jpg'
import SC5  from '../SkinCareImg/SkinCare5.jpg'
import SC6  from '../SkinCareImg/SkinCare6.jpg'
import SC7  from '../SkinCareImg/SkinCare7.jpg'
import SC8  from '../SkinCareImg/SkinCare8.jpg'
import SC9  from '../SkinCareImg/SkinCare9.jpg'
import SC10 from '../SkinCareImg/SkinCare10.jpg'
import SC11 from '../assets/lineandwrinkleserum.png'
import SC12 from '../SkinCareImg/SkinCare12.jpg'
import SC13 from '../SkinCareImg/SkinCare13.jpg'
import SC14 from '../SkinCareImg/SkinCare14.jpg'
import SC15 from '../SkinCareImg/SkinCare15.jpg'
import HairCareImg from '../assets/HairCare.png'
import TattooCleanser from '../assets/TattooCleanser.png'
import TattooButter from '../assets/TattooButter.png'
import WinterCombo from '../assets/Winter Combo.png'

const products = [
  { id:1,  img:SC1,  name:'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', category: 'Combo', keywords: 'day cream night cream lip butter routine combo kit', price:'Rs. 899.00', mrp:'Rs. 1,199.00' },
  { id:2,  img:SC2,  name:'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream + Complexion Cream + Smooth Perfection Serum', category: 'Combo', keywords: 'pigment control serum day cream complexion smooth perfection ritual combo kit', price:'Rs. 1,299.00', mrp:'Rs. 1,599.00' },
  { id:3,  img:SC3,  name:'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', category: 'Combo', keywords: 'super glow serum day cream radiance ritual combo kit glow', price:'Rs. 1,149.00', mrp:'Rs. 1,299.00' },
  { id:4,  img:SC4,  name:'Hyaluronic Acid, SPF 30 & Vitamin E : The Day Cream 50 G', category: 'Cream', keywords: 'hyaluronic acid spf vitamin e day cream moisturizer sunscreen protection', price:'Rs. 499.00', mrp:'Rs. 549.00' },
  { id:5,  img:SC5,  name:'Retinol 1%, Niacinamide 10 %, Aloe Vera Extract & Carrot oil: The Night Cream 50 G', category: 'Cream', keywords: 'retinol niacinamide aloe vera carrot oil night cream anti aging', price:'Rs. 549.00', mrp:'Rs. 599.00', model3D: '/models/TheNightCream.glb' },
  { id:6,  img:SC6,  name:'Saffron Face Oil 30 ml: Saffron Essential Oil, Sweet Almond oil, Grape Seed Oil, Honey & Ghee', category: 'Oil', keywords: 'saffron face oil almond grape seed honey ghee radiant glow', price:'Rs. 799.00' },
  { id:7,  img:SC7,  name:'Alpha Arbutin 2%, Vitamin C 15 % & Micro Crystalline Wax: Complexion Cream 50 G', category: 'Cream', keywords: 'alpha arbutin vitamin c complexion brightening pigmentation dark spots', price:'Rs. 499.00', mrp:'Rs. 549.00' },
  { id:8,  img:SC8,  name:'Vitamin C 15%, Niacinamide 5%, Hyaluronic Acid & Ferulic Acid 1% Serum 30 ml for Super Glow', category: 'Serum', keywords: 'vitamin c ferulic acid niacinamide super glow serum brightening radiance', price:'Rs. 649.00', mrp:'Rs. 699.00' },
  { id:9,  img:SC9,  name:'Alpha Arbutin 2%, Aloe Vera Extract, Ceramides & Kojic Acid 1%: Pigment Control Serum 30 ml', category: 'Serum', keywords: 'alpha arbutin aloe vera ceramides kojic acid pigment control dark spots', price:'Rs. 599.00', mrp:'Rs. 649.00' },
  { id:10, img:SC10, name:'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin & Niacinamide: Wrinkles & Lines Cream 50 G', category: 'Cream', keywords: 'retinol copper tripeptide alpha arbutin niacinamide wrinkles lines anti aging', price:'Rs. 549.00', mrp:'Rs. 599.00' },
  { id:11, img:SC11, name:'Encapsulated Retinol 1 %, Grape Seed Extract, & Ceramides : Lines & Wrinkles Serum 30 ml', category: 'Serum', keywords: 'retinol grape seed ceramides lines wrinkles anti aging serum', price:'Rs. 549.00', mrp:'Rs. 599.00' },
  { id:12, img:SC12, name:'Niacinamide 10 %, Acetyl Glucosamine & Ceramides 30 ml Serum for Tone & Texture', category: 'Serum', keywords: 'niacinamide acetyl glucosamine ceramides tone texture smooth skin', price:'Rs. 599.00', mrp:'Rs. 649.00' },
  { id:13, img:SC13, name:'Salicylic Acid 2%, Witch Hazel Extract & Squalene: Smooth Perfection Serum 30 ml', category: 'Serum', keywords: 'salicylic acid witch hazel squalene smooth perfection acne pores', price:'Rs. 549.00', mrp:'Rs. 599.00' },
  { id:14, img:SC14, name:'Vitamin C 20%, Kojic Acid, Avocado Extract & Argan Oil : Radiance Cream 50 G', category: 'Cream', keywords: 'vitamin c kojic acid avocado argan oil radiance brightening glow', price:'Rs. 499.00', mrp:'Rs. 549.00' },
  { id:15, img:SC15, name:'Anti Acne Face wash: 100 ml, Salicylic Acid 2% for Oily & Acne Prone Skin', category: 'Face Wash', keywords: 'anti acne face wash salicylic acid oily acne prone cleanser', price:'Rs. 225.00' },
  { id:16, img:HairCareImg, name:'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', category: 'Hair', keywords: 'redensyl anagain rice water biotin hair therapy serum growth hair fall', price:'Rs. 875.00', mrp:'Rs. 975.00' },
  { id:19, img:TattooCleanser, name:'Tattoo Cleanser 100 ml', category: 'Tattoo', keywords: 'tattoo cleanser citrus fruit wash gentle sulphate free aloe vera vitamin e', price:'Rs. 299.00', mrp:'Rs. 349.00' },
  { id:20, img:TattooButter, name:'Tattoo Butter 50 Grams', category: 'Tattoo', keywords: 'tattoo butter natural butters oils shea cocoa mango kokum protection', price:'Rs. 799.00', mrp:'Rs. 899.00' },
  { id:21, img:WinterCombo, name:'Winter Combo : The Day Cream 50 Gram + The Night Cream 50 Gram + Lip Butter 15 Gram', category: 'Combo', keywords: 'winter combo day cream night cream lip butter routine spf hyaluronic acid retinol niacinamide hydration winter care', price:'Rs. 699.00' },
]

export default function SkinCarePage({ onNavigate, searchQuery, categoryFilter, pageTitle, showAllProducts, onLoginClick }) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '')
  const [hoveredProduct, setHoveredProduct] = useState(null)

  // Search and category filter logic
  const filteredProducts = useMemo(() => {
    let result = products

    // First apply category filter if specified
    if (categoryFilter && !showAllProducts) {
      result = result.filter(product => {
        const productCategory = product.category.toLowerCase()
        const filter = categoryFilter.toLowerCase()
        
        // Direct match first
        if (productCategory === filter) return true
        
        // Map categories to match filter (handle singular/plural variations)
        if (filter === 'serums') return productCategory === 'serums' || productCategory === 'serum'
        if (filter === 'creams') return productCategory === 'creams' || productCategory === 'cream'
        if (filter === 'moisturisers') return productCategory === 'moisturisers' || productCategory === 'moisturiser' || productCategory === 'moisturizer'
        if (filter === 'tattoo') return productCategory.includes('tattoo')
        if (filter === 'rituals') return productCategory === 'rituals' || productCategory === 'combo' || productCategory.includes('ritual')
        if (filter === 'facewash') return productCategory === 'face wash' || productCategory === 'facewash'
        
        return false
      })
    }

    // Then apply search filter if query exists
    const query = (localSearchQuery || searchQuery || '').toLowerCase().trim()
    if (query) {
      result = result.filter(product => {
        const searchableText = `${product.name} ${product.category} ${product.keywords}`.toLowerCase()
        return searchableText.includes(query)
      })
    }

    return result
  }, [localSearchQuery, searchQuery, categoryFilter, showAllProducts])

  const handleClearSearch = () => {
    setLocalSearchQuery('')
  }

  // Determine page title
  const displayTitle = pageTitle || 'Smart Skincare'

  return (
    <div className="shop-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} />

      {/* Big page heading — reference style */}
      <div className="shop-page__hero">
        <h1 className="shop-page__hero-title">{displayTitle}</h1>
      </div>

      {/* Search Results Banner */}
      {(searchQuery || localSearchQuery) && (
        <div className="search-results-banner">
          <div className="search-results-content">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span className="search-results-text">
              Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{localSearchQuery || searchQuery}"
            </span>
            <button className="search-clear-btn" onClick={handleClearSearch} aria-label="Clear search">✕</button>
          </div>
        </div>
      )}

      <div className="shop-page__topbar">
        <span className="shop-page__meta">
          <strong>{filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}</strong>
        </span>
        
        {/* Local Search Bar */}
        <div className="shop-page__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={localSearchQuery}
            onChange={e => setLocalSearchQuery(e.target.value)}
            className="shop-page__search-input"
          />
          {localSearchQuery && (
            <button className="shop-page__search-clear" onClick={handleClearSearch}>✕</button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="shop-page__grid">
          {filteredProducts.map(p => (
            <div 
              key={p.id} 
              className="sp-card" 
              onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: p.id })}
              onAuxClick={(e) => e.button === 1 && handleNavigation(e, onNavigate, 'product', { productId: p.id })}
              onMouseEnter={() => setHoveredProduct(p.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="sp-card__img-wrap">
                <img src={p.img} alt={p.name} className="sp-card__img" />
              </div>
              <div className="sp-card__body">
                <p className="sp-card__category">{p.category}</p>
                <p className="sp-card__name">{p.name}</p>
                <div className="sp-card__footer">
                  <span className="sp-card__price">{p.price}</span>
                  {p.mrp && <span className="sp-card__mrp">{p.mrp}</span>}
                  <button className="sp-add-btn" onClick={(e) => { e.stopPropagation(); alert('Added to cart!') }}>Add to Bag</button>
                </div>
              </div>

              {/* Hover Popup */}
              {hoveredProduct === p.id && (
                <div className="product-popup">
                  <div className="product-popup__content">
                    <div className="product-popup__header">
                      <h3>{p.name}</h3>
                      <span className="product-popup__category">{p.category}</span>
                    </div>
                    <div className="product-popup__details">
                      <div className="product-popup__price-section">
                        <span className="popup-price">{p.price}</span>
                        {p.mrp && <span className="popup-mrp">{p.mrp}</span>}
                      </div>
                      <div className="product-popup__info">
                        <p>✓ Premium Quality Product</p>
                        <p>✓ Cruelty-Free & Vegan</p>
                        <p>✓ GMP Certified</p>
                        <p>✓ Free Shipping on Orders Above ₹999</p>
                      </div>
                    </div>
                    <button 
                      className="product-popup__btn" 
                      onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: p.id })}
                      onAuxClick={(e) => e.button === 1 && handleNavigation(e, onNavigate, 'product', { productId: p.id })}
                    >View Details</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <h3>No products found</h3>
          <p>Try searching with different keywords like "serum", "cream", "vitamin c", or "anti aging"</p>
          <button className="shop-page__quiz-btn" onClick={handleClearSearch}>Clear Search</button>
        </div>
      )}

      {/* Tattoo Care Quiz Banner — only on tattoo page */}
      {categoryFilter === 'tattoo' && (
        <div className="tattoo-quiz-banner">
          <div className="tattoo-quiz-banner__inner">
            <div className="tattoo-quiz-banner__text">
              <span className="tattoo-quiz-banner__eyebrow">Free Tool</span>
              <h2 className="tattoo-quiz-banner__title">Not sure what your tattoo needs?</h2>
              <p className="tattoo-quiz-banner__sub">Answer 5 quick questions — fading ink, dryness, itching — and get a personalised care routine in seconds.</p>
            </div>
            <Link to="/tattoo-quiz" className="tattoo-quiz-banner__btn">
              Take the Tattoo Care Quiz →
            </Link>
          </div>
        </div>
      )}

      <div className="shop-page__info">
        <h2 className="shop-page__info-title">Smart Skincare</h2>
        <p className="shop-page__info-desc">
          We believe skincare should be simple, effective, and powered by nature. Our 
          smart skincare range combines proven ingredients with modern research 
          to target your skin's unique needs. Whether it's addressing dullness, acne care, or
          anti-aging, our formulations are designed to help you achieve long-lasting
          glow and confidence, naturally.
        </p>
        <button className="shop-page__quiz-btn">Start Quiz</button>
      </div>
      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}
