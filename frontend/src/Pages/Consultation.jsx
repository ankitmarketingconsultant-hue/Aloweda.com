import { useState } from 'react';
import Navbar from '../Navbar/navbar';
import Footer from '../Footer/Footer';
import './Consultation.css';

// Import doctor image
const drAjayImage = '/images/dr-ajay.jpg'; // Add actual image

export default function Consultation({ onNavigate, onLoginClick, cartCount }) {
  const [showContactModal, setShowContactModal] = useState(false);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Ajay Patwardhan',
      title: 'Senior Skincare Consultant',
      badge: 'Founder & CEO',
      specialization: '',
      credentials: 'M.B.B.S, D.I.M.',
      image: drAjayImage,
      bio: 'Dr. Patwardhan has pioneered innovative skincare products that blend Ayurveda with modern Allopathy.',
      experience: '35+ Years',
      patients: '10,000+',
      education: 'MD (Dermatology), MBBS',
      achievements: '10,000+ Successful Treatments · Published Research · Clinical Excellence Award',
      expertise: [
        'Acne & Pigmentation',
        'Anti-Aging & Aesthetics',
        'Sensitive Skin Disorders',
        'Clinical Research'
      ],
      availability: 'Mon–Fri, 10 AM–6 PM',
      languages: 'English, Hindi, Marathi'
    }
  ];

  const handleConsultClick = (doctorName) => {
    // WhatsApp integration or booking form
    const message = `Hi! I would like to book a consultation with ${doctorName}`;
    const whatsappNumber = '919972269191'; // Replace with actual WhatsApp number
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="aw-consultation">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* Hero Section */}
      <section className="aw-consultation-hero">
        <span className="aw-hero-eyebrow">Talk to our Specialist</span>
        <h1>Talk to our Specialist</h1>
        <p>
          Get personalized, evidence-based skincare guidance from our
          in-house specialists.
        </p>
      </section>

      {/* Doctor Profile Section */}
      <section className="aw-doctor-section">
        <div className="aw-doctor-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="aw-doctor-card">
              {/* Doctor Header */}
              <div className="aw-doctor-header">
                <div className="aw-doctor-avatar">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="aw-doctor-header-text">
                  <h2 className="aw-doctor-name">{doctor.name}</h2>
                  <p className="aw-doctor-title">{doctor.title}</p>
                </div>
                <span className="aw-doctor-badge">{doctor.badge}</span>
              </div>

              {/* Doctor Body */}
              <div className="aw-doctor-body">
                <p className="aw-doctor-credentials">
                  {doctor.credentials} &nbsp;·&nbsp; {doctor.specialization}
                </p>

                <p className="aw-doctor-bio">{doctor.bio}</p>

                {/* Quick Stats */}
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

                {/* Areas of Expertise */}
                <div className="aw-expertise">
                  <span className="aw-expertise-label">Focus Areas</span>
                  <div className="aw-expertise-tags">
                    {doctor.expertise.map((skill, index) => (
                      <span key={index} className="aw-expertise-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements — single condensed line */}
                <p className="aw-achievements">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {doctor.achievements}
                </p>

                {/* Book Consultation Button */}
                <button className="aw-book-btn" onClick={() => handleConsultClick(doctor.name)}>
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Consult Section */}
      <section className="aw-why-section">
        <div className="aw-section-header">
          <span className="aw-section-eyebrow">Why Consult</span>
          <h2>What You'll Get</h2>
        </div>
        <div className="aw-benefits-grid">
          <div className="aw-benefit-card">
            <div className="aw-benefit-icon-wrap">
              <svg className="aw-benefit-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div className="aw-benefit-content">
              <h3>Personalized Analysis</h3>
              <p>A detailed skin analysis tailored to your unique needs and concerns.</p>
            </div>
          </div>
          <div className="aw-benefit-card">
            <div className="aw-benefit-icon-wrap">
              <svg className="aw-benefit-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="aw-benefit-content">
              <h3>Custom Treatment Plan</h3>
              <p>A skincare routine designed specifically around your goals.</p>
            </div>
          </div>
          <div className="aw-benefit-card">
            <div className="aw-benefit-icon-wrap">
              <svg className="aw-benefit-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="aw-benefit-content">
              <h3>Expert Recommendations</h3>
              <p>Product guidance backed by 40+ years of combined expertise.</p>
            </div>
          </div>
          <div className="aw-benefit-card">
            <div className="aw-benefit-icon-wrap">
              <svg className="aw-benefit-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="aw-benefit-content">
              <h3>Ongoing Support</h3>
              <p>Continuous guidance and follow-up to track your progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="aw-how-section">
        <div className="aw-section-header">
          <span className="aw-section-eyebrow">Process</span>
          <h2>How It Works</h2>
        </div>
        <div className="aw-steps">
          <div className="aw-step">
            <div className="aw-step-number">1</div>
            <h3>Book Your Slot</h3>
            <p>Click the button above and message us on WhatsApp</p>
          </div>
          <div className="aw-step">
            <div className="aw-step-number">2</div>
            <h3>Share Details</h3>
            <p>Tell us about your skin concerns and goals</p>
          </div>
          <div className="aw-step">
            <div className="aw-step-number">3</div>
            <h3>Video Consultation</h3>
            <p>Connect with your dermatologist for a detailed review</p>
          </div>
          <div className="aw-step">
            <div className="aw-step-number">4</div>
            <h3>Get Your Plan</h3>
            <p>Receive your personalized skincare routine</p>
          </div>
        </div>
      </section>

      <Footer onLoginClick={onLoginClick} />
    </div>
  );
}