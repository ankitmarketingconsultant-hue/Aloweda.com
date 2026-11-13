import './StepStyles.css'

// Same concern definitions as TattooQuiz
const TATTOO_CONCERNS = [
  {
    id: 'fadingink',
    label: 'Fading Ink',
    tip: 'Ink looks dull or washed-out over time'
  },
  {
    id: 'itching',
    label: 'Itching & Irritation',
    tip: 'Skin feels itchy or inflamed around the tattoo'
  },
  {
    id: 'dryness',
    label: 'Dryness & Peeling',
    tip: 'Skin feels tight, flaky or peeling over the tattoo'
  },
  {
    id: 'notHealing',
    label: 'Not Healing Properly',
    tip: 'Fresh tattoo taking too long to recover'
  },
  {
    id: 'colorsFading',
    label: 'Colours Are Fading',
    tip: 'Coloured ink losing vibrancy and brightness'
  },
  {
    id: 'none',
    label: 'No Tattoo Concerns',
    tip: 'Skip this step'
  }
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

      <div className="selection-grid">
        {TATTOO_CONCERNS.map((concern) => (
          <button
            key={concern.id}
            className={`selection-card ${selected.includes(concern.id) ? 'selected' : ''}`}
            onClick={() => toggleConcern(concern.id)}
            title={concern.tip}
          >
            <span className="card-label">{concern.label}</span>
            <span className="card-tip">{concern.tip}</span>
            {selected.includes(concern.id) && (
              <span className="card-check">&#10003;</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
