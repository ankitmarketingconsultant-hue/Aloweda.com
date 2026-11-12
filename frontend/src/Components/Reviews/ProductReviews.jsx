import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="rv-star-picker" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`rv-star-btn ${n <= (hovered || value) ? 'rv-star-btn--active' : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} star`}
        >★</button>
      ))}
    </div>
  )
}

function ReviewStars({ rating }) {
  return (
    <span className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= rating ? 'rv-star--filled' : 'rv-star--empty'}>★</span>
      ))}
    </span>
  )
}

/**
 * ProductReviews — shows reviews for ONE specific product.
 *
 * Reviews are fetched from the backend filtered by `productId`, so every
 * product displays only its own reviews (never a shared/generic set).
 * Submitting a review tags it with the same `productId`.
 *
 * Styling is provided by ProductDetail.css (.rv-* and .review-* classes),
 * which is loaded wherever this component is rendered inside the product page.
 */
export default function ProductReviews({ productId, productName, onLoginClick }) {
  const [reviews, setReviews] = useState([])
  const [ratingSummary, setRatingSummary] = useState(null)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', comment: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)

  const isLoggedIn = !!localStorage.getItem('token')

  // Fetch reviews for THIS product only whenever the product changes
  useEffect(() => {
    if (productId === undefined || productId === null) return
    setReviews([])
    setRatingSummary(null)
    setReviewsLoading(true)
    setReviewSuccess(false)
    setShowReviewForm(false)
    fetch(`${API_BASE}/api/reviews/product/${productId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setReviews(data.data || [])
          setRatingSummary(data.ratingSummary || null)
        }
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false))
  }, [productId])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewForm.rating) return setReviewError('Please select a star rating.')
    if (!reviewForm.title.trim()) return setReviewError('Please add a short title.')
    if (!reviewForm.comment.trim()) return setReviewError('Please write your review.')
    setReviewError('')
    setReviewSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: String(productId),
          rating: reviewForm.rating,
          title: reviewForm.title.trim(),
          comment: reviewForm.comment.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setReviewSuccess(true)
        setReviewForm({ rating: 0, title: '', comment: '' })
        setShowReviewForm(false)
      } else {
        setReviewError(data.message || 'Could not submit review. Please try again.')
      }
    } catch {
      setReviewError('Network error. Please check your connection.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  return (
    <div className="product-reviews">
      <div className="product-reviews__container">

        {/* Header row */}
        <div className="rv-header">
          <h2 className="reviews-title">Customer Reviews</h2>
          {!showReviewForm && !reviewSuccess && (
            isLoggedIn
              ? <button className="rv-write-btn" onClick={() => { setShowReviewForm(true); setReviewError('') }}>
                  ✏️ Write a Review
                </button>
              : <button className="rv-write-btn rv-write-btn--login" onClick={onLoginClick}>
                  Login to Write a Review
                </button>
          )}
        </div>

        {/* Rating summary bar */}
        {ratingSummary && ratingSummary.totalReviews > 0 && (
          <div className="rv-summary">
            <div className="rv-summary__avg">
              <span className="rv-avg-score">{ratingSummary.averageRating.toFixed(1)}</span>
              <ReviewStars rating={Math.round(ratingSummary.averageRating)} />
              <span className="rv-avg-count">{ratingSummary.totalReviews} review{ratingSummary.totalReviews !== 1 ? 's' : ''}</span>
            </div>
            <div className="rv-summary__bars">
              {[5, 4, 3, 2, 1].map(star => {
                const count = ratingSummary[`${['one', 'two', 'three', 'four', 'five'][star - 1]}StarCount`] || 0
                const pct = ratingSummary.totalReviews ? Math.round((count / ratingSummary.totalReviews) * 100) : 0
                return (
                  <div key={star} className="rv-bar-row">
                    <span className="rv-bar-label">{star}★</span>
                    <div className="rv-bar-track"><div className="rv-bar-fill" style={{ width: `${pct}%` }} /></div>
                    <span className="rv-bar-pct">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Post-submit success */}
        {reviewSuccess && (
          <div className="rv-success-msg">
            ✅ Thank you! Your review has been submitted and will be visible after admin approval.
          </div>
        )}

        {/* Write a Review form */}
        {showReviewForm && (
          <form className="rv-form" onSubmit={handleReviewSubmit}>
            <h3 className="rv-form-title">Write a Review{productName ? ` — ${productName}` : ''}</h3>
            <div className="rv-form-field">
              <label className="rv-form-label">Your Rating *</label>
              <StarPicker value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
            </div>
            <div className="rv-form-field">
              <label className="rv-form-label">Review Title *</label>
              <input className="rv-form-input" type="text" maxLength={100}
                placeholder="Summarise your experience"
                value={reviewForm.title}
                onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="rv-form-field">
              <label className="rv-form-label">Your Review *</label>
              <textarea className="rv-form-textarea" rows={4} maxLength={1000}
                placeholder="Tell others about your experience with this product…"
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
            </div>
            {reviewError && <p className="rv-form-error">{reviewError}</p>}
            <div className="rv-form-actions">
              <button type="submit" className="rv-submit-btn" disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
              </button>
              <button type="button" className="rv-cancel-btn"
                onClick={() => { setShowReviewForm(false); setReviewError('') }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews list — only reviews for this product */}
        {reviewsLoading ? (
          <p className="rv-loading">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="rv-empty">No reviews yet for this product. Be the first to share your experience!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map((r) => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  <ReviewStars rating={r.rating} />
                  <span className="review-date">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {r.title && <p className="rv-review-title">{r.title}</p>}
                <p className="review-author">
                  {r.userName}
                  {r.verifiedPurchase && <span className="rv-verified"> ✔ Verified Purchase</span>}
                </p>
                <p className="review-text">{r.comment}</p>
                {r.adminResponse?.text && (
                  <div className="rv-admin-response">
                    <span className="rv-admin-label">Aloweda Response:</span>
                    <p>{r.adminResponse.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
