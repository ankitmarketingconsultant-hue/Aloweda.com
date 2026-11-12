import { useState, useEffect } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import { concernToProducts, bundleToProducts, skinTypeToProducts, hairConcernToProducts, lipConcernToProducts, productDatabase } from '../data/productRecommendations'
import { skinConcerns, bundles, skinTypes, hairConcerns, lipConcerns } from '../data/regimenOptions'
import './RecommendationResults.css'

export default function RecommendationResults({ formData, onNavigate, onAddToCart }) {
  const [recommendations, setRecommendations] = useState({ morning: [], evening: [], optional: [], lip: [], tattoo: [] })
  const [success, setSuccess] = useState(false)
  const [addedProducts, setAddedProducts] = useState(new Set())

  useEffect(() => {
    calculateRecommendations()
    // Simulate submission
    setTimeout(() => setSuccess(true), 500)
  }, [])

  const calculateRecommendations = () => {
    const productScores = {}

    // Score products based on concerns
    formData.skinConcerns.forEach(concern => {
      const products = concernToProducts[concern] || []
      products.forEach(productId => {
        productScores[productId] = (productScores[productId] || 0) + 3
      })
    })

    // Score products based on bundle
    if (formData.bundle) {
      const products = bundleToProducts[formData.bundle] || []
      products.forEach(productId => {
        productScores[productId] = (productScores[productId] || 0) + 2
      })
    }

    // Score products based on skin type
    if (formData.skinType && formData.skinType !== 'notsure') {
      const products = skinTypeToProducts[formData.skinType] || []
      products.forEach(productId => {
        productScores[productId] = (productScores[productId] || 0) + 2
      })
    }

    // Score products based on hair concerns
    if (formData.hairConcerns && formData.hairConcerns.length > 0) {
      formData.hairConcerns.forEach(concern => {
        const products = hairConcernToProducts[concern] || []
        products.forEach(productId => {
          productScores[productId] = (productScores[productId] || 0) + 3
        })
      })
    }

    // Score products based on lip concerns
    if (formData.lipConcerns && formData.lipConcerns.length > 0) {
      formData.lipConcerns.forEach(concern => {
        const products = lipConcernToProducts[concern] || []
        products.forEach(productId => {
          productScores[productId] = (productScores[productId] || 0) + 3
        })
      })
    }

    // Score products based on tattoo concerns — only tattoo products
    if (formData.tattooConcerns && formData.tattooConcerns.length > 0) {
      // Always ensure tattoo products are scored if tattoo concerns selected
      ;['tattoo-cleanser', 'tattoo-butter'].forEach(id => {
        productScores[id] = (productScores[id] || 0) + 5
      })
    }

    // Always ensure lip-butter is scored if lip concerns selected
    if (formData.lipConcerns && formData.lipConcerns.length > 0 && formData.lipConcerns[0] !== 'none') {
      productScores['lip-butter'] = (productScores['lip-butter'] || 0) + 5
    }

    // Sort by score and categorize
    const sortedProducts = Object.entries(productScores)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => {
        const recProduct = productDatabase[id]
        if (!recProduct) return null
        // Use productDatabase data directly — do NOT merge with PRODUCTS
        // as PRODUCTS array uses different IDs
        return recProduct
      })
      .filter(Boolean)

    const morning  = sortedProducts.filter(p => p.routine === 'morning').slice(0, 3)
    const evening  = sortedProducts.filter(p => p.routine === 'evening').slice(0, 3)
    const optional = sortedProducts.filter(p => p.routine === 'optional').slice(0, 2)

    // Always include lip-butter if user selected any lip concerns
    const lip = (formData.lipConcerns && formData.lipConcerns.length > 0 && formData.lipConcerns[0] !== 'none')
      ? sortedProducts.filter(p => p.routine === 'special')
      : []

    // Always include tattoo products if user selected any tattoo concerns
    const tattoo = (formData.tattooConcerns && formData.tattooConcerns.length > 0 && formData.tattooConcerns[0] !== 'none')
      ? sortedProducts.filter(p => p.routine === 'tattoo')
      : []

    setRecommendations({ morning, evening, optional, lip, tattoo })
  }

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product)
      setAddedProducts(prev => new Set([...prev, product.id]))
      setTimeout(() => {
        setAddedProducts(prev => {
          const newSet = new Set(prev)
          newSet.delete(product.id)
          return newSet
        })
      }, 2000)
    }
  }

  const getSelectedConcernLabels = () => {
    return formData.skinConcerns
      .map(id => skinConcerns.find(c => c.id === id)?.label)
      .filter(Boolean)
      .join(', ')
  }

  const getSelectedBundleLabel = () => {
    return bundles.find(b => b.id === formData.bundle)?.label || ''
  }

  const getSelectedSkinTypeLabel = () => {
    return skinTypes.find(t => t.id === formData.skinType)?.label || ''
  }

  const getSelectedHairConcernLabels = () => {
    if (!formData.hairConcerns || formData.hairConcerns.length === 0) return 'None selected'
    return formData.hairConcerns
      .map(id => hairConcerns.find(c => c.id === id)?.label)
      .filter(Boolean)
      .join(', ')
  }

  const getSelectedLipConcernLabels = () => {
    if (!formData.lipConcerns || formData.lipConcerns.length === 0) return 'None selected'
    return formData.lipConcerns
      .map(id => lipConcerns.find(c => c.id === id)?.label)
      .filter(Boolean)
      .join(', ')
  }

  if (success) {
    return (
      <div className="results-page">
        <Navbar onNavigate={onNavigate} />
        <div className="results-container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h1>Thank You!</h1>
            <p>Your skincare consultation request has been submitted successfully. Our team will review your details and get back to you.</p>
          </div>

          <div className="results-content">
            <h2 className="results-heading">Your Personalized Skincare Regimen</h2>

            <div className="results-summary">
              <div className="summary-item">
                <h3>Skin Concerns</h3>
                <p>{getSelectedConcernLabels()}</p>
              </div>
              <div className="summary-item">
                <h3>Selected Bundle</h3>
                <p>{getSelectedBundleLabel()}</p>
              </div>
              <div className="summary-item">
                <h3>Skin Type</h3>
                <p>{getSelectedSkinTypeLabel()}</p>
              </div>
              <div className="summary-item">
                <h3>Hair Concerns</h3>
                <p>{getSelectedHairConcernLabels()}</p>
              </div>
              <div className="summary-item">
                <h3>Lip Concerns</h3>
                <p>{getSelectedLipConcernLabels()}</p>
              </div>
            </div>

            {recommendations.morning.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Morning Routine</h3>
                <div className="product-grid">
                  {recommendations.morning.map((product, idx) => (
                    <div key={idx} className="product-rec-card">
                      <div className="product-number">{idx + 1}</div>
                      {product.img && (
                        <img src={product.img} alt={product.name} className="product-rec-image" />
                      )}
                      <h4>{product.name}</h4>
                      <p className="product-size">{product.size}</p>
                      <p className="product-purpose">{product.purpose}</p>
                      <p className="product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
                      {product.price && (
                        <div className="product-price-section">
                          <div className="product-pricing">
                            <span className="product-price">₹{product.price}</span>
                            {product.mrp && <span className="product-mrp">₹{product.mrp}</span>}
                          </div>
                          <button 
                            className={`add-to-cart-btn ${addedProducts.has(product.id) ? 'added' : ''}`}
                            onClick={() => handleAddToCart(product)}
                            disabled={addedProducts.has(product.id)}
                          >
                            {addedProducts.has(product.id) ? (
                              <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Added
                              </>
                            ) : (
                              <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                  <line x1="3" y1="6" x2="21" y2="6"></line>
                                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.evening.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Evening Routine</h3>
                <div className="product-grid">
                  {recommendations.evening.map((product, idx) => (
                    <div key={idx} className="product-rec-card">
                      <div className="product-number">{idx + 1}</div>
                      {product.img && (
                        <img src={product.img} alt={product.name} className="product-rec-image" />
                      )}
                      <h4>{product.name}</h4>
                      <p className="product-size">{product.size}</p>
                      <p className="product-purpose">{product.purpose}</p>
                      <p className="product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
                      {product.price && (
                        <div className="product-price-section">
                          <div className="product-pricing">
                            <span className="product-price">₹{product.price}</span>
                            {product.mrp && <span className="product-mrp">₹{product.mrp}</span>}
                          </div>
                          <button 
                            className={`add-to-cart-btn ${addedProducts.has(product.id) ? 'added' : ''}`}
                            onClick={() => handleAddToCart(product)}
                            disabled={addedProducts.has(product.id)}
                          >
                            {addedProducts.has(product.id) ? (
                              <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Added
                              </>
                            ) : (
                              <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                  <line x1="3" y1="6" x2="21" y2="6"></line>
                                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.optional.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Optional / As Needed</h3>
                <div className="product-grid">
                  {recommendations.optional.map((product, idx) => (
                    <div key={idx} className="product-rec-card">
                      {product.img && (
                        <img src={product.img} alt={product.name} className="product-rec-image" />
                      )}
                      <h4>{product.name}</h4>
                      <p className="product-size">{product.size}</p>
                      <p className="product-purpose">{product.purpose}</p>
                      <p className="product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
                      {product.price && (
                        <div className="product-price-section">
                          <div className="product-pricing">
                            <span className="product-price">₹{product.price}</span>
                            {product.mrp && <span className="product-mrp">₹{product.mrp}</span>}
                          </div>
                          <button 
                            className={`add-to-cart-btn ${addedProducts.has(product.id) ? 'added' : ''}`}
                            onClick={() => handleAddToCart(product)}
                            disabled={addedProducts.has(product.id)}
                          >
                            {addedProducts.has(product.id) ? (
                              <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Added
                              </>
                            ) : (
                              <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                  <line x1="3" y1="6" x2="21" y2="6"></line>
                                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.lip.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Lip Care</h3>
                <div className="product-grid">
                  {recommendations.lip.map((product, idx) => (
                    <div key={idx} className="product-rec-card">
                      <div className="product-number">{idx + 1}</div>
                      {product.img && <img src={product.img} alt={product.name} className="product-rec-image" />}
                      <h4>{product.name}</h4>
                      <p className="product-size">{product.size}</p>
                      <p className="product-purpose">{product.purpose}</p>
                      <p className="product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
                      {product.price && (
                        <div className="product-price-section">
                          <div className="product-pricing">
                            <span className="product-price">₹{product.price}</span>
                            {product.mrp && <span className="product-mrp">₹{product.mrp}</span>}
                          </div>
                          <button className={`add-to-cart-btn ${addedProducts.has(product.id) ? 'added' : ''}`} onClick={() => handleAddToCart(product)} disabled={addedProducts.has(product.id)}>
                            {addedProducts.has(product.id) ? (<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>Added</>) : (<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>Add to Cart</>)}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.tattoo.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Tattoo Care</h3>
                <div className="product-grid">
                  {recommendations.tattoo.map((product, idx) => (
                    <div key={idx} className="product-rec-card">
                      <div className="product-number">{idx + 1}</div>
                      {product.img && <img src={product.img} alt={product.name} className="product-rec-image" />}
                      <h4>{product.name}</h4>
                      <p className="product-size">{product.size}</p>
                      <p className="product-purpose">{product.purpose}</p>
                      <p className="product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
                      {product.price && (
                        <div className="product-price-section">
                          <div className="product-pricing">
                            <span className="product-price">₹{product.price}</span>
                            {product.mrp && <span className="product-mrp">₹{product.mrp}</span>}
                          </div>
                          <button className={`add-to-cart-btn ${addedProducts.has(product.id) ? 'added' : ''}`} onClick={() => handleAddToCart(product)} disabled={addedProducts.has(product.id)}>
                            {addedProducts.has(product.id) ? (<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>Added</>) : (<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>Add to Cart</>)}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="results-disclaimer">
              <p><strong>Disclaimer:</strong> These are product suggestions based on your selected concerns. This is not a medical diagnosis. For specific skin, hair, or lip conditions, please consult a dermatologist or healthcare professional.</p>
            </div>

            <button className="results-btn" onClick={() => onNavigate('home')}>
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return <div className="loading">Processing your regimen...</div>
}
