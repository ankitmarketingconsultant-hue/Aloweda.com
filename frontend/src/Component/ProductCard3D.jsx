import { useRef, useState } from 'react'
import './ProductCard3D.css'

/* ── 3D Tilt Product Card with Floating Animation ── */
export default function ProductCard3D({ 
  product, 
  onNavigate, 
  onAddToCart, 
  className = '',
  showTag = true 
}) {
  const cardRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const handleMouseMove = (e) => {
    // 3D rotation disabled
    return
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    setShowPopup(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setShowPopup(false)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    console.log('Add to Cart clicked for:', product)
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate('product', { productId: product.id })
    }
  }

  return (
    <div 
      ref={cardRef}
      className={`product-card-3d ${className} ${isHovering ? 'is-hovering' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className="product-card-3d__inner">
        {/* Image Container */}
        <div className="product-card-3d__img-wrap">
          <img 
            src={product.img} 
            alt={product.name} 
            className="product-card-3d__img" 
          />
          {showTag && product.tag && (
            <span className="product-card-3d__tag">{product.tag}</span>
          )}
          
          {/* Out of Stock Badge */}
          {product.stock === 0 && (
            <div className="product-oos-badge">
              <span>OUT OF STOCK</span>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="product-card-3d__overlay">
            <button 
              className="btn btn--white" 
              onClick={(e) => { e.stopPropagation(); handleCardClick() }}
            >
              Quick View
            </button>
          </div>

          {/* Glare Effect */}
          <div className="product-card-3d__glare" />
        </div>

        {/* Hover Popup */}
        {showPopup && (
          <div className="product-popup-3d">
            <div className="product-popup__content">
              <div className="product-popup__header">
                <h3>{product.name}</h3>
                <span className="product-popup__category">{product.category || 'Product'}</span>
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
                  <p>✓ Free Shipping on Orders Above ₹499</p>
                </div>
              </div>
              <button className="product-popup__btn" onClick={handleCardClick}>View Details</button>
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="product-card-3d__body">
          <h3 className="product-card-3d__name">{product.name}</h3>
          <div className="product-card-3d__footer">
            <div className="product-card-3d__prices">
              <span className="product-card-3d__price">{product.price}</span>
              {product.mrp && <span className="product-card-3d__mrp">{product.mrp}</span>}
            </div>
            <button 
              className="btn btn--outline-dark btn--sm" 
              onClick={handleAddToCart}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
