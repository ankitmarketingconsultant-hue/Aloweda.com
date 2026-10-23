import { useState, useEffect, useRef, useCallback } from 'react'

// Product Images from ProductDetailsImages folder
import SuperGlowSerum from '../ProductDetailsImages/SuperGlowSerum.png'
import TheNightCream from '../ProductDetailsImages/TheNightCream.png'

// Slider Images
import SerumSlider from '../assets/serumSliderImage.png'
import CreamSlider from '../assets/CreamSliderImage.png'
import LipsSlider from '../assets/LipsSlider.png'
import TattooCareSlider from '../assets/TattooButterslider.png'
import HairCareSlider from '../assets/HairCareslider.png'

// Category Images
import HairCareImg from '../assets/HairCare.png'
import RadianceCream2 from '../ProductDetailsImages/RadianceCream2.png'
import LipCareLookBook from '../assets/lipCareLookBook.png'
import LipCareImg from '../assets/LipCare.png'
import FaceWashImg from '../assets/FaceWash.png'
import TattooButterImg from '../assets/TattooButter.png'

// What's Aloweda Videos
import AyurvedaVideo from '../assets/Ayurveda.mp4'
import AllopathyVideo from '../assets/Allopathy.mp4'
import SafeSyntheticsVideo from '../assets/SafeSynthetics.mp4'
import KnowledgeInnovationVideo from '../assets/Knowledge&Innovation.mp4'

// LookBook Images
import SmartSkinCareLookBook from '../assets/FeaturedListSkinCare.png'
import FaceWashBG from '../assets/FaceWashBG.png'
import HairCareLookBook from '../assets/HairCareLookBook.png'

import { handleNavigation } from '../utils/navigation'
import SC1 from '../SkinCareImg/SkinCare1.png'
import SC2 from '../SkinCareImg/SkinCare2.png'
import SC3 from '../SkinCareImg/SkinCare3.jpg'
import SC8 from '../SkinCareImg/SkinCare8.jpg'
import SC10 from '../SkinCareImg/SkinCare10.jpg'
import SC11 from '../assets/lineandwrinkleserum.png'
import SC14 from '../SkinCareImg/SkinCare14.jpg'
import LC2 from '../LipCareImg/LipCare2.jpg'
import Navbar from '../Navbar/navbar'
import BestSellers from './BestSeller'
import BuildRegimenCTA from './BuildRegimenCTA'
import ImageCarousel from './ImageCarousel'
import FeatureList from './FeatureList/FeatureList'
import Footer from '../Footer/Footer'
import './HomePage.css'

/* ─────────────── DATA ─────────────── */

const slides = [
  {
    id: 1,
    type: 'whats-aloweda',
    heading: "What's Aloweda?",
    sub: 'Another Skincare? No, Cuticle care!',
    graphics: [
      { video: AyurvedaVideo, label: 'Ayurveda' },
      { video: AllopathyVideo, label: 'Allopathy' },
      { video: SafeSyntheticsVideo, label: 'Safe Synthetics' },
      { video: KnowledgeInnovationVideo, label: 'Knowledge & Innovation' }
    ]
  },
  {
    id: 2,
    type: 'serums-slide',
    heading: 'Serums',
    sub: 'Spread & Tap! They vanish in 5 minutes!',
    description: 'Our highly concentrated serums are designed to penetrate deep into your skin, delivering powerful active ingredients exactly where they\'re needed. Lightweight, fast-absorbing, and incredibly effective.',
    image: SerumSlider,
    cta: 'SHOP NOW',
    targetPage: 'serums',
  },
  {
    id: 3,
    type: 'creams-slide',
    heading: 'Creams',
    subLine: 'Allow them to melt into your skin',
    description: 'Our creams are designed to melt into your skin effortlessly. Rich, nourishing formulas that provide deep hydration without feeling heavy. Just apply and let them work their magic.',
    image: CreamSlider,
    cta: 'SHOP NOW',
    targetPage: 'moisturisers',
  },
  {
    id: 4,
    type: 'facewash-slide',
    heading: 'Face Wash',
    sub: 'Gentle but serious cleansers',
    description: 'Our face washes are formulated to deeply cleanse without stripping your skin\'s natural moisture. Perfect pH balance, gentle on skin, tough on dirt and impurities.',
    image: FaceWashImg,
    cta: 'SHOP NOW',
    targetPage: 'facewash',
  },
  {
    id: 5,
    type: 'lips-slide',
    heading: 'Lip Care',
    sub: 'No to Chemicals. Yes to Botanical butters, oils & Vitamins',
    description: 'Pure, natural lip care with botanical butters and nourishing oils. Zero chemicals, zero preservatives. Just nature\'s best ingredients to keep your lips soft, smooth, and healthy.',
    image: LipsSlider,
    cta: 'SHOP NOW',
    targetPage: 'lipcare',
  },
  {
    id: 6,
    type: 'tattoo-slide',
    heading: 'Tattoo Care',
    sub: 'Flaunt your identity with vibrant inks!',
    description: 'Specially formulated products to heal, protect, and maintain your tattoos. Our tattoo care range keeps your body art looking fresh and vibrant for years to come.',
    image: TattooCareSlider,
    cta: 'SHOP NOW',
    targetPage: 'tattoo',
  },
  {
    id: 7,
    type: 'hair-slide',
    heading: 'Hair Care',
    sub: 'Health, Growth & Lustre...assured',
    description: 'Complete hair care solutions for stronger, healthier, more lustrous hair. From root to tip, our formulas work to restore vitality, promote growth, and bring back natural shine.',
    image: HairCareSlider,
    cta: 'SHOP NOW',
    targetPage: 'hair',
  },
]

