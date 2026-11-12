import { useState } from 'react';
import Navbar from '../Navbar/navbar';
import Footer from '../Footer/Footer';
import useSEO from '../utils/useSEO';
import './Gifting.css';

// ─── Replace with your Google Form embed URL if you have one ──────────────
// To use a Google Form instead of the built-in form:
// 1. Create a Google Form at forms.google.com
// 2. Click "Send" → Embed → copy the src URL
// 3. Set USE_GOOGLE_FORM = true and paste the URL below
const USE_GOOGLE_FORM = false;
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true';

const BUNDLE_OPTIONS = [
  { value: 'starter',   label: 'Starter Gift — 1 Product',          desc: 'Perfect for a thoughtful single product gift' },
  { value: 'duo',       label: 'Duo Gift Set — 2 Products',          desc: 'A curated pair for morning & night care' },
  { value: 'trio',      label: 'Trio Ritual — 3 Products',           desc: 'A complete mini skincare ritual' },
  { value: 'signature', label: 'Signature Bundle — 4–5 Products',    desc: 'The full Aloweda experience' },
  { value: 'custom',    label: 'Custom Bundle — You Choose',         desc: 'Handpick any combination of products' },
];

const SKIN_CONCERNS = ['Acne & Oiliness', 'Pigmentation', 'Anti-Aging', 'Hydration', 'Sensitive Skin', 'Hair Care'];

const EMPTY_FORM = {
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  recipientName: '',
  recipientPhone: '',
  bundleSize: '',
  skinConcerns: [],
  deliveryDate: '',
  message: '',
  occasion: '',
};

