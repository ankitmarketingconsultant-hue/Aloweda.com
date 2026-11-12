import { useState, useMemo, useEffect } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import { handleNavigation } from '../utils/navigation'
import './ShopPage.css'
import './SkinCare.css'
import './AllProducts.css'

// Import all product images
import SC6  from '../SkinCareImg/SkinCare6.jpg'
import SC15 from '../SkinCareImg/SkinCare15.jpg'
import FaceWashImg from '../assets/FaceWash.png'
import HairCareImg from '../assets/HairCare.png'
import TattooCleanser from '../assets/TattooCleanser.png'
import TattooButter from '../assets/TattooButter.png'
import WinterCombo from '../assets/Winter Combo.png'
import LC1 from '../LipCareImg/LipCare1.jpg'
import LC2 from '../LipCareImg/LipCare2.jpg'

// Product Detail Images (high quality)
import RitualOfRadianceDetail from '../ProductDetailsImages/RITUALOFRADIANCESuperGlowSerum30ml+TheDayCream+RadianceCream50gram.png'
import DayCream4Detail from '../ProductDetailsImages/DayCream4.png'
import PerfectComplexionDetail from '../ProductDetailsImages/PERFECTCOMPLEXIONRITUALPigmentControlSerum+TheDayCream+ComplexionCream+SmoothPerfectionSerum.png'
import YourSimpleRoutineDetail from '../ProductDetailsImages/YOURSIMPLE ROUTINETheDayCream+TheNightCream+LipButter.png'
import TheNightCreamDetail from '../ProductDetailsImages/TheNightCream.png'
import SaffronEssentialOilDetail from '../ProductDetailsImages/SaffronEssentialOil.png'
import ComplexionCreamDetail from '../ProductDetailsImages/ComplexionCream.png'
import SuperGlowSerumDetail from '../ProductDetailsImages/SuperGlowSerum.png'
import PigmentControlSerumDetail from '../ProductDetailsImages/PigmentControlSerum.png'
import LinesWrinklesSerumDetail from '../assets/lineandwrinkleserum.png'
import ToneTextureSerumDetail from '../ProductDetailsImages/Tone&TextureSerum30ml.png'
import RadianceCreamDetail from '../ProductDetailsImages/RadianceCream.png'
import SmoothPerfectionSerumDetail from '../ProductDetailsImages/alowedasmoothperfectionserum.png'
import WrinklesLinesCreamDetail from '../ProductDetailsImages/Lines&WrinklesSerum.png'

