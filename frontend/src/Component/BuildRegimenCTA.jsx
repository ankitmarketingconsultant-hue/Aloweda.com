import './BuildRegimenCTA.css'

export default function BuildRegimenCTA({ onNavigate }) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate('build-my-regimen')
    }
  }

  return (
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
  )
}