export default function Gifting({ onNavigate, onLoginClick, cartCount }) {
  useSEO({
    title: 'Skincare Gift Sets | Corporate & Personal Gifting | Aloweda',
    description: 'Send Aloweda skincare as a gift. Personalised gift sets for birthdays, anniversaries, and corporate events. Natural, science-based skincare products.',
    canonical: '/gifting',
  })
  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const toggleConcern = (concern) => {
    setForm((f) => ({
      ...f,
      skinConcerns: f.skinConcerns.includes(concern)
        ? f.skinConcerns.filter((c) => c !== concern)
        : [...f.skinConcerns, concern],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.senderName.trim())   e.senderName   = 'Your name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.senderEmail.trim()))
                                   e.senderEmail  = 'Enter a valid email address.';
    if (!/^\d{10}$/.test(form.senderPhone.replace(/\s/g, '')))
                                   e.senderPhone  = 'Enter a valid 10-digit phone number.';
    if (!form.recipientName.trim()) e.recipientName = "Recipient's name is required.";
    if (!form.bundleSize)          e.bundleSize   = 'Please select a bundle size.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setSubmitting(true);

    // W3Forms — notify ajay@aloweda.com
    try {
      const w3 = new FormData();
      w3.append('access_key', 'a265dfd6-a653-447e-8610-698cb9547976');
      w3.append('subject', `New Gift Enquiry from ${form.senderName} — ${form.bundleSize}`);
      w3.append('name', form.senderName);
      w3.append('email', form.senderEmail);
      w3.append('message',
        `GIFT ENQUIRY\n\n` +
        `SENDER:\nName: ${form.senderName}\nEmail: ${form.senderEmail}\nPhone: ${form.senderPhone}\nOccasion: ${form.occasion || 'Not specified'}\n\n` +
        `RECIPIENT:\nName: ${form.recipientName}\nPhone: ${form.recipientPhone || 'Not provided'}\nDelivery Date: ${form.deliveryDate || 'Not specified'}\n\n` +
        `BUNDLE SIZE: ${form.bundleSize}\n` +
        `SKIN CONCERNS: ${form.skinConcerns.join(', ') || 'None specified'}\n\n` +
        `PERSONAL MESSAGE:\n${form.message || 'None'}`
      );
      await fetch('https://api.web3forms.com/submit', { method: 'POST', body: w3 });
    } catch (w3Err) {
      console.log('W3Forms notify failed (non-critical):', w3Err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  if (USE_GOOGLE_FORM) {
    return (
      <div className="gf-page">
        <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />
        <section className="gf-hero">
          <span className="gf-eyebrow">Send a Gift</span>
          <h1>Gift Aloweda</h1>
          <p>Give the gift of radiant, healthy skin to someone you love.</p>
        </section>
        <section className="gf-embed-wrap">
          <iframe
            src={GOOGLE_FORM_URL}
            title="Aloweda Gift Enquiry Form"
            className="gf-iframe"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
          >
            Loading form…
          </iframe>
        </section>
        <Footer onLoginClick={onLoginClick} />
      </div>
    );
  }

  return (
    <div className="gf-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* ── Hero ── */}
      <section className="gf-hero">
        <span className="gf-eyebrow">🎁 Send a Gift</span>
        <h1>Gift Aloweda</h1>
        <p>Give the gift of radiant, healthy skin to someone you love. We'll hand-pack and deliver it beautifully.</p>
      </section>

      {/* ── Why Gift Section ── */}
      <section className="gf-why">
        <div className="gf-why-grid">
          {[
            { icon: '🌿', title: 'Natural Ingredients',    desc: 'Ayurveda meets modern science — safe for all skin types.' },
            { icon: '🎀', title: 'Gift-Ready Packaging',   desc: 'Beautifully presented with a handwritten card.' },
            { icon: '🚚', title: 'Pan-India Delivery',     desc: 'Delivered straight to their door, hassle-free.' },
            { icon: '✉️', title: 'Personal Message',       desc: 'Add your own words to make it extra special.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="gf-why-card">
              <span className="gf-why-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form or Success ── */}
      <section className="gf-form-section">
        {submitted ? (
          <div className="gf-success">
            <div className="gf-success-icon">🎁</div>
            <h2>Gift Request Received!</h2>
            <p>
              Thanks, <strong>{form.senderName}</strong>! We've received your gifting enquiry and will reach out to{' '}
              <strong>{form.senderEmail}</strong> within 24 hours to confirm the bundle and arrange payment.
            </p>
            <button className="gf-btn" onClick={() => { setForm(EMPTY_FORM); setSubmitted(false); }}>
              Submit Another Request
            </button>
          </div>
        ) : (
          <form className="gf-form" onSubmit={handleSubmit} noValidate>
            <h2 className="gf-form-title">Gift Enquiry Form</h2>
            <p className="gf-form-sub">Fill in the details below and our team will get in touch to finalise your gift.</p>

            {/* ─ Sender Info ─ */}
            <fieldset className="gf-fieldset">
              <legend className="gf-legend">Your Details</legend>
              <div className="gf-row">
                <div className="gf-field">
                  <label className="gf-label">Your Name *</label>
                  <input className={`gf-input ${errors.senderName ? 'gf-input--err' : ''}`}
                    type="text" placeholder="Full name"
                    value={form.senderName} onChange={(e) => set('senderName', e.target.value)} />
                  {errors.senderName && <span className="gf-err">{errors.senderName}</span>}
                </div>
                <div className="gf-field">
                  <label className="gf-label">Your Email *</label>
                  <input className={`gf-input ${errors.senderEmail ? 'gf-input--err' : ''}`}
                    type="email" placeholder="you@example.com"
                    value={form.senderEmail} onChange={(e) => set('senderEmail', e.target.value)} />
                  {errors.senderEmail && <span className="gf-err">{errors.senderEmail}</span>}
                </div>
              </div>
              <div className="gf-row">
                <div className="gf-field">
                  <label className="gf-label">Your Phone *</label>
                  <input className={`gf-input ${errors.senderPhone ? 'gf-input--err' : ''}`}
                    type="tel" placeholder="10-digit mobile number"
                    value={form.senderPhone} onChange={(e) => set('senderPhone', e.target.value)} />
                  {errors.senderPhone && <span className="gf-err">{errors.senderPhone}</span>}
                </div>
                <div className="gf-field">
                  <label className="gf-label">Occasion</label>
                  <input className="gf-input" type="text" placeholder="e.g. Birthday, Anniversary…"
                    value={form.occasion} onChange={(e) => set('occasion', e.target.value)} />
                </div>
              </div>
            </fieldset>

            {/* ─ Recipient Info ─ */}
            <fieldset className="gf-fieldset">
              <legend className="gf-legend">Recipient Details</legend>
              <div className="gf-row">
                <div className="gf-field">
                  <label className="gf-label">Recipient Name *</label>
                  <input className={`gf-input ${errors.recipientName ? 'gf-input--err' : ''}`}
                    type="text" placeholder="Who is this for?"
                    value={form.recipientName} onChange={(e) => set('recipientName', e.target.value)} />
                  {errors.recipientName && <span className="gf-err">{errors.recipientName}</span>}
                </div>
                <div className="gf-field">
                  <label className="gf-label">Recipient Phone (optional)</label>
                  <input className="gf-input" type="tel" placeholder="For delivery coordination"
                    value={form.recipientPhone} onChange={(e) => set('recipientPhone', e.target.value)} />
                </div>
              </div>
              <div className="gf-field">
                <label className="gf-label">Preferred Delivery Date</label>
                <input className="gf-input" type="date"
                  min={new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]}
                  value={form.deliveryDate} onChange={(e) => set('deliveryDate', e.target.value)} />
              </div>
            </fieldset>

            {/* ─ Bundle Size ─ */}
            <fieldset className="gf-fieldset">
              <legend className="gf-legend">Bundle Size *</legend>
              {errors.bundleSize && <span className="gf-err gf-err--top">{errors.bundleSize}</span>}
              <div className="gf-bundle-grid">
                {BUNDLE_OPTIONS.map((opt) => (
                  <label key={opt.value}
                    className={`gf-bundle-card ${form.bundleSize === opt.value ? 'gf-bundle-card--active' : ''}`}>
                    <input type="radio" name="bundleSize" value={opt.value}
                      checked={form.bundleSize === opt.value}
                      onChange={() => set('bundleSize', opt.value)}
                      className="gf-radio-hidden" />
                    <span className="gf-bundle-label">{opt.label}</span>
                    <span className="gf-bundle-desc">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* ─ Skin Concerns ─ */}
            <fieldset className="gf-fieldset">
              <legend className="gf-legend">Skin Concerns (optional)</legend>
              <p className="gf-field-hint">Helps us recommend the right products.</p>
              <div className="gf-tags">
                {SKIN_CONCERNS.map((concern) => (
                  <button key={concern} type="button"
                    className={`gf-tag ${form.skinConcerns.includes(concern) ? 'gf-tag--active' : ''}`}
                    onClick={() => toggleConcern(concern)}>
                    {concern}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* ─ Personal Message ─ */}
            <fieldset className="gf-fieldset">
              <legend className="gf-legend">Personal Message (optional)</legend>
              <textarea className="gf-textarea" rows={3}
                placeholder="Write something heartfelt for the gift card…"
                value={form.message} onChange={(e) => set('message', e.target.value)} />
            </fieldset>

            <button className="gf-btn gf-btn--submit" type="submit" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Gift Enquiry'}
            </button>

            <p className="gf-privacy-note">
              🔒 Your details are safe with us and will only be used to fulfil your gift enquiry.
            </p>
          </form>
        )}
      </section>

      <Footer onLoginClick={onLoginClick} />
    </div>
  );
}