// All products - using high quality detail images
const allProducts = [
  { id:1,  img:YourSimpleRoutineDetail,    name:'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', category: 'Combo', keywords: 'day cream night cream lip butter routine combo kit', price:'Rs. 899.00', mrp:'Rs. 1,199.00' },
  { id:2,  img:PerfectComplexionDetail,    name:'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream + Complexion Cream + Smooth Perfection Serum', category: 'Combo', keywords: 'pigment control serum day cream complexion smooth perfection ritual combo kit', price:'Rs. 1,299.00', mrp:'Rs. 1,599.00' },
  { id:3,  img:RitualOfRadianceDetail,     name:'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', category: 'Combo', keywords: 'super glow serum day cream radiance ritual combo kit glow', price:'Rs. 1,149.00', mrp:'Rs. 1,299.00' },
  { id:4,  img:DayCream4Detail,            name:'Hyaluronic Acid, SPF 30 & Vitamin E : The Day Cream 50 G', category: 'Cream', keywords: 'hyaluronic acid spf vitamin e day cream moisturizer sunscreen protection', price:'Rs. 499.00', mrp:'Rs. 549.00' },
  { id:5,  img:TheNightCreamDetail,        name:'Retinol 1%, Niacinamide 10 %, Aloe Vera Extract & Carrot oil: The Night Cream 50 G', category: 'Cream', keywords: 'retinol niacinamide aloe vera carrot oil night cream anti aging', price:'Rs. 549.00', mrp:'Rs. 599.00', model3D: '/models/TheNightCream.glb' },
  { id:7,  img:ComplexionCreamDetail,      name:'Alpha Arbutin 2%, Vitamin C 15 % & Micro Crystalline Wax: Complexion Cream 50 G', category: 'Cream', keywords: 'alpha arbutin vitamin c complexion brightening pigmentation dark spots', price:'Rs. 499.00', mrp:'Rs. 549.00' },
  { id:8,  img:SuperGlowSerumDetail,       name:'Vitamin C 15%, Niacinamide 5%, Hyaluronic Acid & Ferulic Acid 1% Serum 30 ml for Super Glow', category: 'Serum', keywords: 'vitamin c ferulic acid niacinamide super glow serum brightening radiance', price:'Rs. 649.00', mrp:'Rs. 699.00' },
  { id:9,  img:PigmentControlSerumDetail,  name:'Alpha Arbutin 2%, Aloe Vera Extract, Ceramides & Kojic Acid 1%: Pigment Control Serum 30 ml', category: 'Serum', keywords: 'alpha arbutin aloe vera ceramides kojic acid pigment control dark spots', price:'Rs. 599.00', mrp:'Rs. 649.00' },
  { id:10, img:WrinklesLinesCreamDetail,   name:'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin & Niacinamide: Wrinkles & Lines Cream 50 G', category: 'Cream', keywords: 'retinol copper tripeptide alpha arbutin niacinamide wrinkles lines anti aging', price:'Rs. 549.00', mrp:'Rs. 599.00' },
  { id:11, img:LinesWrinklesSerumDetail,   name:'Encapsulated Retinol 1 %, Grape Seed Extract, & Ceramides : Lines & Wrinkles Serum 30 ml', category: 'Serum', keywords: 'retinol grape seed ceramides lines wrinkles anti aging serum', price:'Rs. 549.00', mrp:'Rs. 599.00' },
  { id:12, img:ToneTextureSerumDetail,     name:'Niacinamide 10 %, Acetyl Glucosamine & Ceramides 30 ml Serum for Tone & Texture', category: 'Serum', keywords: 'niacinamide acetyl glucosamine ceramides tone texture smooth skin', price:'Rs. 599.00', mrp:'Rs. 649.00' },
  { id:13, img:SmoothPerfectionSerumDetail,name:'Salicylic Acid 2%, Witch Hazel Extract & Squalene: Smooth Perfection Serum 30 ml', category: 'Serum', keywords: 'salicylic acid witch hazel squalene smooth perfection acne pores', price:'Rs. 549.00', mrp:'Rs. 599.00' },
  { id:14, img:RadianceCreamDetail,        name:'Vitamin C 20%, Kojic Acid, Avocado Extract & Argan Oil : Radiance Cream 50 G', category: 'Cream', keywords: 'vitamin c kojic acid avocado argan oil radiance brightening glow', price:'Rs. 499.00', mrp:'Rs. 549.00' },
  { id:15, img:FaceWashImg,               name:'Anti Acne Face wash: 100 ml, Salicylic Acid 2% for Oily & Acne Prone Skin', category: 'Face Wash', keywords: 'anti acne face wash salicylic acid oily acne prone cleanser', price:'Rs. 225.00' },
  { id:16, img:HairCareImg,               name:'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', category: 'Hair', keywords: 'redensyl anagain rice water biotin hair therapy serum growth hair fall', price:'Rs. 875.00', mrp:'Rs. 975.00' },
  { id:17, img:LC1,                       name:'Lip Butter 8 Gram: Butters, Oils & Honey. ZERO CHEMICALS, NO PRESERVATIVES', category: 'Lip Butter', keywords: 'lip butter butters oils honey organic chemical free preservative free', price:'Rs. 95.00', mrp:'Rs. 105.00' },
  { id:18, img:LC2,                       name:'Lip Butter 15 Gram: Butters, Oils & Honey. NO CHEMICALS, NO PRESERVATIVES. NOT LIP BALM', category: 'Lip Butter', keywords: 'lip butter butters oils honey organic chemical free preservative free balm', price:'Rs. 299.00' },
  { id:19, img:TattooCleanser,            name:'Tattoo Cleanser 100 ml', category: 'Tattoo', keywords: 'tattoo cleanser citrus fruit wash gentle sulphate free aloe vera vitamin e', price:'Rs. 299.00', mrp:'Rs. 349.00' },
  { id:20, img:TattooButter,              name:'Tattoo Butter 50 Grams', category: 'Tattoo', keywords: 'tattoo butter natural butters oils shea cocoa mango kokum protection', price:'Rs. 799.00', mrp:'Rs. 899.00' },
  { id:21, img:WinterCombo,              name:'Winter Combo : The Day Cream 50 Gram + The Night Cream 50 Gram + Lip Butter 15 Gram', category: 'Combo', keywords: 'winter combo day cream night cream lip butter routine spf hyaluronic acid retinol niacinamide hydration winter care', price:'Rs. 699.00' },
]

