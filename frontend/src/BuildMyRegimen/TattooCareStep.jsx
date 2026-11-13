import './StepStyles.css'
import '../TattooQuiz/TattooQuiz.css'

// ── Same SVG Icons as TattooQuiz ─────────────────────────────────────────────
const IconFadingInk = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 4C18 4 10 13 10 20a8 8 0 0 0 16 0C26 13 18 4 18 4Z" stroke="#2b2620" strokeWidth="2" strokeLinejoin="round" fill="#d4c9bc" />
    <path d="M14 22c0 2.2 1.8 4 4 4" stroke="#2b2620" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
    <line x1="6" y1="10" x2="3" y2="10" stroke="#2b2620" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    <line x1="6" y1="14" x2="2" y2="14" stroke="#2b2620" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    <line x1="6" y1="18" x2="3" y2="18" stroke="#2b2620" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
  </svg>
)

const IconItching = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="20" width="24" height="10" rx="3" fill="#e8ddd4" stroke="#2b2620" strokeWidth="1.8"/>
    <path d="M11 20 C11 14 14 12 14 16" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 20 C18 13 21 11 21 16" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
    <path d="M25 20 C25 14 28 12 28 16" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="13" cy="17" r="1.5" fill="#e74c3c"/>
    <circle cx="20" cy="16" r="1.5" fill="#e74c3c"/>
    <circle cx="27" cy="17" r="1.5" fill="#e74c3c"/>
  </svg>
)

const IconDryness = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="12" width="26" height="16" rx="4" fill="#e8ddd4" stroke="#2b2620" strokeWidth="1.8"/>
    <path d="M12 16 L15 20 L13 24" stroke="#a0856e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14 L22 18 L20 22 L23 26" stroke="#a0856e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25 14 Q28 12 27 16" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M8 20 Q5 18 7 22" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
)

const IconNotHealing = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="14" width="26" height="8" rx="4" fill="#f5f0ea" stroke="#2b2620" strokeWidth="1.8"/>
    <rect x="14" y="5" width="8" height="26" rx="4" fill="#f5f0ea" stroke="#2b2620" strokeWidth="1.8"/>
    <rect x="14" y="14" width="8" height="8" rx="1" fill="#fff" stroke="#2b2620" strokeWidth="1.5"/>
    <circle cx="9" cy="18" r="1.2" fill="#ddd"/>
    <circle cx="27" cy="18" r="1.2" fill="#ddd"/>
    <circle cx="18" cy="9" r="1.2" fill="#ddd"/>
    <circle cx="18" cy="27" r="1.2" fill="#ddd"/>
    <circle cx="29" cy="8" r="4" fill="#e74c3c" opacity="0.9"/>
    <text x="29" y="11.5" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">!</text>
  </svg>
)

const IconColorsFading = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 28 L20 10 L24 14 L12 32 Z" fill="#3d3028" stroke="#2b2620" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="20" y="6" width="10" height="6" rx="2" fill="#5a4a3a" stroke="#2b2620" strokeWidth="1.5"/>
    <circle cx="14" cy="20" r="3" fill="#e74c3c"/>
    <circle cx="21" cy="14" r="3" fill="#e67e22" opacity="0.7"/>
    <circle cx="27" cy="22" r="3" fill="none" stroke="#e74c3c" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5"/>
    <circle cx="10" cy="26" r="2.5" fill="none" stroke="#3498db" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.4"/>
  </svg>
)

const TATTOO_CONCERNS = [
  { id: 'fadingink',    label: 'Fading Ink',           Icon: IconFadingInk,    tip: 'Ink looks dull or washed-out over time' },
  { id: 'itching',     label: 'Itching & Irritation',  Icon: IconItching,      tip: 'Skin feels itchy or inflamed around the tattoo' },
  { id: 'dryness',     label: 'Dryness & Peeling',     Icon: IconDryness,      tip: 'Skin feels tight, flaky or peeling over the tattoo' },
  { id: 'notHealing',  label: 'Not Healing Properly',  Icon: IconNotHealing,   tip: 'Fresh tattoo taking too long to recover' },
  { id: 'colorsFading',label: 'Colours Are Fading',    Icon: IconColorsFading, tip: 'Coloured ink losing vibrancy and brightness' },
  { id: 'none',        label: 'No Tattoo Concerns',    Icon: null,             tip: 'Skip this step' }
]

export default function TattooCareStep({ selected, onSelect }) {
  const toggleConcern = (concernId) => {
    if (concernId === 'none') {
      onSelect(['none'])
      return
    }
    let newSelected = selected.filter(id => id !== 'none')
    if (newSelected.includes(concernId)) {
      newSelected = newSelected.filter(id => id !== concernId)
    } else {
      newSelected = [...newSelected, concernId]
    }
    onSelect(newSelected)
  }

  return (
    <div className="step-container">
      <h2 className="step-heading">Do you have a tattoo?</h2>
      <p className="step-description">Select your tattoo concerns (or skip if you don't have a tattoo)</p>

      <div className="tq-concern-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {TATTOO_CONCERNS.map((concern) => {
          const isSelected = selected.includes(concern.id)
          const { Icon } = concern
          return (
            <button
              key={concern.id}
              className={`tq-concern-card ${isSelected ? 'tq-concern-card--selected' : ''}`}
              onClick={() => toggleConcern(concern.id)}
              aria-pressed={isSelected}
            >
              {Icon && <span className="tq-concern-icon"><Icon /></span>}
              <span className="tq-concern-label">{concern.label}</span>
              <span className="tq-concern-tip">{concern.tip}</span>
              {isSelected && <span className="tq-concern-check">&#10003;</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
