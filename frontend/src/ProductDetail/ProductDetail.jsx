import { useState, useEffect, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import LoveWhatYouSee from '../assets/LoveWhatYouSee.jpg'
import './ProductDetail.css'
import { handleNavigation } from '../utils/navigation'

// Lazy load 3D viewer - only loads when user clicks 3D View button
const Model3DViewer = lazy(() => import('../Component/Model3DViewer'))

export default function ProductDetail({ product, onNavigate, onBack, relatedProducts = [], onLoginClick, onAddToCart, cartCount }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [viewMode, setViewMode] = useState('image') // 'image' or '3d'
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [load3DViewer, setLoad3DViewer] = useState(false) // Control when to load 3D viewer

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    // Optional: Show success message or animation
    alert(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`)
  }
  const [expandedSection, setExpandedSection] = useState(null)

  // Product images - if product has multiple images, use them, otherwise use main image
  const images = product.images || [product.img]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [product.id])

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Handle 3D view mode change - lazy load on first click
  const handle3DViewClick = () => {
    setLoad3DViewer(true)
    setViewMode('3d')
  }

  const handleBackToPhotos = () => {
    setViewMode('image')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Aloweda`,
        url: window.location.href,
      })
    } else {
      alert('Share feature not supported on this browser')
    }
  }

  return (
    <div className="product-detail">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => onBack()} className="breadcrumb-link">Shop</button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-detail__container">
        {/* Left: Image Gallery / 3D Viewer */}
        <div className="product-gallery">
          {/* Image Gallery */}
          <div className="product-gallery__main">
                <img src={images[currentImageIndex]} alt={product.name} />

                {images.length > 1 && (
                  <>
                    <button className="gallery-arrow gallery-arrow--prev" onClick={prevImage}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button className="gallery-arrow gallery-arrow--next" onClick={nextImage}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </>
                )}

                {/* 3D View button removed */}
              </div>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="product-gallery__thumbs">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`thumb ${idx === currentImageIndex ? 'thumb--active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img src={img} alt={`View ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
        </div>

        {/* Right: Product Info */}
        <div className="product-info">
          <div className="product-info__header">
            <div>
              <p className="product-brand">Aloweda</p>
              <h1 className="product-title">{product.name}</h1>
            </div>
            <button className="share-btn" onClick={handleShare} aria-label="Share">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
          </div>

          {/* Price */}
          <div className="product-price">
            <span className="price-current">{product.price}</span>
            {product.mrp && <span className="price-mrp">{product.mrp}</span>}
            {product.mrp && (
              <span className="price-discount">
                Save {Math.round(((parseFloat(product.mrp.replace(/[^0-9.]/g, '')) - parseFloat(product.price.replace(/[^0-9.]/g, ''))) / parseFloat(product.mrp.replace(/[^0-9.]/g, ''))) * 100)}%
              </span>
            )}
          </div>
          <p className="tax-info">Tax included. Shipping calculated at checkout</p>

          {/* Stock Status Badge */}
          {product.stock === 0 && (
            <div className="stock-alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>OUT OF STOCK</span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="stock-alert low-stock">
              <span>⚡ Only {product.stock} left in stock!</span>
            </div>
          )}

          {/* Tag */}
          {product.tag && (
            <div className="product-tag">
              <span className="tag-badge">{product.tag}</span>
            </div>
          )}

          {/* Expandable Sections */}
          <div className="pd-sections">
            <div className="pd-section">
              <button className="pd-section-header" onClick={() => toggleSection('description')}>
                <span>DESCRIPTION</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={expandedSection === 'description' ? 'pd-icon-rotate' : ''}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {expandedSection === 'description' && (
                <div className="pd-section-content">
                  <p>{product.description || product.desc || 'This premium product is formulated with the finest scientifically-proven ingredients to give you visible results. Experience the Aloweda difference with our sensible, simple, and synergistic skincare approach.'}</p>
                </div>
              )}
            </div>

            <div className="pd-section">
              <button className="pd-section-header" onClick={() => toggleSection('ingredients')}>
                <span>KEY INGREDIENTS</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={expandedSection === 'ingredients' ? 'pd-icon-rotate' : ''}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {expandedSection === 'ingredients' && (
                <div className="pd-section-content">
                  <p>{product.ingredients || 'Premium scientifically-proven and effective ingredients including botanical extracts, vitamins, and active compounds. All ingredients are ethically sourced and cruelty-free.'}</p>
                </div>
              )}
            </div>

            <div className="pd-section">
              <button className="pd-section-header" onClick={() => toggleSection('howto')}>
                <span>HOW TO USE</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={expandedSection === 'howto' ? 'pd-icon-rotate' : ''}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {expandedSection === 'howto' && (
                <div className="pd-section-content">
                  <p>{product.howToUse || 'Apply a small amount to clean, dry skin. Gently massage in circular motions until fully absorbed. Use daily for best results. Follow with sunscreen during the day.'}</p>
                </div>
              )}
            </div>

            <div className="pd-section">
              <button className="pd-section-header" onClick={() => toggleSection('shipping')}>
                <span>SHIPPING & RETURNS</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={expandedSection === 'shipping' ? 'pd-icon-rotate' : ''}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              {expandedSection === 'shipping' && (
                <div className="pd-section-content">
                  <p><strong>Shipping:</strong> Free shipping on orders above ₹499. Standard delivery in 5-7 business days.</p>
                  <p><strong>Returns:</strong> 30-day hassle-free return policy. Products must be unused and in original packaging.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  aria-label="Decrease"
                >−</button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max="4"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1
                    setQuantity(Math.min(4, Math.max(1, val)))
                  }}
                />
                <button
                  onClick={() => setQuantity(Math.min(4, quantity + 1))}
                  aria-label="Increase"
                  disabled={quantity >= 4}
                  style={{opacity: quantity >= 4 ? 0.5 : 1, cursor: quantity >= 4 ? 'not-allowed' : 'pointer'}}
                >
                  +
                </button>
              </div>
            </div>
            {(product.stock === 0 || product.outOfStock) ? (
              <button className="add-to-cart-btn low-opacity-btn" onClick={handleAddToCart}>
                Add to Cart (Out of Stock)
              </button>
            ) : (
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            )}
          </div>

          {/* Features */}
          <div className="product-features">
            <div className="feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Cruelty Free</span>
            </div>
            <div className="feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>GMP Certified</span>
            </div>
            <div className="feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Effective Ingredients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="product-reviews">
        <div className="product-reviews__container">
          <h2 className="reviews-title">Customer Reviews</h2>

          {/* Reviews List */}
          <div className="reviews-list">
            <div className="review-card">
              <div className="review-header">
                <div className="review-stars">
                  {'★'.repeat(5)}{'☆'.repeat(0)}
                </div>
                <span className="review-date">2 weeks ago</span>
              </div>
              <p className="review-author">Priya M.</p>
              <p className="review-text">Amazing product! My skin feels so much softer and more radiant. Highly recommend this to everyone looking for effective skincare solutions.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="review-stars">
                  {'★'.repeat(4)}{'☆'.repeat(1)}
                </div>
                <span className="review-date">1 month ago</span>
              </div>
              <p className="review-author">Rahul K.</p>
              <p className="review-text">Great quality and fast delivery. The product works well and I can see visible results. Will definitely purchase again.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="review-stars">
                  {'★'.repeat(5)}{'☆'.repeat(0)}
                </div>
                <span className="review-date">1 month ago</span>
              </div>
              <p className="review-author">Anjali S.</p>
              <p className="review-text">Love it! Proven ingredients, no harsh chemicals. My skin has never looked better. Worth every penny.</p>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="review-stars">
                  {'★'.repeat(5)}{'☆'.repeat(0)}
                </div>
                <span className="review-date">2 months ago</span>
              </div>
              <p className="review-author">Vikram D.</p>
              <p className="review-text">Excellent product quality. Packaging was perfect and the results are visible within weeks. Highly satisfied!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tattoo Quiz Banner — only on tattoo products */}
      {product.category === 'Tattoo' && (
        <div className="pd-tattoo-quiz-banner">
          <div className="pd-tattoo-quiz-banner__inner">
            <div className="pd-tattoo-quiz-banner__text">
              <span className="pd-tattoo-quiz-banner__eyebrow">Free Tool</span>
              <h3 className="pd-tattoo-quiz-banner__title">Not sure what your tattoo needs?</h3>
              <p className="pd-tattoo-quiz-banner__sub">Answer 5 quick questions and get a personalised tattoo care routine.</p>
            </div>
            <Link to="/tattoo-quiz" className="pd-tattoo-quiz-banner__btn">
              Take the Quiz →
            </Link>
          </div>
        </div>
      )}

      {/* You May Also Like Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="related-products">
          <h2 className="related-products__title">You may also like</h2>
          <div className="related-products__grid">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="related-card"
                onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: p.id })}
                onAuxClick={(e) => e.button === 1 && handleNavigation(e, onNavigate, 'product', { productId: p.id })}
                onMouseEnter={() => setHoveredProduct(p.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="related-card__img-wrap">
                  <img src={p.img} alt={p.name} />
                </div>
                <div className="related-card__body">
                  <p className="related-card__name">{p.name}</p>
                  <div className="related-card__price">
                    <span className="price">{p.price}</span>
                    {p.mrp && <span className="mrp">{p.mrp}</span>}
                  </div>
                </div>

                {/* Hover Popup */}
                {hoveredProduct === p.id && (
                  <div className="product-popup">
                    <div className="product-popup__content">
                      <div className="product-popup__header">
                        <h3>{p.name}</h3>
                        <span className="product-popup__category">{p.category || 'Product'}</span>
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
                          <p>✓ Free Shipping on Orders Above ₹499</p>
                        </div>
                      </div>
                      <button className="product-popup__btn">View Details</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}