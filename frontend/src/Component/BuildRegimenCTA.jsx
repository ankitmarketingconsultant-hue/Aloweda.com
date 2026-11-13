import { Link } from 'react-router-dom'
import './BuildRegimenCTA.css'

export default function BuildRegimenCTA({ onNavigate }) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate('build-my-regimen')
    }
  }

  return (
    <>
      {/* Skincare Regimen Quiz CTA */}
      <section className="build-regimen-cta">
        <div className="regimen-cta-container">
          <div className="regimen-cta-content">
            <h2 className="regimen-cta-heading">Build Your Routine</h2>
            <p className="regimen-cta-description">
              Answer a few simple questions and discover a routine tailored to your needs
            </p>
            <button className="regimen-cta-btn" onClick={handleClick}>
              Take the Quiz →
            </button>
          </div>
        </div>
      </section>

      {/* Tattoo Care Quiz CTA */}
      <section className="tattoo-cta-section">
        <div className="tattoo-cta-inner">
          <div className="tattoo-cta-text">
            <span className="tattoo-cta-eyebrow">FREE TOOL</span>
            <h2 className="tattoo-cta-title">Not sure what your tattoo needs?</h2>
            <p className="tattoo-cta-sub">
              Answer 5 quick questions — fading ink, dryness, itching — and get a personalised care routine in seconds.
            </p>
          </div>
          <Link to="/tattoo-quiz" className="tattoo-cta-btn">
            Take the Tattoo Care Quiz →
          </Link>
        </div>
      </section>
    </>
  )
}
