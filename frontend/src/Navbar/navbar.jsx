import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AlowedaLogo from '../assets/AlowedaLogo.png'
import { CATEGORIES } from '../data/products'
import './navbar.css'

// Import product images for search
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
import LC1 from '../LipCareImg/LipCare1.jpg'
import LC2 from '../LipCareImg/LipCare2.jpg'
import WinterCombo from '../assets/Winter Combo.png'

// All products for search
const ALL_SEARCH_PRODUCTS = [
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
  { id:16, img:HairCareImg, name:'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', category: 'Hair Serum', keywords: 'redensyl anagain rice water biotin hair therapy serum growth hair fall', price:'Rs. 875.00', mrp:'Rs. 975.00' },
  { id:17, img:LC1, name:'Lip Butter 8 Gram: Butters, Oils & Honey. ZERO CHEMICALS, NO PRESERVATIVES', category: 'Lip Butter', keywords: 'lip butter butters oils honey organic chemical free preservative free', price:'Rs. 95.00', mrp:'Rs. 105.00' },
  { id:18, img:LC2, name:'Lip Butter 15 Gram: Butters, Oils & Honey. NO CHEMICALS, NO PRESERVATIVES. NOT LIP BALM', category: 'Lip Butter', keywords: 'lip butter butters oils honey organic chemical free preservative free balm', price:'Rs. 299.00' },
  { id:21, img:WinterCombo, name:'Winter Combo : The Day Cream 50 Gram + The Night Cream 50 Gram + Lip Butter 15 Gram', category: 'Combo', keywords: 'winter combo day cream night cream lip butter routine spf hyaluronic acid retinol niacinamide hydration winter care', price:'Rs. 699.00' },
]

export default function Navbar({ onNavigate, cartCount = 0, onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [hasAnnouncementBar, setHasAnnouncementBar] = useState(true)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Listen for announcement bar visibility changes
  useEffect(() => {
    const checkAnnouncementBar = () => {
      const wasClosed = sessionStorage.getItem('announcementBarClosed')
      setHasAnnouncementBar(wasClosed !== 'true')
    }

    checkAnnouncementBar()

    const handleAnnouncementBarVisible = () => setHasAnnouncementBar(true)
    const handleAnnouncementBarHidden = () => setHasAnnouncementBar(false)

    window.addEventListener('announcementBarVisible', handleAnnouncementBarVisible)
    window.addEventListener('announcementBarHidden', handleAnnouncementBarHidden)
    window.addEventListener('announcementBarClosed', handleAnnouncementBarHidden)

    return () => {
      window.removeEventListener('announcementBarVisible', handleAnnouncementBarVisible)
      window.removeEventListener('announcementBarHidden', handleAnnouncementBarHidden)
      window.removeEventListener('announcementBarClosed', handleAnnouncementBarHidden)
    }
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Real-time search filtering
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const filtered = ALL_SEARCH_PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) ||
        product.keywords.toLowerCase().includes(query)
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchResults([])
        setSearchQuery('')
        setSearchOpen(false)
      }
    }
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen])

  const nav = (page, params) => {
    setMenuOpen(false)
    setShopOpen(false)
    setSearchOpen(false)
    setSearchResults([])
    setSearchQuery('')
    onNavigate?.(page, params)
  }

  const handleProductClick = (productId) => {
    nav('product', { productId })
  }

  // Helper to convert page name to route
  const getRoute = (page) => {
    const routes = {
      'home': '/',
      'shop': '/shop',
      'skincare': '/skincare',
      'haircare': '/haircare',
      'hair': '/haircare',
      'lipcare': '/lipcare',
      'lip': '/lipcare',
      'bestsellers': '/bestsellers',
      'cart': '/cart',
      'serums': '/serums',
      'creams': '/creams',
      'moisturisers': '/moisturisers',
      'tattoo': '/tattoo',
      'tattoo-quiz': '/tattoo-quiz',
      'rituals': '/rituals',
      'facewash': '/facewash',
      'about': '/about'
    }
    return routes[page] || `/${page}`
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${!hasAnnouncementBar ? 'navbar--no-announcement' : ''}`}>
      <div className="navbar__inner">

        {/* Left */}
        <nav className="navbar__left">
          <div
            className="navbar__dropdown-wrap"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button className="navbar__link navbar__link--arrow">
              Shop <span className="arrow">▾</span>
            </button>
            {shopOpen && (
              <div className="navbar__dropdown">
                {/* Smart Skincare with submenu */}
                <div className="navbar__dropdown-category">
                  <span className="navbar__dropdown-item navbar__dropdown-item--parent">
                    Smart Skincare
                  </span>
                  <div className="navbar__dropdown-submenu">
                    {CATEGORIES.filter(c => c.parent === 'skincare').map((c) => (
                      <Link 
                        key={c.id} 
                        to={getRoute(c.id)} 
                        className="navbar__dropdown-subitem"
                        onClick={() => { setShopOpen(false); setMenuOpen(false); }}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link to="/bestsellers" className="navbar__link" onClick={() => { setMenuOpen(false); setShopOpen(false); }}>Best Sellers</Link>
          <Link to="/gifting" className="navbar__link" onClick={() => { setMenuOpen(false); setShopOpen(false); }}>Gifting</Link>
          <Link to="/consultation" className="navbar__link" onClick={() => { setMenuOpen(false); setShopOpen(false); }}>Specialist Consultation</Link>
        </nav>

        {/* Logo */}
        <Link to="/" className="navbar__logo-wrap" onClick={() => { setMenuOpen(false); setShopOpen(false); }}>
          <img src={AlowedaLogo} alt="Aloweda" className="navbar__logo" fetchpriority="high" decoding="async" />
        </Link>

        {/* Right */}
        <div className="navbar__right">
          {searchOpen ? (
            <div className="navbar__search-container" ref={dropdownRef}>
              <div className="navbar__search-bar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="navbar__search-input"
                />
                <button className="navbar__search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]) }}>✕</button>
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="navbar__search-dropdown">
                  {searchResults.slice(0, 5).map(product => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`}
                      className="navbar__search-result"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                    >
                      <img src={product.img} alt={product.name} className="navbar__search-result-img" loading="lazy" decoding="async" />
                      <div className="navbar__search-result-info">
                        <div className="navbar__search-result-name">{product.name}</div>
                        <div className="navbar__search-result-price">{product.price}</div>
                      </div>
                    </Link>
                  ))}
                  {searchResults.length > 5 && (
                    <div 
                      className="navbar__search-result-more"
                      onClick={() => nav('shop', { search: searchQuery.trim() })}
                    >
                      +{searchResults.length - 5} more results - Click to view all
                    </div>
                  )}
                </div>
              )}
              
              {searchQuery.trim() && searchResults.length === 0 && (
                <div className="navbar__search-dropdown">
                  <div className="navbar__search-no-results">No products found</div>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar__icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          )}
          <button className="navbar__icon-btn" aria-label="Account" onClick={onLoginClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" aria-label="Cart" onClick={() => { setMenuOpen(false); setShopOpen(false); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </Link>
          <button className={`navbar__burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>All Products</Link>
          <Link to="/bestsellers" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Best Sellers</Link>
          <Link to="/gifting" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Gifting</Link>
          <Link to="/consultation" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Specialist Consultation</Link>
          <div className="navbar__mobile-divider">Smart Skincare</div>
          {CATEGORIES.filter(c => c.parent === 'skincare').map((c) => (
            <Link 
              key={c.id} 
              to={getRoute(c.id)} 
              className="navbar__mobile-link navbar__mobile-link--sub"
              onClick={() => setMenuOpen(false)}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
