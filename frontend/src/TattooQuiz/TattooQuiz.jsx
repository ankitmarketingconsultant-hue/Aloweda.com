import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import TattooCleanser from '../assets/TattooCleanser.png'
import TattooButter from '../assets/TattooButter.png'
import useSEO from '../utils/useSEO'
import './TattooQuiz.css'

// ── SVG Icons ────────────────────────────────────────────────────────────────
const IconFadingInk = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ink drop with dashed outline = fading */}
    <path d="M18 4C18 4 10 13 10 20a8 8 0 0 0 16 0C26 13 18 4 18 4Z" stroke="#2b2620" strokeWidth="2" strokeLinejoin="round" fill="#d4c9bc" />
    <path d="M14 22c0 2.2 1.8 4 4 4" stroke="#2b2620" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
    {/* Fade lines */}
    <line x1="6" y1="10" x2="3" y2="10" stroke="#2b2620" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    <line x1="6" y1="14" x2="2" y2="14" stroke="#2b2620" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    <line x1="6" y1="18" x2="3" y2="18" stroke="#2b2620" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
  </svg>
)

const IconItching = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Skin layer */}
    <rect x="6" y="20" width="24" height="10" rx="3" fill="#e8ddd4" stroke="#2b2620" strokeWidth="1.8"/>
    {/* Scratch lines */}
    <path d="M11 20 C11 14 14 12 14 16" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 20 C18 13 21 11 21 16" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
    <path d="M25 20 C25 14 28 12 28 16" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
    {/* Red dots = irritation */}
    <circle cx="13" cy="17" r="1.5" fill="#e74c3c"/>
    <circle cx="20" cy="16" r="1.5" fill="#e74c3c"/>
    <circle cx="27" cy="17" r="1.5" fill="#e74c3c"/>
  </svg>
)

const IconDryness = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Skin with cracks = dryness */}
    <rect x="5" y="12" width="26" height="16" rx="4" fill="#e8ddd4" stroke="#2b2620" strokeWidth="1.8"/>
    {/* Crack lines */}
    <path d="M12 16 L15 20 L13 24" stroke="#a0856e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14 L22 18 L20 22 L23 26" stroke="#a0856e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Peeling flakes */}
    <path d="M25 14 Q28 12 27 16" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M8 20 Q5 18 7 22" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
)

const IconNotHealing = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bandage cross */}
    <rect x="5" y="14" width="26" height="8" rx="4" fill="#f5f0ea" stroke="#2b2620" strokeWidth="1.8"/>
    <rect x="14" y="5" width="8" height="26" rx="4" fill="#f5f0ea" stroke="#2b2620" strokeWidth="1.8"/>
    {/* Center square */}
    <rect x="14" y="14" width="8" height="8" rx="1" fill="#fff" stroke="#2b2620" strokeWidth="1.5"/>
    {/* Dots on bandage */}
    <circle cx="9" cy="18" r="1.2" fill="#ddd"/>
    <circle cx="27" cy="18" r="1.2" fill="#ddd"/>
    <circle cx="18" cy="9" r="1.2" fill="#ddd"/>
    <circle cx="18" cy="27" r="1.2" fill="#ddd"/>
    {/* Warning pulse */}
    <circle cx="29" cy="8" r="4" fill="#e74c3c" opacity="0.9"/>
    <text x="29" y="11.5" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">!</text>
  </svg>
)

const IconColorsFading = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ink needle / tattoo gun tip */}
    <path d="M8 28 L20 10 L24 14 L12 32 Z" fill="#3d3028" stroke="#2b2620" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="20" y="6" width="10" height="6" rx="2" fill="#5a4a3a" stroke="#2b2620" strokeWidth="1.5"/>
    {/* Colour dots fading (left to right = vivid to pale) */}
    <circle cx="14" cy="20" r="3" fill="#e74c3c"/>
    <circle cx="21" cy="14" r="3" fill="#e67e22" opacity="0.7"/>
    {/* Faded ghost circles */}
    <circle cx="27" cy="22" r="3" fill="none" stroke="#e74c3c" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5"/>
    <circle cx="10" cy="26" r="2.5" fill="none" stroke="#3498db" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.4"/>
  </svg>
)

// ── Concern definitions ──────────────────────────────────────────────────────
const TATTOO_CONCERNS = [
  {
    id: 'fadingink',
    label: 'Fading Ink',
    Icon: IconFadingInk,
    tip: 'Ink looks dull or washed-out over time'
  },
  {
    id: 'itching',
    label: 'Itching & Irritation',
    Icon: IconItching,
    tip: 'Skin feels itchy or inflamed around the tattoo'
  },
  {
    id: 'dryness',
    label: 'Dryness & Peeling',
    Icon: IconDryness,
    tip: 'Skin feels tight, flaky or peeling over the tattoo'
  },
  {
    id: 'notHealing',
    label: 'Not Healing Properly',
    Icon: IconNotHealing,
    tip: 'Fresh tattoo taking too long to recover'
  },
  {
    id: 'colorsFading',
    label: 'Colours Are Fading',
    Icon: IconColorsFading,
    tip: 'Coloured ink losing vibrancy and brightness'
  }
]

