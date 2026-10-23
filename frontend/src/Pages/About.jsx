import { useState } from 'react';
import Navbar from '../Navbar/navbar';
import Footer from '../Footer/Footer';
import './About.css';

// Import doctor image
const drAjayImage = '/images/dr-ajay.jpg'; // Add actual image

export default function About({ onNavigate, onLoginClick, cartCount }) {
  const [showContactModal, setShowContactModal] = useState(false);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Ajay Patwardhan',
      title: 'Chief Dermatologist & Founder',
      specialization: 'MD, Dermatology | 15+ Years Experience',
      image: drAjayImage,
      badge: 'Founder and CEO',
      bio: 'Dr. Ajay Patwardhan is a renowned dermatologist with over 15 years of experience in treating skin conditions and developing scientifically-backed skincare solutions. His expertise lies in combining modern dermatology with evidence-based formulations.',
      experience: '15+ Years',
      patients: '10,000+',
      education: 'MD (Dermatology), MBBS',
      expertise: [
        'Acne & Pigmentation',
        'Anti-Aging Solutions',
        'Sensitive Skin Care',
        'Evidence-Based Dermatology',
        'Clinical Research Methodology'
      ],
      availability: 'Mon - Fri, 10 AM - 6 PM',
      languages: 'English, Hindi'
    }
  ];

  const handleConsultClick = (doctorName) => {
    // WhatsApp integration or booking form
    const message = `Hi! I would like to book a consultation with ${doctorName}`;
    const whatsappNumber = '918XXXXXXXXX'; // Add your WhatsApp number
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="about-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Aloweda</h1>
        <p>
          We bring scientific & evidence-based products which blend best of ancient Ayurveda. We promise effect, not miracles!
        </p>
      </section>

      {/* Our Story */}
      <section className="about-story">
        <h2>Our Story</h2>
        <div className="story-content">
          <div className="story-text">
            <p>
              Aloweda was born from a strong belief the Founder, Dr. Ajay Patwardhan, 
              developed when he used Wheat Grass and Turmeric Curcumin for his medical 
              conditions. Being a practicing Allopath & an expert in Chemical Toxicology, 
              he devoted the 'Covid Years' to Research and extensive Study of Globally 
              recognised best in class Skincare products.
            </p>
            <p>
              He realised that the best way forward was to blend ancient Ayurveda with 
              modern Allopathy. Not anecdotes but hard scientific facts.
            </p>
            <p>
              Today, Aloweda stands for no nonsense products made out of scientifically 
              proven ingredients, careful formulations, feedback from Dermatologists and 
              Cosmetologists and crafted with love for your skin.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="about-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌿</div>
            <h3>100% Effective</h3>
            <p>
              We use only proven, clinically-tested ingredients that are 
              safe for your skin and the environment.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">🔬</div>
            <h3>Science-Backed</h3>
            <p>
              Every product is formulated based on clinical research and 
              dermatological expertise.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">✨</div>
            <h3>Effective Results</h3>
            <p>
              We promise visible results within 30 days or your money back. 
              Your satisfaction is our guarantee.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">🐰</div>
            <h3>Cruelty-Free</h3>
            <p>
              All our products are cruelty-free and never tested on animals. 
              Beauty shouldn't come at a cost to life.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">♻️</div>
            <h3>Eco-Friendly</h3>
            <p>
              From packaging to production, we're committed to reducing our 
              environmental footprint.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">💚</div>
            <h3>Skin Safe</h3>
            <p>
              Free from harmful chemicals, parabens, and sulfates. 
              Gentle on all skin types, even sensitive skin.
            </p>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="consultation-section">
        <div className="consultation-header">
          <h2>Meet Our Expert</h2>
          <p>
            Get personalized skincare advice from our experienced dermatologist 
            and Ayurvedic expert. Book your consultation today!
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-image-container">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="doctor-image"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x350/ff6b6b/ffffff?text=${doctor.name}`;
                  }}
                />
                <div className="doctor-badge">{doctor.badge}</div>
              </div>
              
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <div className="doctor-title">{doctor.title}</div>
                <div className="doctor-specialization">{doctor.specialization}</div>

                <div className="doctor-bio">{doctor.bio}</div>

                <div className="doctor-details">
                  <div className="detail-item">
                    <span className="detail-icon">🎓</span>
                    <span>{doctor.education}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💼</span>
                    <span>{doctor.experience} Experience</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span>{doctor.patients} Patients Treated</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🗣️</span>
                    <span>{doctor.languages}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span>{doctor.availability}</span>
                  </div>
                </div>

                <div className="doctor-expertise">
                  <h4>Areas of Expertise</h4>
                  <div className="expertise-tags">
                    {doctor.expertise.map((skill, index) => (
                      <span key={index} className="expertise-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  className="consult-btn"
                  onClick={() => handleConsultClick(doctor.name)}
                >
                  Book Consultation with {doctor.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Consultation Process */}
        <div className="consultation-process">
          <h3>How Consultation Works</h3>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h4>Book Appointment</h4>
              <p>Choose your preferred doctor and time slot</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h4>Share Details</h4>
              <p>Tell us about your skin concerns and goals</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h4>Get Consultation</h4>
              <p>Video/Phone consultation with our expert</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h4>Personalize Plan</h4>
              <p>Receive your customized skincare regimen</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="consultation-cta">
          <h3>Ready to Transform Your Skin?</h3>
          <p>
            Book a free 15-minute consultation with our experts today!
          </p>
          <div className="cta-buttons">
            <button 
              className="cta-btn-primary"
              onClick={() => handleConsultClick('Our Team')}
            >
              Book Free Consultation
            </button>
            <button 
              className="cta-btn-secondary"
              onClick={() => onNavigate('shop')}
            >
              Explore Products
            </button>
          </div>
        </div>
      </section>

      <Footer onLoginClick={onLoginClick} />
    </div>
  );
}
