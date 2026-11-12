import { useState, useMemo } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import './BestSeller.css'
import { handleNavigation } from '../utils/navigation'
import useSEO from '../utils/useSEO'

// Import product images
import SC1 from '../SkinCareImg/SkinCare1.png'
import SC2 from '../SkinCareImg/SkinCare2.png'
import SC3 from '../SkinCareImg/SkinCare3.jpg'
import SC8 from '../SkinCareImg/SkinCare8.jpg'
import SC12 from '../SkinCareImg/SkinCare12.jpg'
import HairCareImg from '../assets/HairCare.png'
import HairCareHeroImg from '../assets/HairCareFeaturedList.png'
import LipCareImg from '../assets/FeaturedListLipCare.jpg'
import SmartSkinCareImg from '../assets/FeaturedListSkinCare.png'

const BEST_SELLER_PRODUCTS = [
  { id: 1,  img: SC1,  name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', category: 'Combo', price: 'Rs. 899.00', mrp: 'Rs. 1,199.00', tag: 'Best Seller' },
  { id: 2,  img: SC2,  name: 'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream + Complexion Cream + Smooth Perfection Serum', category: 'Combo', price: 'Rs. 1,299.00', mrp: 'Rs. 1,599.00', tag: 'Best Seller' },
  { id: 3,  img: SC3,  name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', category: 'Combo', price: 'Rs. 1,149.00', mrp: 'Rs. 1,299.00', tag: 'Best Seller' },
  { id: 8,  img: SC8,  name: 'Vitamin C 15%, Niacinamide 5%, Hyaluronic Acid & Ferulic Acid 1% Serum 30 ml for Super Glow', category: 'Serum', price: 'Rs. 649.00', mrp: 'Rs. 699.00', tag: 'Best Seller' },
  { id: 12, img: SC12, name: 'Niacinamide 10 %, Acetyl Glucosamine & Ceramides 30 ml Serum for Tone & Texture', category: 'Serum', price: 'Rs. 599.00', mrp: 'Rs. 649.00', tag: 'Best Seller' },
  { id: 16, img: HairCareImg, name: 'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', category: 'Hair Serum', price: 'Rs. 875.00', mrp: 'Rs. 975.00', tag: 'Best Seller' },
]

const HERO_ITEMS = [
  { key: 'hair', img: HairCareHeroImg, label: 'Hair Care', nav: 'hair' },
  { key: 'lip', img: LipCareImg, label: 'Lip Care', nav: 'lip' },
  { key: 'skincare', img: SmartSkinCareImg, label: 'Smart Skincare', nav: 'skincare' },
]

export default function BestSellerPage({ onNavigate, onLoginClick, cartCount }) {
  useSEO({
    title: 'Best Sellers | Top Rated Skincare | Aloweda',
    description: 'Shop Aloweda\'s best-selling skincare products — Vitamin C serums, SPF day cream, retinol night cream, niacinamide serum and more. Free shipping above ₹999.',
    canonical: '/bestsellers',
  })
  const [sortBy, setSortBy] = useState('featured')
  const [hoveredProduct, setHoveredProduct] = useState(null)

  const sortedProducts = useMemo(() => {
    let sorted = [...BEST_SELLER_PRODUCTS]

    if (sortBy === 'price-low') {
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9]/g, ''))
        const priceB = parseFloat(b.price.replace(/[^0-9]/g, ''))
        return priceA - priceB
      })
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9]/g, ''))
        const priceB = parseFloat(b.price.replace(/[^0-9]/g, ''))
        return priceB - priceA
      })
    }

    return sorted
  }, [sortBy])

  return (
    <div className="bestseller-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* Best Sellers Heading */}
      <div 
        className="bestseller-heading" 
        style={{ 
          textAlign: 'center', 
          paddingLeft: '48px', 
          paddingRight: '48px',
          transform: 'none',
          left: 'auto',
          right: 'auto',
          position: 'relative'
        }}
      >
        <h1 style={{ 
          textAlign: 'center', 
          width: '100%', 
          marginLeft: 'auto', 
          marginRight: 'auto',
          transform: 'none',
          position: 'relative',
          left: '0',
          right: '0'
        }}>
          Best Sellers
        </h1>
        <p style={{ 
          textAlign: 'center', 
          width: '100%', 
          marginLeft: 'auto', 
          marginRight: 'auto',
          transform: 'none',
          position: 'relative',
          left: '0',
          right: '0'
        }}>
          Discover our most loved products
        </p>
      </div>

      {/* Hero Section with 3 Product Images */}
      <div className="bestseller-hero">
        <div className="bestseller-hero__container">
          {HERO_ITEMS.map((item, i) => (
            <div
              key={item.key}
              className="hero-product"
              style={{ '--i': i }}
              onClick={() => onNavigate(item.nav)}
            >
              <img src={item.img} alt={item.label} loading="lazy" decoding="async" />
              <div className="hero-product__label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bestseller-topbar">
        <div className="bestseller-topbar-left">
          <button className="filter-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            Filter
          </button>
          <span className="product-count">{sortedProducts.length} Products</span>
        </div>

        <div className="bestseller-topbar-right">
          <label htmlFor="sort-select" className="sort-label">Sort by</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bestseller-grid">
        {sortedProducts.map((product, i) => (
          <div
            key={product.id}
            className="bestseller-card"
            style={{ '--i': i }}
            onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: product.id })}
            onAuxClick={(e) => {
              if (e.button === 1) { // Middle mouse button
                handleNavigation(e, onNavigate, 'product', { productId: product.id });
              }
            }}
            onMouseLeave={() => setHoveredProduct(null)}
            onMouseEnter={() => setHoveredProduct(product.id)}
          >
            {product.tag && (
              <div className="product-tag">{product.tag}</div>
            )}
            <div className="bestseller-card__img-wrap">
              <img src={product.img} alt={product.name} className="bestseller-card__img" loading="lazy" decoding="async" />
            </div>
            <div className="bestseller-card__body">
              <p className="bestseller-card__category">{product.category}</p>
              <p className="bestseller-card__name">{product.name}</p>
              <div className="bestseller-card__footer">
                <div className="price-group">
                  <span className="bestseller-card__price">{product.price}</span>
                  {product.mrp && <span className="bestseller-card__mrp">{product.mrp}</span>}
                </div>
                <button
                  className="bestseller-add-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    alert('Added to cart!')
                  }}
                >
                  Add to Bag
                </button>
              </div>
            </div>

            {/* Hover Popup */}
            {hoveredProduct === product.id && (
              <div 
                className="product-popup"
                onMouseEnter={() => setHoveredProduct(product.id)}
              >
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
                    onClick={(e) => {
                      e.stopPropagation()
                      onNavigate('product', { productId: product.id })
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}