export default function AllProductsPage({ onNavigate, searchQuery, onLoginClick }) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredProduct, setHoveredProduct] = useState(null)
  // Default to list view on mobile, grid on desktop
  const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'list' : 'grid')

  // Sync searchQuery prop with local state
  useEffect(() => {
    if (searchQuery) {
      setLocalSearchQuery(searchQuery)
    }
  }, [searchQuery])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(allProducts.map(p => p.category))]
    return cats
  }, [])

  // Filter logic
  const filteredProducts = useMemo(() => {
    let result = allProducts

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory)
    }

    // Search filter
    const query = (localSearchQuery || searchQuery || '').toLowerCase().trim()
    if (query) {
      result = result.filter(product => {
        const searchableText = `${product.name} ${product.category} ${product.keywords}`.toLowerCase()
        return searchableText.includes(query)
      })
    }

    return result
  }, [localSearchQuery, searchQuery, selectedCategory])

  const handleClearSearch = () => {
    setLocalSearchQuery('')
    // Navigate back to clear URL search params
    if (onNavigate) {
      onNavigate('shop')
    }
  }

  const handleProductClick = (e, productId) => {
    handleNavigation(e, onNavigate, 'product', { productId })
  }

  return (
    <div className="shop-page all-products-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} />

      {/* Simple Page Header */}
      <div className="all-products-header">
        <h1 className="all-products-title">All Products</h1>
        <p className="all-products-count">
          {allProducts.length} Products Available
        </p>
      </div>

      {/* Main Content */}
      <div className="shop-page__content">
        {/* Real-time Search Bar */}
        <div className="all-products-search">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
          {localSearchQuery && (
            <button 
              className="search-clear" 
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Mode Toggle & Category Filter */}
        <div className="filter-bar">
          {/* View Mode Toggle - Desktop and Mobile */}
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <rect x="3" y="4" width="2" height="4" />
                <rect x="3" y="10" width="2" height="4" />
                <rect x="3" y="16" width="2" height="4" />
              </svg>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'category-pill--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Display - Grid or List */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' ? 'products-grid' : 'products-list'}>
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className={viewMode === 'grid' ? 'product-card' : 'product-list-card'}
                onClick={(e) => handleProductClick(e, product.id)}
                onAuxClick={(e) => e.button === 1 && handleProductClick(e, product.id)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="product-card__img-wrap">
                      <img src={product.img} alt={product.name} className="product-card__img" />
                    </div>
                    <div className="product-card__body">
                      <p className="product-card__category">{product.category}</p>
                      <h3 className="product-card__name">{product.name}</h3>
                      <div className="product-card__footer">
                        <span className="product-card__price">{product.price}</span>
                        {product.mrp && (
                          <span className="product-card__mrp">{product.mrp}</span>
                        )}
                      </div>
                    </div>

                    {/* Hover Popup */}
                    {hoveredProduct === product.id && (
                      <div className="product-popup">
                        <div className="product-popup__content">
                          <div className="product-popup__header">
                            <h3>{product.name}</h3>
                            <span className="product-popup__category">{product.category}</span>
                          </div>
                          <div className="product-popup__details">
                            <div className="product-popup__price-section">
                              <span className="popup-price">{product.price}</span>
                              {product.mrp && <span className="popup-mrp">{product.mrp}</span>}
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
                            onClick={(e) => handleProductClick(e, product.id)}
                            onAuxClick={(e) => e.button === 1 && handleProductClick(e, product.id)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // List View (Flipkart Style)
                  <>
                    <div className="product-list-card__image">
                      <img src={product.img} alt={product.name} />
                    </div>
                    <div className="product-list-card__content">
                      <div className="product-list-card__header">
                        <h3 className="product-list-card__name">{product.name}</h3>
                        <div className="product-list-card__meta">
                          <span className="product-list-card__category">{product.category}</span>
                          <div className="product-rating">
                            <span className="stars">★★★★★</span>
                            <span className="rating-count">(4.5)</span>
                          </div>
                        </div>
                      </div>
                      <div className="product-list-card__features">
                        <span className="feature-badge">✓ Cruelty Free</span>
                        <span className="feature-badge">✓ GMP Certified</span>
                        <span className="feature-badge">✓ Scientifically Proven</span>
                      </div>
                      <div className="product-list-card__footer">
                        <div className="product-list-card__pricing">
                          <span className="list-price">{product.price}</span>
                          {product.mrp && (
                            <>
                              <span className="list-mrp">{product.mrp}</span>
                              <span className="list-discount">
                                {Math.round(((parseFloat(product.mrp.replace(/[^0-9.]/g, '')) - parseFloat(product.price.replace(/[^0-9.]/g, ''))) / parseFloat(product.mrp.replace(/[^0-9.]/g, ''))) * 100)}% off
                              </span>
                            </>
                          )}
                        </div>
                        <button className="list-view-btn" onClick={(e) => { e.stopPropagation(); handleProductClick(e, product.id); }}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
            <button className="btn-clear-all" onClick={() => { setLocalSearchQuery(''); setSelectedCategory('All'); }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Build Your Routine Banner */}
      <div className="build-routine-banner">
        <div className="build-routine-banner__inner">
          <h2 className="build-routine-banner__title">Build Your Personalized Routine</h2>
          <p className="build-routine-banner__subtitle">
            Answer a few simple questions and discover a routine tailored to your needs
          </p>
          <button
            className="build-routine-banner__btn"
            onClick={() => onNavigate && onNavigate('build-my-regimen')}
          >
            Take the Quiz →
          </button>
        </div>
      </div>

      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}
