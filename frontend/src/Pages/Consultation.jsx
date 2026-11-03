import { useState } from 'react';
import Navbar from '../Navbar/navbar';
import Footer from '../Footer/Footer';
import './Consultation.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Consultation fee (change here to update everywhere) ───────────────────
const CONSULTATION_FEE = 499; // INR

// ─── Google Calendar appointment link ─────────────────────────────────────
// Replace the calendarUrl below with your actual Google Calendar appointment
// scheduling link from calendar.google.com → "Create appointment schedule"
const CALENDAR_URL = 'https://calendar.google.com/calendar/appointments';

const doctors = [
  {
    id: 1,
    name: 'Dr. Ajay Patwardhan',
    title: 'Senior Skincare Consultant',
    badge: 'Advisor',
    credentials: 'M.B.B.S, D.I.M.',
    bio: 'Dr. Patwardhan has pioneered innovative skincare products that blend Ayurveda with modern Allopathy.',
    experience: '35+ Years',
    patients: '10,000+',
    achievements: '10,000+ Successful Treatments · Published Research · Clinical Excellence Award',
    expertise: ['Acne & Pigmentation', 'Anti-Aging & Aesthetics', 'Sensitive Skin Disorders', 'Clinical Research'],
    availability: 'Mon–Fri, 10 AM–6 PM',
  },
];

