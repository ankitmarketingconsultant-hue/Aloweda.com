import { useState } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import './Cart.css'
import { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } from '../utils/metaPixel'

export default function Cart({ cart = [], onNavigate, onUpdateQuantity, onRemoveItem, onLoginClick, cartCount = 0, user = null }) {
  // Early return for testing - this will show if component is even rendering
  console.log('🔥 CART COMPONENT LOADING...', { cart, cartCount });
  
  const [promoCode, setPromoCode] = useState('')
  const [appliedBundle, setAppliedBundle] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cod') // 'cod' or 'online'
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({
    name: '', phone: '', email: '', address: '', city: '', state: '', pincode: ''
  })
  const [formError, setFormError] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState('')
  
  // Safety check for cart
  const safeCart = Array.isArray(cart) ? cart : [];
  
  console.log('=== CART COMPONENT RENDER ===');
  console.log('Cart prop:', safeCart);
  console.log('Cart length:', safeCart.length);
  console.log('Cart count:', cartCount);
  console.log('===========================');

  // Calculate totals - with safety checks
  const subtotal = safeCart.reduce((total, item) => {
    try {
      // Handle both number and string prices
      let price = 0;
      if (typeof item.price === 'number') {
        price = item.price;
      } else if (typeof item.price === 'string') {
        // Step 1: Remove currency symbols (₹, Rs, Rs.)
        let cleaned = item.price.replace(/[₹]/g, '').replace(/Rs\.?/gi, '');
        
        // Step 2: Remove spaces
        cleaned = cleaned.trim();
        
        // Step 3: Remove commas (Indian format: 1,299)
        cleaned = cleaned.replace(/,/g, '');
        
        // Step 4: Parse as float (handles decimal points correctly)
        price = parseFloat(cleaned) || 0;
      }
      
      console.log(`Item: ${item.name}, Original price: "${item.price}", Parsed: ${price}`);
      return total + (price * (item.quantity || 1));
    } catch (error) {
      console.error('Error calculating price for item:', item, error);
      return total;
    }
  }, 0)

  // Total items
  const totalItems = safeCart.reduce((sum, item) => sum + (item.quantity || 1), 0)

  // Serum Multi-Pack Offer: 3 serums = ₹999, 4 = ₹1299, 5 = ₹1599
  const SERUM_BUNDLE_PRICES = { 3: 999, 4: 1299, 5: 1599 }
  const totalSerums = safeCart.reduce((sum, item) => {
    if (item.category === 'Serum') return sum + (item.quantity || 1)
    return sum
  }, 0)
  const serumSubtotal = safeCart.reduce((sum, item) => {
    if (item.category === 'Serum') {
      try {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
        return sum + price * (item.quantity || 1)
      } catch { return sum }
    }
    return sum
  }, 0)
  const serumBundlePrice = SERUM_BUNDLE_PRICES[totalSerums] || null
  const serumBundleDiscount = serumBundlePrice !== null ? Math.max(0, serumSubtotal - serumBundlePrice) : 0

  // Multi-buy discount (3+ items get ₹70 off) — only applies when serum bundle offer is NOT active
  const multiBuyDiscount = totalItems >= 3 && serumBundleDiscount === 0 ? 70 : 0

  // Online payment discount (10% if online payment selected)
  const onlinePaymentDiscount = paymentMethod === 'online' ? subtotal * 0.10 : 0

  // Coupon discount
  const couponDiscount = appliedCoupon ? parseFloat(appliedCoupon.discount) || 0 : 0

  const bundleDiscount = appliedBundle ? parseFloat(appliedBundle.discount) || 0 : 0
  const shipping = subtotal > 999 ? 0 : 50
  const total = subtotal - bundleDiscount - multiBuyDiscount - serumBundleDiscount - onlinePaymentDiscount - couponDiscount + shipping

  // Debug logs
  console.log('=== CART CALCULATION DEBUG ===');
  console.log('Cart Items:', safeCart.length);
  console.log('Total Items:', totalItems);
  console.log('Subtotal:', subtotal);
  console.log('Multi-buy Discount (3+ items):', multiBuyDiscount);
  console.log('Payment Method:', paymentMethod);
  console.log('Online Payment Discount (10%):', onlinePaymentDiscount);
  console.log('Applied Bundle:', appliedBundle);
  console.log('Bundle Discount:', bundleDiscount);
  console.log('Shipping:', shipping);
  console.log('Total:', total);
  console.log('============================');

  const handleBundleApply = (bundleData) => {
    console.log('Bundle Applied:', bundleData);
    console.log('Bundle Discount:', bundleData?.discount);
    console.log('Discount Type:', typeof bundleData?.discount);
    console.log('Discount Value:', bundleData?.discount);
    setAppliedBundle(bundleData)
  }

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    setCouponError('')
    
    // Excel Coupons: B3A899, B4A1199, B2A699 (Combo Deals)
    const excelCoupons = {
      'B3A899': { 
        code: 'B3A899', 
        requiredItems: 3,
        finalPrice: 899,
        description: 'Buy any 3 products at ₹899'
      },
      'B4A1199': { 
        code: 'B4A1199', 
        requiredItems: 4,
        finalPrice: 1199,
        description: 'Buy any 4 products at ₹1199'
      },
      'B2A699': { 
        code: 'B2A699', 
        requiredItems: 2,
        finalPrice: 699,
        description: 'Buy any 2 products at ₹699'
      }
    }
    
    // No promotional coupons - removed as per client request

    const couponCode = promoCode.toUpperCase()
    
    // Check Excel combo coupons
    if (excelCoupons[couponCode]) {
      const combo = excelCoupons[couponCode]
      
      // Check if cart has any COMBO products - coupons don't apply to combos
      const hasComboProducts = safeCart.some(item => {
        // Check if product name contains "COMBO" or category is "combo"
        const nameHasCombo = item.name && item.name.toUpperCase().includes('COMBO');
        const categoryIsCombo = item.category && item.category.toLowerCase() === 'combo';
        return nameHasCombo || categoryIsCombo;
      });
      
      if (hasComboProducts) {
        setCouponError('This coupon cannot be applied to combo products. Please use single products only.')
        setAppliedCoupon(null)
        return
      }
      
      // Check if cart has required number of items
      if (totalItems < combo.requiredItems) {
        setCouponError(`Add ${combo.requiredItems - totalItems} more item${combo.requiredItems - totalItems > 1 ? 's' : ''} to use this combo offer`)
        setAppliedCoupon(null)
        return
      }
      
      if (totalItems > combo.requiredItems) {
        setCouponError(`This combo is for exactly ${combo.requiredItems} items. You have ${totalItems} items.`)
        setAppliedCoupon(null)
        return
      }
      
      // Calculate discount: current subtotal - combo final price
      const comboDiscount = Math.max(0, subtotal - combo.finalPrice)
      
      setAppliedCoupon({
        code: combo.code,
        discount: comboDiscount,
        type: 'combo',
        description: combo.description
      })
      setCouponError('')
      return
    }
    
    // Invalid coupon code
    setCouponError('Invalid coupon code')
    setAppliedCoupon(null)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setPromoCode('')
    setCouponError('')
  }

  const handleCheckout = async () => {
    // Check for out of stock items
    const outOfStockItems = safeCart.filter(item => item.stock === 0);
    
    if (outOfStockItems.length > 0) {
      const itemNames = outOfStockItems.map(item => `• ${item.name}`).join('\n');
      alert(`⚠️ Cannot proceed to checkout!\n\nThe following items are OUT OF STOCK:\n\n${itemNames}\n\nPlease remove them from cart to continue.`);
      return;
    }
    
    if (totalItems > 5) {
      alert('⚠️ Maximum 5 items allowed per order!\n\nYou currently have ' + totalItems + ' items in cart.\nPlease reduce the quantity to proceed to checkout.')
      return
    }
    // Check login
    if (!user) {
      onLoginClick()
      return
    }
    
    // Track InitiateCheckout event for Meta Pixel
    trackInitiateCheckout(safeCart, total)
    
    // Open checkout form
    setShowCheckoutForm(true)
  }

  const handleFormSubmit = async () => {
    const { name, phone, address, city, state, pincode } = checkoutForm
    if (!name || !phone || !address || !city || !state || !pincode) {
      setFormError('Please fill all required fields.')
      return
    }
    if (phone.length < 10) {
      setFormError('Please enter a valid 10-digit phone number.')
      return
    }
    setFormError('')

    const API_URL = import.meta.env.VITE_API_URL || 'https://aloweda-com.vercel.app'
    const KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Tu5gecp04PYbnk'

    const orderItems = safeCart.map(item => ({
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price,
    }))

    if (paymentMethod === 'cod') {
      // COD — call backend, send email, save to database
      try {
        // Get userId from localStorage if logged in
        const token = localStorage.getItem('token');
        let userId = null;
        
        if (token) {
          try {
            const userRes = await fetch(`${API_URL}/api/profile`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await userRes.json();
            if (userData.user) {
              userId = userData.user._id || userData.user.id;
            }
          } catch (e) {
            console.log('Guest checkout - no userId');
          }
        }

        const res = await fetch(`${API_URL}/api/cod/place-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerInfo: {
              name: checkoutForm.name,
              email: checkoutForm.email || 'guest@aloweda.com',
              phone: checkoutForm.phone,
              address: {
                street: checkoutForm.address,
                city: checkoutForm.city,
                state: checkoutForm.state,
                pincode: checkoutForm.pincode,
                country: 'India'
              }
            },
            items: orderItems.map(item => ({
              productId: item.id || item.productId || 'PROD-' + Date.now(),
              name: item.name,
              price: (() => {
                // Parse price from string to number
                if (typeof item.price === 'number') return item.price;
                if (typeof item.price === 'string') {
                  let cleaned = item.price.replace(/[₹]/g, '').replace(/Rs\.?/gi, '').trim().replace(/,/g, '');
                  return parseFloat(cleaned) || 0;
                }
                return 0;
              })(),
              quantity: item.quantity || 1,
              image: item.img || item.image || ''
            })),
            pricing: {
              subtotal: parseFloat(total),
              bundleDiscount: 0,
              couponDiscount: 0,
              onlinePaymentDiscount: 0,
              shippingCharges: 0,
              tax: 0,
              total: parseFloat(total)
            },
            userId: userId,
            paymentMethod: 'COD',
            orderStatus: 'Confirmed'
          }),
        })
        const data = await res.json()
        if (data.success) {
          // Track Purchase event for Meta Pixel (COD)
          trackPurchase(data.orderId, safeCart, total, 'COD')
          
          setShowCheckoutForm(false)
          setOrderPlaced(true)
          setPlacedOrderId(data.orderId)
        } else {
          setFormError(data.message || 'Something went wrong.')
        }
      } catch (err) {
        console.error('COD Error:', err);
        setFormError('Network error. Please try again.')
      }
    } else {
      // Online Payment via Razorpay
      try {
        const res = await fetch(`${API_URL}/api/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, currency: 'INR' }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Failed to create order')

        const options = {
          key: KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: 'Aloweda',
          description: 'Skincare Order',
          order_id: data.orderId,
          prefill: {
            name: checkoutForm.name,
            email: checkoutForm.email,
            contact: checkoutForm.phone,
          },
          handler: async function (response) {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  customer: checkoutForm,
                  items: orderItems,
                  total: total.toFixed(2),
                },
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              const orderId = 'RZP-' + response.razorpay_payment_id.slice(-8).toUpperCase()
              
              // Track Purchase event for Meta Pixel (Online Payment)
              trackPurchase(orderId, safeCart, total, 'Online')
              
              setShowCheckoutForm(false)
              setOrderPlaced(true)
              setPlacedOrderId(orderId)
            } else {
              alert('⚠️ Payment verification failed. Please contact support.')
            }
          },
          theme: { color: '#2c2416' },
          modal: { ondismiss: function () {} },
        }
        setShowCheckoutForm(false)
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (response) {
          alert('❌ Payment failed: ' + response.error.description)
        })
        rzp.open()
      } catch (err) {
        setFormError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="cart-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />
      
      <div className="cart-container" style={{ minHeight: '80vh', background: '#faf8f4' }}>
        <div className="cart-header">
          <h1 style={{ color: '#2c2416', fontSize: '2.5rem' }}>Shopping Cart</h1>
          <p style={{ color: '#6b5f4e' }}>{safeCart.length} {safeCart.length === 1 ? 'item' : 'items'} ({totalItems} total quantity)</p>
          {totalItems > 5 && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffc107',
              padding: '8px 12px',
              borderRadius: '6px',
              marginTop: '10px',
              fontSize: '13px',
              color: '#856404'
            }}>
              ⚠️ <strong>Maximum 5 items per order.</strong> Please reduce quantity to checkout.
            </div>
          )}
        </div>

        {safeCart.length === 0 ? (
          <div className="cart-empty" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: '#9b8e7c', marginBottom: '24px' }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#2c2416', marginBottom: '12px' }}>Your cart is empty</h2>
            <p style={{ fontSize: '1rem', color: '#6b5f4e', marginBottom: '32px' }}>Add some products to get started!</p>
            <button 
              className="shop-now-btn" 
              onClick={() => onNavigate('shop')}
              style={{
                background: 'linear-gradient(135deg, #e8dcc4 0%, #d4c5a9 100%)',
                color: '#2c2416',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer'
              }}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              {safeCart.map((item) => (
                <div key={item.id} className={`cart-item ${item.stock === 0 ? 'out-of-stock-item' : ''}`}>
                  <div className="cart-item__image">
                    <img src={item.img} alt={item.name} />
                    {item.stock === 0 && (
                      <div className="out-of-stock-overlay">
                        <span>OUT OF STOCK</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="cart-item__details">
                    <h3 className="cart-item__name">
                      {item.name}
                      {item.stock === 0 && (
                        <span className="oos-badge">⚠️ OUT OF STOCK</span>
                      )}
                    </h3>
                    <p className="cart-item__category">{item.category}</p>
                    <p className="cart-item__price">{item.price}</p>
                  </div>

                  <div className="cart-item__actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => {
                          if (totalItems >= 5) {
                            alert('⚠️ Maximum 5 items allowed per order!\n\nYou already have 5 items in cart.')
                            return
                          }
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }}
                        aria-label="Increase"
                        disabled={totalItems >= 5}
                        style={{
                          opacity: totalItems >= 5 ? 0.5 : 1,
                          cursor: totalItems >= 5 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className="remove-btn" 
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle Selector - Temporarily disabled */}
            {/* {cart.length > 0 && (
              <BundleSelector 
                cartItems={cart}
                onApplyBundle={handleBundleApply}
              />
            )} */}

            {/* Order Summary */}
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({safeCart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>

              {/* Serum Bundle Discount */}
              {serumBundleDiscount > 0 && (
                <div className="summary-row discount" style={{color: '#28a745', fontWeight: 'bold'}}>
                  <span>🌿 Serum Pack Offer ({totalSerums} Serums @ ₹{serumBundlePrice})</span>
                  <span style={{color: '#dc3545'}}>- ₹ {serumBundleDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Multi-buy Discount */}
              {multiBuyDiscount > 0 && (
                <div className="summary-row discount" style={{color: '#28a745', fontWeight: 'bold'}}>
                  <span>Multi-Buy Discount (3+ items)</span>
                  <span style={{color: '#dc3545'}}>- ₹ {multiBuyDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Online Payment Discount */}
              {onlinePaymentDiscount > 0 && (
                <div className="summary-row discount" style={{color: '#28a745', fontWeight: 'bold'}}>
                  <span>Online Payment Discount (10%)</span>
                  <span style={{color: '#dc3545'}}>- ₹ {onlinePaymentDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Coupon Discount */}
              {couponDiscount > 0 && appliedCoupon && (
                <div className="summary-row discount" style={{color: '#28a745', fontWeight: 'bold'}}>
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span style={{color: '#dc3545'}}>- ₹ {couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Debug Panel - Shows calculation details */}
              {process.env.NODE_ENV === 'development' && appliedBundle && (
                <div style={{
                  background: '#f8f9fa',
                  border: '1px dashed #6c757d',
                  padding: '10px',
                  margin: '10px 0',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}>
                  <strong>🔍 DEBUG INFO:</strong>
                  <div>Subtotal: {subtotal}</div>
                  <div>Bundle Discount: {bundleDiscount} (type: {typeof bundleDiscount})</div>
                  <div>Shipping: {shipping}</div>
                  <div>Calculation: {subtotal} - {bundleDiscount} + {shipping} = {total}</div>
                  <div>Applied Bundle: {JSON.stringify(appliedBundle, null, 2)}</div>
                </div>
              )}

              {appliedBundle && bundleDiscount > 0 && (
                <div className="summary-row discount" style={{color: '#28a745', fontWeight: 'bold'}}>
                  <span>Bundle Discount ({appliedBundle.bundleName})</span>
                  <span style={{color: '#dc3545'}}>- ₹ {bundleDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹ ${shipping}`}</span>
              </div>

              {(bundleDiscount > 0 || multiBuyDiscount > 0 || onlinePaymentDiscount > 0 || couponDiscount > 0 || serumBundleDiscount > 0) && (
                <div style={{
                  background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                  padding: '12px',
                  borderRadius: '8px',
                  margin: '10px 0',
                  textAlign: 'center',
                  border: '2px solid #28a745'
                }}>
                  <strong style={{color: '#155724', fontSize: '14px'}}>
                    🎉 You're saving ₹{(bundleDiscount + multiBuyDiscount + serumBundleDiscount + onlinePaymentDiscount + couponDiscount).toFixed(2)}!
                  </strong>
                </div>
              )}

              {/* Serum Multi-Pack Offer Banner */}
              {totalSerums > 0 && totalSerums < 3 && (
                <div className="buy-more-banner" style={{marginBottom: '10px'}}>
                  <div className="buy-more-top">
                    <span className="buy-more-icon">🌿</span>
                    <span className="buy-more-text">
                      {totalSerums === 1 && 'Add 2 more serums — get all 3 for ₹999!'}
                      {totalSerums === 2 && 'Add 1 more serum — get all 3 for ₹999!'}
                    </span>
                    <span className="buy-more-badge">SERUM OFFER</span>
                  </div>
                  <div className="buy-more-progress-track">
                    <div
                      className="buy-more-progress-fill"
                      style={{ width: `${Math.min((totalSerums / 3) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="buy-more-steps">
                    {[1, 2, 3].map(n => (
                      <span key={n} className={`buy-more-step ${totalSerums >= n ? 'reached' : ''}`}>{n} serum{n > 1 ? 's' : ''}</span>
                    ))}
                  </div>
                </div>
              )}
              {serumBundleDiscount > 0 && (
                <div className="buy-more-unlocked" style={{marginBottom: '10px'}}>
                  <span>✅</span>
                  <span>🌿 Serum Pack Offer Unlocked! {totalSerums} serums @ ₹{serumBundlePrice}</span>
                </div>
              )}
              {totalSerums >= 3 && totalSerums < 5 && SERUM_BUNDLE_PRICES[totalSerums + 1] && (
                <div className="buy-more-banner" style={{marginBottom: '10px', background: 'linear-gradient(135deg, #fff8f0 0%, #fdebd0 100%)', border: '1px dashed #e67e22'}}>
                  <div className="buy-more-top">
                    <span className="buy-more-icon">➕</span>
                    <span className="buy-more-text" style={{color: '#e67e22'}}>
                      Add 1 more serum — get {totalSerums + 1} for ₹{SERUM_BUNDLE_PRICES[totalSerums + 1]}!
                    </span>
                  </div>
                </div>
              )}

              {/* Buy More Save More Banner */}
              {totalItems < 3 && (
                <div className="buy-more-banner">
                  <div className="buy-more-top">
                    <span className="buy-more-icon">🛍️</span>
                    <span className="buy-more-text">
                      {totalItems === 0 && 'Add 3 items to get ₹70 off!'}
                      {totalItems === 1 && 'Add 2 more items to get ₹70 off!'}
                      {totalItems === 2 && 'Add 1 more item to get ₹70 off!'}
                    </span>
                    <span className="buy-more-badge">SAVE ₹70</span>
                  </div>
                  <div className="buy-more-progress-track">
                    <div
                      className="buy-more-progress-fill"
                      style={{ width: `${Math.min((totalItems / 3) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="buy-more-steps">
                    {[1, 2, 3].map(n => (
                      <span key={n} className={`buy-more-step ${totalItems >= n ? 'reached' : ''}`}>{n} item{n > 1 ? 's' : ''}</span>
                    ))}
                  </div>
                </div>
              )}

              {totalItems >= 3 && multiBuyDiscount > 0 && (
                <div className="buy-more-unlocked">
                  <span>✅</span>
                  <span>Multi-Buy Discount Unlocked! You saved ₹{multiBuyDiscount}</span>
                </div>
              )}

              {/* Premium Coupon Code Section */}
              <div className="coupon-section">
                {!appliedCoupon ? (
                  <div className="coupon-input-wrapper">
                    <div className="coupon-input-container">
                      <div className="coupon-input-group">
                        <div className="input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value.toUpperCase())
                            setCouponError('')
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="coupon-input"
                        />
                        <button onClick={handleApplyCoupon} className="coupon-apply-btn">
                          Apply
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {couponError && (
                      <div className="coupon-error-toast">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#dc3545" strokeWidth="2" />
                          <line x1="12" y1="8" x2="12" y2="12" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="12" cy="16" r="1" fill="#dc3545" />
                        </svg>
                        <span>{couponError}</span>
                      </div>
                    )}
                    
                    <div className="coupon-suggestions">
                      <div className="suggestions-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span>Available Offers</span>
                      </div>
                      <div className="suggestions-grid">
                        {/* Only Excel Combo Deals - No promotional coupons */}
                        {[
                          { code: 'B3A899', desc: 'Buy 3 at ₹899 - Combo Deal', color: '#28a745', items: 3 },
                          { code: 'B4A1199', desc: 'Buy 4 at ₹1199 - Combo Deal', color: '#17a2b8', items: 4 },
                          { code: 'B2A699', desc: 'Buy 2 at ₹699 - Combo Deal', color: '#ffc107', items: 2 }
                        ].map(({ code, desc, color, items }) => (
                          <button
                            key={code}
                            onClick={() => {
                              setPromoCode(code)
                              setCouponError('')
                            }}
                            className="suggestion-card"
                            style={{ '--card-color': color }}
                            title={items ? `Valid when you have exactly ${items} items` : ''}
                          >
                            <div className="suggestion-code">{code}</div>
                            <div className="suggestion-desc">{desc}</div>
                            {items && totalItems !== items && (
                              <div style={{fontSize: '10px', color: '#999', marginTop: '2px'}}>
                                {totalItems < items ? `Need ${items - totalItems} more` : `Remove ${totalItems - items}`}
                              </div>
                            )}
                            <div className="suggestion-action">
                              <span>Apply</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="coupon-applied-card">
                    <div className="applied-content">
                      <div className="applied-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="#28a745" />
                          <polyline points="9 12 11 14 15 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="applied-details">
                        <div className="applied-code">{appliedCoupon.code}</div>
                        <div className="applied-message">Coupon applied successfully</div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="remove-coupon-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>

              {totalItems > 5 && (
                <div style={{
                  background: '#fff3cd',
                  border: '2px solid #ffc107',
                  padding: '12px',
                  borderRadius: '8px',
                  margin: '10px 0',
                  textAlign: 'center'
                }}>
                  <strong style={{color: '#856404', fontSize: '14px', display: 'block', marginBottom: '5px'}}>
                    ⚠️ Order Limit Exceeded
                  </strong>
                  <span style={{color: '#856404', fontSize: '13px'}}>
                    You have {totalItems} items. Maximum 5 items allowed per order.
                    <br />
                    Please reduce quantity to checkout.
                  </span>
                </div>
              )}

              {/* Payment Method Selection */}
              <div style={{margin: '20px 0'}}>
                <h3 style={{fontSize: '16px', marginBottom: '12px', fontWeight: '600'}}>Select Payment Method</h3>
                
                {/* COD Option - No Discount */}
                <div 
                  onClick={() => {
                    setPaymentMethod('cod')
                    // Track AddPaymentInfo event for Meta Pixel
                    trackAddPaymentInfo('COD', safeCart, total)
                  }}
                  style={{
                    border: paymentMethod === 'cod' ? '2px solid #28a745' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'cod' ? '#f0f9f4' : '#fff',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid ' + (paymentMethod === 'cod' ? '#28a745' : '#999'),
                      background: paymentMethod === 'cod' ? '#28a745' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {paymentMethod === 'cod' && <span style={{color: '#fff', fontSize: '12px'}}>✓</span>}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '600', fontSize: '15px', marginBottom: '4px'}}>
                        💵 Cash on Delivery
                      </div>
                      <div style={{fontSize: '13px', color: '#666'}}>
                        Pay when you receive your order
                      </div>
                    </div>
                  </div>
                </div>

                {/* Online Payment Option with Discount Badge */}
                <div 
                  onClick={() => {
                    setPaymentMethod('online')
                    // Track AddPaymentInfo event for Meta Pixel
                    trackAddPaymentInfo('Online', safeCart, total)
                  }}
                  style={{
                    border: paymentMethod === 'online' ? '2px solid #28a745' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    background: paymentMethod === 'online' ? '#f0f9f4' : '#fff',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Discount Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '12px',
                    background: '#28a745',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    SAVE 10%
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid ' + (paymentMethod === 'online' ? '#28a745' : '#999'),
                      background: paymentMethod === 'online' ? '#28a745' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {paymentMethod === 'online' && <span style={{color: '#fff', fontSize: '12px'}}>✓</span>}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '600', fontSize: '15px', marginBottom: '4px'}}>
                        💳 Online Payment
                      </div>
                      <div style={{fontSize: '13px', color: '#666'}}>
                        UPI, Cards, Net Banking
                      </div>
                      {paymentMethod === 'online' && (
                        <div style={{
                          marginTop: '8px',
                          color: '#28a745',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          ✓ You save ₹{onlinePaymentDiscount.toFixed(2)} with Online Payment!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="checkout-btn" 
                onClick={handleCheckout}
                disabled={totalItems > 5}
                style={{
                  opacity: totalItems > 5 ? 0.5 : 1,
                  cursor: totalItems > 5 ? 'not-allowed' : 'pointer'
                }}
              >
                {totalItems > 5 ? '⚠️ Reduce Items to Checkout' : !user ? '🔒 Login to Checkout' : 'Proceed to Checkout'}
              </button>

              <button className="continue-shopping-btn" onClick={() => onNavigate('shop')}>
                Continue Shopping
              </button>

              <div className="cart-features">
                <div className="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Fast Delivery</span>
                </div>
                <div className="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer onLoginClick={onLoginClick} />

      {/* ── Checkout Form Modal ── */}
      {showCheckoutForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#2c2416', fontSize: '1.3rem' }}>Delivery Details</h2>
              <button onClick={() => setShowCheckoutForm(false)} style={{
                background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b5f4e'
              }}>✕</button>
            </div>

            {[
              { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Enter your full name' },
              { label: 'Phone Number *', key: 'phone', type: 'tel', placeholder: '10-digit mobile number' },
              { label: 'Email (optional)', key: 'email', type: 'email', placeholder: 'For order confirmation email' },
              { label: 'Address *', key: 'address', type: 'text', placeholder: 'House no, Street, Area' },
              { label: 'City *', key: 'city', type: 'text', placeholder: 'City' },
              { label: 'State *', key: 'state', type: 'text', placeholder: 'State' },
              { label: 'Pincode *', key: 'pincode', type: 'text', placeholder: '6-digit pincode' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a3728', marginBottom: '6px' }}>
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={checkoutForm[key]}
                  onChange={e => setCheckoutForm(prev => ({ ...prev, [key]: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1.5px solid #e0d8cc', fontSize: '14px', color: '#2c2416',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            ))}

            {formError && (
              <div style={{
                background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px',
                padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#856404'
              }}>
                ⚠️ {formError}
              </div>
            )}

            {/* Payment Method Selection inside form */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a3728', marginBottom: '10px' }}>
                Payment Method *
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  onClick={() => {
                    setPaymentMethod('cod')
                    // Track AddPaymentInfo event for Meta Pixel
                    trackAddPaymentInfo('COD', safeCart, total)
                  }}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer',
                    border: paymentMethod === 'cod' ? '2px solid #2c2416' : '2px solid #e0d8cc',
                    background: paymentMethod === 'cod' ? '#f0ebe3' : '#fff',
                    textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#2c2416'
                  }}
                >
                  💵 Cash on Delivery
                </div>
                <div
                  onClick={() => {
                    setPaymentMethod('online')
                    // Track AddPaymentInfo event for Meta Pixel
                    trackAddPaymentInfo('Online', safeCart, total)
                  }}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer',
                    border: paymentMethod === 'online' ? '2px solid #27ae60' : '2px solid #e0d8cc',
                    background: paymentMethod === 'online' ? '#f0fff4' : '#fff',
                    textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#27ae60',
                    position: 'relative'
                  }}
                >
                  💳 Online
                  <span style={{
                    position: 'absolute', top: '-8px', right: '6px',
                    background: '#27ae60', color: '#fff', fontSize: '10px',
                    padding: '2px 6px', borderRadius: '8px'
                  }}>SAVE 10%</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#f0ebe3', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#2c2416', fontWeight: '700' }}>
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleFormSubmit}
              style={{
                width: '100%', padding: '14px', background: '#2c2416', color: '#fff',
                border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', letterSpacing: '1px'
              }}
            >
              {paymentMethod === 'cod' ? '✅ PLACE ORDER (COD)' : '💳 PROCEED TO PAYMENT'}
            </button>
          </div>
        </div>
      )}

      {/* ── Order Success Screen ── */}
      {orderPlaced && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '40px 32px',
            width: '100%', maxWidth: '420px', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ color: '#2c2416', margin: '0 0 8px' }}>Order Placed!</h2>
            <p style={{ color: '#6b5f4e', marginBottom: '8px' }}>Order ID: <strong>{placedOrderId}</strong></p>
            <p style={{ color: '#6b5f4e', fontSize: '14px', marginBottom: '24px' }}>
              A confirmation email has been sent. We will deliver within 5–7 business days.
            </p>
            <button
              onClick={() => { setOrderPlaced(false); onNavigate('home') }}
              style={{
                background: '#2c2416', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '12px 32px', fontSize: '15px',
                fontWeight: '700', cursor: 'pointer'
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
