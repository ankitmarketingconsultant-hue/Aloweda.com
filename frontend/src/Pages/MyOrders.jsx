import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import useSEO from '../utils/useSEO'
import './MyOrders.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STATUS_COLORS = {
  Confirmed:    { bg: '#e8f5e9', color: '#2e7d32' },
  Shipped:      { bg: '#fff3e0', color: '#e65100' },
  'In Transit': { bg: '#e3f2fd', color: '#1565c0' },
  Delivered:    { bg: '#e8f5e9', color: '#1b5e20' },
  Cancelled:    { bg: '#fce4ec', color: '#b71c1c' },
  Pending:      { bg: '#f3e5f5', color: '#6a1b9a' },
}

const STATUS_STEPS = ['Confirmed', 'Shipped', 'In Transit', 'Delivered']

export default function MyOrders({ onNavigate, onLoginClick, cartCount }) {
  useSEO({
    title: 'My Orders | Aloweda',
    description: 'Track and manage your Aloweda orders.',
    canonical: '/my-orders',
  })

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to view your orders.')
      setLoading(false)
      return
    }

    fetch(`${API_BASE}/api/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setOrders(data.data || [])
        } else {
          setError(data.message || 'Could not load orders.')
        }
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const getStepIndex = (status) => STATUS_STEPS.indexOf(status)

  return (
    <div className="my-orders-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      <div className="my-orders-container">
        <h1 className="my-orders-heading">My Orders</h1>

        {loading && <p className="my-orders-loading">Loading your orders...</p>}

        {error && (
          <div className="my-orders-error">
            <p>{error}</p>
            {error.includes('login') && (
              <button className="my-orders-login-btn" onClick={onLoginClick}>Login</button>
            )}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="my-orders-empty">
            <p>No orders yet.</p>
            <Link to="/shop" className="my-orders-shop-btn">Start Shopping</Link>
          </div>
        )}

        {!loading && orders.map(order => {
          const statusStyle = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.Confirmed
          const stepIndex = getStepIndex(order.orderStatus)
          const isCancelled = order.orderStatus === 'Cancelled'

          return (
            <div key={order._id} className="mo-card">
              {/* Order header */}
              <div className="mo-card__header">
                <div>
                  <span className="mo-label">Order ID</span>
                  <span className="mo-value mo-value--id">{order.orderId}</span>
                </div>
                <div>
                  <span className="mo-label">Date</span>
                  <span className="mo-value">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="mo-label">Total</span>
                  <span className="mo-value mo-value--price">&#8377;{order.pricing?.total || 0}</span>
                </div>
                <span
                  className="mo-status-badge"
                  style={{ background: statusStyle.bg, color: statusStyle.color }}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Items */}
              <div className="mo-items">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="mo-item">
                    <span className="mo-item__name">{item.name}</span>
                    <span className="mo-item__qty">x{item.quantity}</span>
                    <span className="mo-item__price">&#8377;{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Progress tracker */}
              {!isCancelled && (
                <div className="mo-tracker">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="mo-tracker__step">
                      <div className={`mo-tracker__dot ${i <= stepIndex ? 'mo-tracker__dot--done' : ''}`}>
                        {i <= stepIndex ? '&#10003;' : i + 1}
                      </div>
                      <span className={`mo-tracker__label ${i <= stepIndex ? 'mo-tracker__label--done' : ''}`}>
                        {step}
                      </span>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`mo-tracker__line ${i < stepIndex ? 'mo-tracker__line--done' : ''}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tracking info */}
              {/* Payment method + tracking / payment status */}
              <div className="mo-footer">
                <span className="mo-payment">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
                {order.trackingInfo?.trackingNumber ? (
                  <span className="mo-pay-status">
                    🚚 {order.trackingInfo.trackingNumber}
                    {order.trackingInfo.courier && ` · ${order.trackingInfo.courier}`}
                  </span>
                ) : (
                  order.paymentStatus && (
                    <span className={`mo-pay-status ${order.paymentStatus === 'Paid' ? 'mo-pay-status--paid' : ''}`}>
                      {order.paymentStatus}
                    </span>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}