// ── Product recommendation logic ─────────────────────────────────────────────
const CONCERN_TO_PRODUCTS = {
  fadingink:    ['tattoo-cleanser', 'tattoo-butter'],
  itching:      ['tattoo-cleanser', 'tattoo-butter'],
  dryness:      ['tattoo-butter', 'tattoo-cleanser'],
  notHealing:   ['tattoo-cleanser', 'tattoo-butter'],
  colorsFading: ['tattoo-butter', 'tattoo-cleanser']
}

const PRODUCT_DATA = {
  'tattoo-cleanser': {
    id: 19,
    slug: 'tattoo-cleanser',
    name: 'Tattoo Cleanser',
    subtitle: '100 ml',
    price: 'Rs. 299.00',
    mrp: 'Rs. 349.00',
    img: TattooCleanser,
    keyBenefit: 'Gently cleanses tattooed skin without stripping moisture',
    ingredients: 'Orange, Lemon & Tangerine Extracts, Aloe Vera, Vitamin E',
    howToUse: 'Apply a small amount to wet skin, massage gently, rinse. Use once or twice daily.',
    tag: 'Sulphate-Free'
  },
  'tattoo-butter': {
    id: 20,
    slug: 'tattoo-butter',
    name: 'Tattoo Butter',
    subtitle: '50 Grams',
    price: 'Rs. 799.00',
    mrp: 'Rs. 899.00',
    img: TattooButter,
    keyBenefit: 'Nourishes tattooed skin & preserves ink vibrancy',
    ingredients: 'Shea, Cocoa, Mango & Kokum Butter, Beeswax, Fig Honey',
    howToUse: 'Spread a thin layer on your tattoo. Do not massage. Apply twice daily.',
    tag: 'No Chemicals'
  }
}

// Score products from selected concerns, return sorted unique list
function getRecommendations(selectedConcerns) {
  const scores = {}
  selectedConcerns.forEach(concern => {
    const products = CONCERN_TO_PRODUCTS[concern] || []
    products.forEach((slug, index) => {
      // First product in list gets higher weight
      scores[slug] = (scores[slug] || 0) + (index === 0 ? 3 : 2)
    })
  })

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([slug]) => PRODUCT_DATA[slug])
    .filter(Boolean)
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ConcernCard({ concern, selected, onToggle }) {
  const { Icon } = concern
  return (
    <button
      className={`tq-concern-card ${selected ? 'tq-concern-card--selected' : ''}`}
      onClick={() => onToggle(concern.id)}
      aria-pressed={selected}
    >
      <span className="tq-concern-icon"><Icon /></span>
      <span className="tq-concern-label">{concern.label}</span>
      <span className="tq-concern-tip">{concern.tip}</span>
      {selected && <span className="tq-concern-check">✓</span>}
    </button>
  )
}