const categories = [
  { label: 'Face Serums', icon: '✦', page: 'serums' },
  { label: 'Moisturisers', icon: '✦', page: 'moisturisers' },
  { label: 'Face Wash', icon: '✦', page: 'shop' },
  { label: 'Eye Care', icon: '✦', page: 'shop' },
  { label: 'Sunscreen', icon: '✦', page: 'shop' },
  { label: 'Hair Care', icon: '✦', page: 'hair' },
]

/* ─────────────── HERO SLIDER ─────────────── */
/* Full-bleed background-image slides with text overlay (matches aloweda.com reference) */
function HeroSlider({ onNavigate }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef(null)

  const goTo = useCallback((index) => {
    if (animating || index === current) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 800)
  }, [animating, current])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  useEffect(() => {
    timerRef.current = setInterval(next, 6000)
    return () => clearInterval(timerRef.current)
  }, [next])

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 6000)
  }

  const handleShopNowClick = (targetPage) => {
    if (targetPage && onNavigate) onNavigate(targetPage)
  }

  return (
    <section className="hero">
      <div className="hero__track">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero__slide ${i === current ? 'hero__slide--active' : ''} ${slide.type === 'whats-aloweda' ? 'hero__slide--whats-aloweda' : ''} ${slide.type === 'serums-slide' || slide.type === 'facewash-slide' || slide.type === 'creams-slide' || slide.type === 'lips-slide' || slide.type === 'tattoo-slide' || slide.type === 'hair-slide' ? 'hero__slide--serums' : ''}`}
          >
            {slide.type === 'whats-aloweda' ? (
              // What's Aloweda Slide
              <div className="hero__whats-aloweda">
                <div className="hero__whats-aloweda-left">
                  <h1 className="hero__heading">{slide.heading}</h1>
                  <p className="hero__sub">{slide.sub}</p>
                  <p className="hero__description">
                    We blend ancient Ayurvedic wisdom with modern Allopathic science, 
                    safe synthetics, and cutting-edge innovation to create skincare 
                    that truly works. Not just another brand—a complete cuticle care revolution.
                  </p>
                  <button
                    className="btn btn--dark"
                    onClick={() => handleShopNowClick('shop')}
                  >
                    SHOP NOW
                  </button>
                </div>
                <div className="hero__whats-aloweda-right">
                  <div className="hero__graphics-grid">
                    {slide.graphics.map((graphic, idx) => (
                      <div key={idx} className="hero__graphic-item">
                        <div className="hero__graphic-video">
                          <video
                            src={graphic.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        </div>
                        <span className="hero__graphic-label-top">{graphic.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : slide.type === 'serums-slide' || slide.type === 'facewash-slide' || slide.type === 'creams-slide' || slide.type === 'lips-slide' || slide.type === 'tattoo-slide' || slide.type === 'hair-slide' ? (
              // Serums, Face Wash, Creams, Lips, Tattoo, Hair Slides
              <div className="hero__serums">
                <div className="hero__serums-left">
                  <h1 className="hero__heading">{slide.heading}</h1>
                  <p className="hero__sub">{slide.sub}</p>
                  {slide.subLine && <p className="hero__sub-line">{slide.subLine}</p>}
                  <p className="hero__description">{slide.description}</p>
                  <button
                    className="btn btn--dark"
                    onClick={() => handleShopNowClick(slide.targetPage)}
                  >
                    {slide.cta}
                  </button>
                </div>
                <div className="hero__image-container">
                  <div
                    className="hero__bg"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      ...(slide.type === 'tattoo-slide' && {
                        width: '60%',
                        maxWidth: '400px',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        marginLeft: 'auto',
                        marginRight: '40px',
                      })
                    }}
                  />
                </div>
              </div>
            ) : (
              // Regular Product Slides
              <>
                <div className="hero__content">
                  <span className="hero__tag">{slide.tag}</span>
                  <h1 className="hero__heading">{slide.heading}</h1>
                  <p className="hero__sub">{slide.sub}</p>
                  <button
                    className="btn btn--dark"
                    onClick={() => handleShopNowClick(slide.targetPage)}
                  >
                    {slide.cta}
                  </button>
                </div>
                <div className="hero__image-container">
                  <div
                    className="hero__bg"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="hero__arrow hero__arrow--prev"
        onClick={() => { prev(); resetTimer() }}
        aria-label="Previous"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="hero__arrow hero__arrow--next"
        onClick={() => { next(); resetTimer() }}
        aria-label="Next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => { goTo(i); resetTimer() }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
/* ─────────────── MARQUEE STRIP ─────────────── */

function MarqueeStrip() {
  const [isVisible, setIsVisible] = useState(true)
  const items = ['Free Shipping Above ₹999', 'Science-Backed Formulas', 'Clinically Proven Ingredients', 'Suitable for all skin types', 'No Parabens · No Sulphates', 'Made in India ✦']
  
  if (!isVisible) return null
  
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
      <button 
        className="marquee-close" 
        onClick={() => setIsVisible(false)}
        aria-label="Close announcement"
      >
        ✕
      </button>
    </div>
  )
}

/* ─────────────── CATEGORIES ─────────────── */

function Categories({ onNavigate }) {
  const handleCategoryClick = (page) => {
    if (page && onNavigate) {
      onNavigate(page)
    }
  }

  return (
    <section className="section categories-section">
      <div className="section__header">
        <span className="section__eyebrow">Browse</span>
        <h2 className="section__title">Shop by Category</h2>
      </div>
      <div className="categories-grid">
        {categories.map((c) => (
          <button 
            key={c.label} 
            className="category-card"
            onClick={() => handleCategoryClick(c.page)}
          >
            <div className="category-card__icon">{c.icon}</div>
            <span className="category-card__label">{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

/* ─────────────── WHY ALOWEDA ─────────────── */

function WhyAloweda() {
  return (
    <section className="section why-section">
      <div className="container">
        <div className="section__header section__header--center">
          <span className="section__eyebrow">Our Promise</span>
          <h2 className="section__title">Why Aloweda?</h2>
          <p className="section__desc" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Sensible. Simple. Synergy. — That's not just a tagline, it's our formula. 
            We believe skincare should be simple, effective, and backed by science. 
            Our formulations blend proven ingredients with modern research to deliver 
            real, visible results for your skin's unique needs.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─────────────── OUR VALUES ─────────────── */

function OurValues() {
  const values = [
    { icon: '🌿', title: 'Proven Ingredients', desc: 'Evidence-based formulations blended with modern science for real results.' },
    { icon: '🧪', title: 'Suitable for all skin types', desc: 'Every formula is clinically evaluated for safety and efficacy.' },
    { icon: '✓', title: 'Skin Safe', desc: 'Gentle, non-irritating formulas designed to protect and nourish your skin barrier.' },
    { icon: '✦', title: 'No Nasties', desc: 'Zero parabens, sulphates, or artificial fragrances. Ever.' },
    { icon: '📦', title: 'Sustainable Packaging', desc: 'Eco-conscious packaging that doesn\'t cost the planet.' },
  ]
  return (
    <section className="section values-section">
      <div className="container">
        <div className="section__header section__header--center">
          <span className="section__eyebrow">What We Stand For</span>
          <h2 className="section__title">Our Values</h2>
        </div>
        <div className="pillars-grid">
          {values.map((v) => (
            <div key={v.title} className="pillar-card">
              <div className="pillar-card__icon">{v.icon}</div>
              <h3 className="pillar-card__title">{v.title}</h3>
              <p className="pillar-card__desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── ALOWEDA INTRO SECTION ─────────────── */

function AlowedaIntro({ onNavigate }) {
  const fullTitle = "Aloweda: The Skincare Experts"
  const fullDesc = "Aloweda is a 'Cuticle Care' brand which offers a range of scientifically-formulated products for your Skin, Hair, Lips, Tattoos & more. Our formulations use proven ingredients like aloe vera, kokum butter and turmeric with Vitamins & safe Synthetics, aiming to provide effective solutions for various skincare and beauty needs."

  // Check localStorage on mount
  const hasTypedBefore = localStorage.getItem('aloweda_hero_typed') === 'true'
  
  const [titleText, setTitleText] = useState(hasTypedBefore ? fullTitle : '')
  const [descText, setDescText] = useState(hasTypedBefore ? fullDesc : '')
  const [isTypingComplete, setIsTypingComplete] = useState(hasTypedBefore)
  const sectionRef = useRef(null)
  const hasTypedRef = useRef(hasTypedBefore)

  useEffect(() => {
    // If already typed before, don't set up observer
    if (hasTypedBefore) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTypedRef.current) {
            hasTypedRef.current = true
            
            // Type title first
            let titleIndex = 0
            const titleInterval = setInterval(() => {
              if (titleIndex < fullTitle.length) {
                setTitleText(fullTitle.slice(0, titleIndex + 1))
                titleIndex++
              } else {
                clearInterval(titleInterval)
                
                // Then type description
                let descIndex = 0
                const descInterval = setInterval(() => {
                  if (descIndex < fullDesc.length) {
                    setDescText(fullDesc.slice(0, descIndex + 1))
                    descIndex++
                  } else {
                    clearInterval(descInterval)
                    setIsTypingComplete(true)
                    // Save to localStorage after typing completes
                    localStorage.setItem('aloweda_hero_typed', 'true')
                  }
                }, 15)
              }
            }, 50)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [hasTypedBefore, fullTitle, fullDesc])

  return (
    <section ref={sectionRef} className="aloweda-intro">
      <div className="aloweda-intro__container">
        <h2 className={`aloweda-intro__title ${!isTypingComplete && titleText ? 'typing' : ''}`}>
          {titleText}
        </h2>
        <p className={`aloweda-intro__description ${!isTypingComplete && descText ? 'typing' : ''}`}>
          {descText}
        </p>
        {isTypingComplete && (
          <button 
            className="aloweda-intro__btn"
            onClick={() => onNavigate('shop')}
          >
            SHOP NOW
          </button>
        )}
      </div>
    </section>
  )
}

/* ─────────────── LOOK BOOK SLIDER ─────────────── */

function LookBookSlider({ onNavigate, onAddToCart, allProducts, cart = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const lookBookSlides = [
    {
      id: 1,
      background: SmartSkinCareLookBook,
      category: 'Smart Skincare',
      products: [
        { id: 1, img: SC1, name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', price: '₹ 799' },
        { id: 2, img: SC2, name: 'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream+ Complexion Cream + Smooth Perfection Serum', price: '₹ 1,299' },
        { id: 3, img: SC3, name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', price: '₹ 999' },
      ]
    },
    {
      id: 2,
      background: FaceWashBG,
      category: 'Face Wash',
      products: [
        { id: 10, img: SC10, name: 'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin & Niacinamide: Wrinkles & Lines Cream 50 G', price: '₹ 449' },
        { id: 11, img: SC11, name: 'Encapsulated Retinol 1.9%, Grape Seed Extract, & Ceramides : Lines & Wrinkles Serum 30 ml', price: '₹ 499' },
        { id: 17, img: LC2, name: 'Lip Butter 15 Gram: Butters, Oils & Honey. NO CHEMICALS, NO PRESERVATIVES. NOT LIP BALM', price: 'From ₹ 165' },
      ]
    },
    {
      id: 3,
      background: HairCareLookBook,
      category: 'Hair Care',
      products: [
        { id: 16, img: HairCareImg, name: 'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', price: '₹ 575' },
        { id: 1, img: SC1, name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', price: '₹ 799' },
        { id: 3, img: SC3, name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', price: '₹ 999' },
      ]
    },
    {
      id: 4,
      background: LipCareLookBook,
      category: 'Brightening & Glow',
      products: [
        { id: 14, img: SC14, name: 'Vitamin C 20%, Kojic Acid, Avocado Extract & Argan Oil : Radiance Cream 50 G', price: 'Rs. 499.00' },
        { id: 8,  img: SC8,  name: 'Vitamin C 15%, Niacinamide 5%, Hyaluronic Acid & Ferulic Acid 1% Serum 30 ml for Super Glow', price: 'Rs. 649.00' },
        { id: 3,  img: SC3,  name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', price: 'Rs. 1,149.00' },
      ]
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % lookBookSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + lookBookSlides.length) % lookBookSlides.length)
  }

  const currentData = lookBookSlides[currentSlide]

  // Function to handle add to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    if (onAddToCart && allProducts) {
      const fullProduct = allProducts.find(p => p.id === product.id)
      if (fullProduct) {
        onAddToCart(fullProduct, 1)
      }
    }
  }

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId)
  }

  return (
    <section className="lookbook-section">
      <div className="lookbook-container">
        {/* Left side - Background image with slider */}
        <div className="lookbook-left">
          <div className="lookbook-bg" style={{ backgroundImage: `url(${currentData.background})` }}>
            <div className="lookbook-overlay" />
            <div className="lookbook-category">{currentData.category}</div>
          </div>
          
          {/* Slider arrows */}
          <button className="lookbook-arrow lookbook-arrow--prev" onClick={prevSlide} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="lookbook-arrow lookbook-arrow--next" onClick={nextSlide} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Right side - Products list */}
        <div className="lookbook-right">
          <h2 className="lookbook-title">Previously Ordered</h2>
          <div className="lookbook-products">
            {currentData.products.map((product) => (
              <div 
                key={product.id} 
                className="lookbook-product"
              >
                <div 
                  className="lookbook-product__img" 
                  onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: product.id })}
                  onAuxClick={(e) => e.button === 1 && handleNavigation(e, onNavigate, 'product', { productId: product.id })}
                >
                  <img src={product.img} alt={product.name} />
                </div>
                <div className="lookbook-product__info">
                  <h3 
                    className="lookbook-product__name" 
                    onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: product.id })}
                    onAuxClick={(e) => e.button === 1 && handleNavigation(e, onNavigate, 'product', { productId: product.id })}
                  >{product.name}</h3>
                  <div className="lookbook-product__footer">
                    <p className="lookbook-product__price">{product.price}</p>
                    <button 
                      className="btn btn--outline-dark btn--sm" 
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      Buy Again
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────── TESTIMONIALS ─────────────── */

function Testimonials() {
  const reviews = [
    { name: 'Priya S.', loc: 'Mumbai', text: 'My skin has never felt this balanced. The Glow Serum is genuinely life-changing.', stars: 5 },
    { name: 'Arjun M.', loc: 'Delhi', text: 'I was sceptical at first but three weeks in — my pigmentation has visibly reduced.', stars: 5 },
    { name: 'Sneha R.', loc: 'Bangalore', text: 'Clean ingredients, beautiful packaging, and the results speak for themselves.', stars: 5 },
  ]
  return (
    <section className="section testimonials-section">
      <div className="section__header">
        <span className="section__eyebrow">Reviews</span>
        <h2 className="section__title">What People Say</h2>
      </div>
      <div className="testimonials-grid">
        {reviews.map((r) => (
          <div key={r.name} className="testimonial-card">
            <div className="testimonial-card__stars">{'★'.repeat(r.stars)}</div>
            <p className="testimonial-card__text">"{r.text}"</p>
            <div className="testimonial-card__author">
              <span className="testimonial-card__name">{r.name}</span>
              <span className="testimonial-card__loc">{r.loc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────── ROOT ─────────────── */

export default function HomePage({ onNavigate, onLoginClick, cartCount, onAddToCart, allProducts, cart = [] }) {
  return (
    <div className="page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />
      <main>
        <HeroSlider onNavigate={onNavigate} />
        <MarqueeStrip />
        <BestSellers onNavigate={onNavigate} onAddToCart={onAddToCart} allProducts={allProducts} />
        <BuildRegimenCTA onNavigate={onNavigate} />
        <ImageCarousel />
        <LookBookSlider onNavigate={onNavigate} onAddToCart={onAddToCart} allProducts={allProducts} cart={cart} />
        <AlowedaIntro onNavigate={onNavigate} />
        <Categories onNavigate={onNavigate} />
        <WhyAloweda />
        <OurValues />
        <Testimonials />
      </main>
      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}