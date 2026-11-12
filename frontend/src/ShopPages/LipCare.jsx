import { useState, useMemo } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import './ShopPage.css'
import './LipCare.css'
import { handleNavigation } from '../utils/navigation'
import useSEO from '../utils/useSEO'

import LC1 from '../LipCareImg/LipCare1.jpg'
import LC2 from '../LipCareImg/LipCare2.jpg'

const products = [
  { 
    id: 17, 
    img: LC1, 
    name: 'Lip Butter 8 Gram: Butters, Oils & Honey.ZERO CHEMICALS, NO PRESERVATIVES', 
    category: 'Lip Butter',
    keywords: 'lip butter butters oils honey organic chemical free preservative free',
    price: 'Rs. 75.00' 
  },
  { 
    id: 18, 
    img: LC2, 
    name: 'Lip Butter 15 Gram: Butters, Oils & Honey. NO CHEMICALS, NO PRESERVATIVES. NOT LIP BALM', 
    category: 'Lip Butter',
    keywords: 'lip butter butters oils honey organic chemical free preservative free balm',
    price: 'From Rs. 165.00' 
  },
]

export default function LipCarePage({ onNavigate, searchQuery, onLoginClick }) {
  useSEO({
    title: 'Lip Care Products | Natural Lip Butter | Aloweda',
    description: 'Shop Aloweda\'s natural Lip Butter — made with shea, cocoa, mango butter, beeswax & honey. Zero petrochemicals. Heals chapped lips & ulcers.',
    canonical: '/lipcare',
  })
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '')
  const [hoveredProduct, setHoveredProduct] = useState(null)

  // Search filter logic
  const filteredProducts = useMemo(() => {
    const query = (localSearchQuery || searchQuery || '').toLowerCase().trim()
    if (!query) return products

    return products.filter(product => {
      const searchableText = `${product.name} ${product.category} ${product.keywords}`.toLowerCase()
      return searchableText.includes(query)
    })
  }, [localSearchQuery, searchQuery])

  const handleClearSearch = () => {
    setLocalSearchQuery('')
  }
  return (
    <div className="shop-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} />

      <div className="shop-page__hero">
        <h1 className="shop-page__hero-title">Lip Care</h1>
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
            placeholder="Search lip care products..."
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
                <img src={p.img} alt={p.name} className="sp-card__img" loading="lazy" decoding="async" />
              </div>
              <div className="sp-card__body">
                <p className="sp-card__category">{p.category}</p>
                <p className="sp-card__name">{p.name}</p>
                <div className="sp-card__footer">
                  <span className="sp-card__price">{p.price}</span>
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
          <p>Try searching with different keywords like "lip butter", "honey", or "oils"</p>
          <button className="shop-page__quiz-btn" onClick={handleClearSearch}>Clear Search</button>
        </div>
      )}

      <div className="shop-page__info">
        <h2 className="shop-page__info-title">Lip Care</h2>
        <p className="shop-page__info-desc">
          Nourish, protect and beautify your lips with our range of effective lip care products.
          Formulated with Shea Butter, Vitamin E and beneficial botanicals for soft, supple lips every day.
        </p>
        <button className="shop-page__quiz-btn">Start Quiz</button>
      </div>
      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}