// ─── Razorpay loader helper ────────────────────────────────────────────────
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Consultation({ onNavigate, onLoginClick, cartCount }) {
  const [showPaywall, setShowPaywall]     = useState(false);
  const [customerName, setCustomerName]   = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [formError, setFormError]         = useState('');
  const [paying, setPaying]               = useState(false);
  const [paymentDone, setPaymentDone]     = useState(false);

  // ── Step 1: open the paywall modal ──────────────────────────────────
  const handleBookClick = () => {
    setShowPaywall(true);
    setFormError('');
  };

  // ── Step 2: validate → create Razorpay order → open checkout ────────
  const handlePayNow = async () => {
    if (!customerName.trim()) return setFormError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()))
      return setFormError('Please enter a valid email address.');

    setFormError('');
    setPaying(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        setPaying(false);
        return setFormError('Could not load payment gateway. Please check your connection.');
      }

      // Create order on backend
      const orderRes = await fetch(`${API_BASE}/api/consultation/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: CONSULTATION_FEE,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setPaying(false);
        return setFormError(orderData.message || 'Could not initiate payment. Try again.');
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Aloweda',
        description: 'Specialist Skincare Consultation',
        order_id: orderData.orderId,
        prefill: {
          name: customerName.trim(),
          email: customerEmail.trim(),
        },
        theme: { color: '#1f4d3d' },
        modal: {
          ondismiss: () => setPaying(false),
        },
        handler: async (response) => {
          // Step 3: verify on backend
          try {
            const verifyRes = await fetch(`${API_BASE}/api/consultation/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim(),
                amount: CONSULTATION_FEE,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setPaymentDone(true);
              setShowPaywall(false);
            } else {
              setFormError('Payment verification failed. Please contact support.');
            }
          } catch {
            setFormError('Verification error. Please contact support.');
          } finally {
            setPaying(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaying(false);
      setFormError('Something went wrong. Please try again.');
      console.error(err);
    }
  };

  // ── Step 4: open Google Calendar to pick a slot ──────────────────────
  const handleBookSlot = () => {
    window.open(CALENDAR_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="aw-consultation">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* ── Hero ── */}
      <section className="aw-consultation-hero">
        <span className="aw-hero-eyebrow">Talk to our Specialist</span>
        <h1>Talk to our Specialist</h1>
        <p>Get personalized, evidence-based skincare guidance from our in-house specialists.</p>
      </section>

      {/* ── Doctor Profile ── */}
      <section className="aw-doctor-section">
        <div className="aw-doctor-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="aw-doctor-card">
              <div className="aw-doctor-header">
                <div className="aw-doctor-avatar">
                  {doctor.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="aw-doctor-header-text">
                  <h2 className="aw-doctor-name">{doctor.name}</h2>
                </div>
                <span className="aw-doctor-badge">{doctor.badge}</span>
              </div>

              <div className="aw-doctor-body">
                <p className="aw-doctor-credentials">{doctor.credentials}</p>
                <p className="aw-doctor-bio">{doctor.bio}</p>

                <div className="aw-doctor-stats">
                  <div className="aw-stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    <div className="aw-stat-details">
                      <span className="aw-stat-label">Experience</span>
                      <span className="aw-stat-value">{doctor.experience}</span>
                    </div>
                  </div>
                  <div className="aw-stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <div className="aw-stat-details">
                      <span className="aw-stat-label">Patients</span>
                      <span className="aw-stat-value">{doctor.patients}</span>
                    </div>
                  </div>
                  <div className="aw-stat-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <div className="aw-stat-details">
                      <span className="aw-stat-label">Available</span>
                      <span className="aw-stat-value">{doctor.availability}</span>
                    </div>
                  </div>
                </div>

                <div className="aw-expertise">
                  <span className="aw-expertise-label">Focus Areas</span>
                  <div className="aw-expertise-tags">
                    {doctor.expertise.map((skill, i) => (
                      <span key={i} className="aw-expertise-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <p className="aw-achievements">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {doctor.achievements}
                </p>

                {/* ── Pricing pill + CTA ── */}
                <div className="aw-price-row">
                  <div className="aw-price-pill">
                    <span className="aw-price-label">Consultation Fee</span>
                    <span className="aw-price-amount">₹{CONSULTATION_FEE}</span>
                  </div>
                  <button className="aw-book-btn" onClick={handleBookClick}>
                    Book Consultation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Consult ── */}
      <section className="aw-why-section">
        <div className="aw-section-header">
          <span className="aw-section-eyebrow">Why Consult</span>
          <h2>What You'll Get</h2>
        </div>
        <div className="aw-benefits-grid">
          {[
            { title: 'Personalized Analysis', desc: 'A detailed skin analysis tailored to your unique needs and concerns.', icon: (<svg className="aw-benefit-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>) },
            { title: 'Custom Treatment Plan', desc: 'A skincare routine designed specifically around your goals.', icon: (<svg className="aw-benefit-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>) },
            { title: 'Expert Recommendations', desc: 'Product guidance backed by 40+ years of combined expertise.', icon: (<svg className="aw-benefit-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>) },
            { title: 'Ongoing Support', desc: 'Continuous guidance and follow-up to track your progress.', icon: (<svg className="aw-benefit-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>) },
          ].map(({ title, desc, icon }) => (
            <div key={title} className="aw-benefit-card">
              <div className="aw-benefit-icon-wrap">{icon}</div>
              <div className="aw-benefit-content">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="aw-how-section">
        <div className="aw-section-header">
          <span className="aw-section-eyebrow">Process</span>
          <h2>How It Works</h2>
        </div>
        <div className="aw-steps">
          {[
            { n: 1, title: 'Pay Consultation Fee', desc: `Pay ₹${CONSULTATION_FEE} securely via Razorpay` },
            { n: 2, title: 'Book Your Slot',        desc: 'Pick a time that suits you on Google Calendar' },
            { n: 3, title: 'Video Consultation',    desc: 'Connect with Dr. Patwardhan for a detailed review' },
            { n: 4, title: 'Get Your Plan',         desc: 'Receive your personalized skincare routine' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="aw-step">
              <div className="aw-step-number">{n}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer onLoginClick={onLoginClick} />

      {/* ════════════════════════════════════════════════════════════════
          PAYWALL MODAL — shown when user clicks "Book Consultation"
      ════════════════════════════════════════════════════════════════ */}
      {showPaywall && (
        <div className="aw-modal-overlay" onClick={() => !paying && setShowPaywall(false)}>
          <div className="aw-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="aw-modal-close"
              onClick={() => !paying && setShowPaywall(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="aw-modal-header">
              <div className="aw-modal-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h2>Book a Consultation</h2>
              <p>with Dr. Ajay Patwardhan</p>
            </div>

            <div className="aw-modal-fee-box">
              <span className="aw-modal-fee-label">Consultation Fee</span>
              <span className="aw-modal-fee-amount">₹{CONSULTATION_FEE}</span>
              <span className="aw-modal-fee-note">One-time · Secure payment via Razorpay</span>
            </div>

            <div className="aw-modal-includes">
              {['30-minute video consultation', 'Personalized skincare plan', 'Product recommendations', 'Written follow-up summary'].map((item) => (
                <div key={item} className="aw-modal-include-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {item}
                </div>
              ))}
            </div>

            <div className="aw-modal-form">
              <label className="aw-modal-label">
                Full Name
                <input
                  className="aw-modal-input"
                  type="text"
                  placeholder="Your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={paying}
                />
              </label>
              <label className="aw-modal-label">
                Email Address
                <input
                  className="aw-modal-input"
                  type="email"
                  placeholder="you@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  disabled={paying}
                />
              </label>
              {formError && <p className="aw-modal-error">{formError}</p>}
            </div>

            <button className="aw-modal-pay-btn" onClick={handlePayNow} disabled={paying}>
              {paying ? 'Processing…' : `Pay ₹${CONSULTATION_FEE} & Continue`}
            </button>

            <p className="aw-modal-secure-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              256-bit SSL secured · Powered by Razorpay
            </p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SUCCESS MODAL — shown after payment is verified
      ════════════════════════════════════════════════════════════════ */}
      {paymentDone && (
        <div className="aw-modal-overlay" onClick={() => setPaymentDone(false)}>
          <div className="aw-modal aw-modal--success" onClick={(e) => e.stopPropagation()}>
            <button className="aw-modal-close" onClick={() => setPaymentDone(false)} aria-label="Close">✕</button>

            <div className="aw-success-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>

            <h2 className="aw-success-title">Payment Successful!</h2>
            <p className="aw-success-sub">
              Your consultation fee has been received. Now pick a date and time that works for you.
            </p>

            <div className="aw-success-steps">
              <div className="aw-success-step">
                <span className="aw-success-step-num">1</span>
                <span>Click the button below to open our booking calendar</span>
              </div>
              <div className="aw-success-step">
                <span className="aw-success-step-num">2</span>
                <span>Choose a slot that works for you (Mon–Fri, 10 AM–6 PM)</span>
              </div>
              <div className="aw-success-step">
                <span className="aw-success-step-num">3</span>
                <span>You'll receive a calendar invite with the video call link</span>
              </div>
            </div>

            <button className="aw-modal-calendar-btn" onClick={handleBookSlot}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book My Slot on Google Calendar
            </button>

            <p className="aw-success-help">
              Confirmation email sent to <strong>{customerEmail}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