function ProductCard({ product, onAddToCart, added }) {
  return (
    <div className="tq-product-card">
      {product.tag && <span className="tq-product-tag">{product.tag}</span>}
      <Link to={`/product/${product.id}`} className="tq-product-img-wrap">
        <img src={product.img} alt={product.name} className="tq-product-img" loading="lazy" decoding="async" />
      </Link>
      <div className="tq-product-body">
        <h3 className="tq-product-name">{product.name}</h3>
        <p className="tq-product-subtitle">{product.subtitle}</p>
        <p className="tq-product-benefit">{product.keyBenefit}</p>
        <p className="tq-product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
        <p className="tq-product-how"><strong>How to Use:</strong> {product.howToUse}</p>
        <div className="tq-product-pricing">
          <span className="tq-product-price">{product.price}</span>
          {product.mrp && <span className="tq-product-mrp">{product.mrp}</span>}
        </div>
        <div className="tq-product-actions">
          <button
            className={`tq-btn-cart ${added ? 'tq-btn-cart--added' : ''}`}
            onClick={() => onAddToCart(product)}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
          <Link to={`/product/${product.id}`} className="tq-btn-view">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TattooQuiz({ onNavigate, onLoginClick, cartCount, onAddToCart }) {
  useSEO({
    title: 'Tattoo Care Quiz | Find Your Tattoo Products | Aloweda',
    description: 'Take the Aloweda tattoo care quiz to find the right cleanser and butter for your tattoo. Natural, chemical-free tattoo aftercare products.',
    canonical: '/tattoo-quiz',
  })
  const [step, setStep] = useState('quiz') // 'quiz' | 'results'
  const [selected, setSelected] = useState([])
  const [addedProducts, setAddedProducts] = useState(new Set())

  const toggleConcern = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (selected.length === 0) return
    setStep('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setSelected([])
    setStep('quiz')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product)
      setAddedProducts(prev => new Set([...prev, product.id]))
      setTimeout(() => {
        setAddedProducts(prev => {
          const next = new Set(prev)
          next.delete(product.id)
          return next
        })
      }, 2500)
    }
  }

  const recommendations = step === 'results' ? getRecommendations(selected) : []
  const selectedLabels = selected
    .map(id => TATTOO_CONCERNS.find(c => c.id === id)?.label)
    .filter(Boolean)

  return (
    <div className="tq-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* Hero Banner */}
      <section className="tq-hero">
        <div className="tq-hero-inner">
          <span className="tq-hero-eyebrow">Tattoo Care Quiz</span>
          <h1 className="tq-hero-title">Find the Right Care<br />for Your Ink</h1>
          <p className="tq-hero-subtitle">
            Answer a few quick questions and we'll recommend the best products
            to keep your tattoo vibrant, healthy and well-nourished.
          </p>
        </div>
      </section>

      <main className="tq-main">

        {/* ── QUIZ STEP ── */}
        {step === 'quiz' && (
          <div className="tq-quiz-section">
            <div className="tq-quiz-header">
              <h2 className="tq-section-title">What's bothering your tattoo?</h2>
              <p className="tq-section-sub">Select all that apply — we'll match the best products for you</p>
            </div>

            <div className="tq-concerns-grid">
              {TATTOO_CONCERNS.map(concern => (
                <ConcernCard
                  key={concern.id}
                  concern={concern}
                  selected={selected.includes(concern.id)}
                  onToggle={toggleConcern}
                />
              ))}
            </div>

            {selected.length > 0 && (
              <div className="tq-selected-summary">
                <span className="tq-selected-label">Selected:</span>
                {selectedLabels.map(label => (
                  <span key={label} className="tq-selected-chip">{label}</span>
                ))}
              </div>
            )}

            <div className="tq-quiz-footer">
              <button
                className="tq-btn-primary"
                onClick={handleSubmit}
                disabled={selected.length === 0}
              >
                {selected.length === 0
                  ? 'Select at least one concern'
                  : 'See My Recommendations →'}
              </button>
            </div>
          </div>
        )}

        {/* ── RESULTS STEP ── */}
        {step === 'results' && (
          <div className="tq-results-section">

            {/* Result intro */}
            <div className="tq-results-header">
              <div className="tq-results-check">✓</div>
              <h2 className="tq-results-title">Your Tattoo Care Routine</h2>
              <p className="tq-results-subtitle">
                Based on your concerns, here's what we recommend
              </p>
              <div className="tq-results-concerns">
                {selectedLabels.map(label => (
                  <span key={label} className="tq-selected-chip">{label}</span>
                ))}
              </div>
            </div>

            {/* Why these products */}
            <div className="tq-why-box">
              <h3 className="tq-why-title">Why This Routine Works</h3>
              <p className="tq-why-text">
                Tattooed skin needs specialised, chemical-free care. The <strong>Tattoo Cleanser</strong> gently
                removes impurities without disrupting the ink, while the <strong>Tattoo Butter</strong> deeply
                nourishes and locks in moisture to keep colours vibrant and skin healthy.
                Together they form the complete tattoo aftercare routine.
              </p>
            </div>

            {/* Product cards */}
            {recommendations.length > 0 ? (
              <div className="tq-products-grid">
                {recommendations.map(product => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    onAddToCart={handleAddToCart}
                    added={addedProducts.has(product.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="tq-no-results">No products found. Please try again.</p>
            )}

            {/* Usage guide */}
            <div className="tq-usage-guide">
              <h3 className="tq-usage-title">How to Use Together</h3>
              <div className="tq-usage-steps">
                <div className="tq-usage-step">
                  <span className="tq-step-num">1</span>
                  <div>
                    <strong>Cleanse</strong>
                    <p>Apply Tattoo Cleanser to wet skin, massage gently in circular motions, rinse thoroughly. Use once or twice a day.</p>
                  </div>
                </div>
                <div className="tq-usage-step">
                  <span className="tq-step-num">2</span>
                  <div>
                    <strong>Moisturise</strong>
                    <p>Pat skin dry, then spread a thin layer of Tattoo Butter over the tattoo. Do NOT massage — let it absorb naturally. Apply twice daily.</p>
                  </div>
                </div>
                <div className="tq-usage-step">
                  <span className="tq-step-num">3</span>
                  <div>
                    <strong>Overnight Boost</strong>
                    <p>Apply a thicker layer of Tattoo Butter before bed for deep overnight nourishment and faster healing.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Retake / Shop all */}
            <div className="tq-results-actions">
              <button className="tq-btn-secondary" onClick={handleReset}>
                ← Retake Quiz
              </button>
              <Link to="/tattoo" className="tq-btn-outline">
                Shop All Tattoo Care
              </Link>
            </div>

          </div>
        )}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
