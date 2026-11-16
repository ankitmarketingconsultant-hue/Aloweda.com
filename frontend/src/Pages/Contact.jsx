import { useState } from 'react';
import Navbar from '../Navbar/navbar';
import Footer from '../Footer/Footer';
import useSEO from '../utils/useSEO';
import './Contact.css';

export default function Contact({ onNavigate, onLoginClick, cartCount }) {
  useSEO({
    title: 'Contact Us | Aloweda',
    description: 'Get in touch with Aloweda. We are here to help with your skincare questions, orders, and feedback.',
    canonical: '/contact',
  });

  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())    return setError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Please enter a valid email.');
    if (!form.message.trim()) return setError('Please enter your message.');

    setSending(true);
    try {
      const w3 = new FormData();
      w3.append('access_key', 'w3f_71a559958310c0c54c6e8de352afd5730a9ba12899d75839');
      w3.append('subject',  `New Contact Message from ${form.name.trim()} — Aloweda`);
      w3.append('name',     form.name.trim());
      w3.append('email',    form.email.trim());
      w3.append('message',
        `Name: ${form.name.trim()}\n` +
        `Email: ${form.email.trim()}\n` +
        `Phone: ${form.phone.trim() || 'Not provided'}\n\n` +
        `Message:\n${form.message.trim()}`
      );
      w3.append('_gotcha', ''); // honeypot

      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: w3 });
      const data = await res.json();

      if (data.success) {
        setSent(true);
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="aw-contact-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      <section className="aw-contact-hero">
        <span className="aw-contact-eyebrow">Get in Touch</span>
        <h1>Contact Us</h1>
        <p>Have a question about your order, our products, or anything else? We're here to help.</p>
      </section>

      <section className="aw-contact-body">

        {/* ── Info cards ── */}
        <div className="aw-contact-info">
          <div className="aw-contact-info-card">
            <div className="aw-contact-info-icon">📧</div>
            <h3>Email Us</h3>
            <a href="mailto:marketing@aloweda.com">marketing@aloweda.com</a>
          </div>
          <div className="aw-contact-info-card">
            <div className="aw-contact-info-icon">📞</div>
            <h3>Call Us</h3>
            <a href="tel:+919972269191">+91 99722 69191</a>
          </div>
          <div className="aw-contact-info-card">
            <div className="aw-contact-info-icon">🕐</div>
            <h3>Working Hours</h3>
            <p>Mon – Sat, 10 AM – 6 PM IST</p>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="aw-contact-form-wrap">
          {sent ? (
            <div className="aw-contact-success">
              <div className="aw-contact-success-icon">✅</div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button className="aw-contact-btn" onClick={() => setSent(false)}>Send Another Message</button>
            </div>
          ) : (
            <form className="aw-contact-form" onSubmit={handleSubmit} noValidate>
              <h2>Send us a Message</h2>

              <div className="aw-contact-row">
                <label className="aw-contact-label">
                  Full Name *
                  <input
                    className="aw-contact-input"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={sending}
                  />
                </label>
                <label className="aw-contact-label">
                  Email Address *
                  <input
                    className="aw-contact-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={sending}
                  />
                </label>
              </div>

              <label className="aw-contact-label">
                Phone Number (optional)
                <input
                  className="aw-contact-input"
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={sending}
                />
              </label>

              <label className="aw-contact-label">
                Message *
                <textarea
                  className="aw-contact-textarea"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  disabled={sending}
                />
              </label>

              {error && <p className="aw-contact-error">{error}</p>}

              <button className="aw-contact-btn" type="submit" disabled={sending}>
                {sending ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>

      </section>

      <Footer onLoginClick={onLoginClick} />
    </div>
  );
}
