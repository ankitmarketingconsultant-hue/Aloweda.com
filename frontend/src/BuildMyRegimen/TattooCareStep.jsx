import { tattooConcerns } from '../data/regimenOptions'
import './StepStyles.css'

export default function TattooCareStep({ selected, onSelect }) {
  const toggleConcern = (concernId) => {
    // If "No Tattoo Concerns" selected, clear all and select only "none"
    if (concernId === 'none') {
      onSelect(['none'])
      return
    }

    // Any real concern selected — remove "none" first
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
        {tattooConcerns.map((concern) => (
          <button
            key={concern.id}
            className={`selection-card ${selected.includes(concern.id) ? 'selected' : ''}`}
            onClick={() => toggleConcern(concern.id)}
          >
            <span className="card-label">{concern.label}</span>
            {selected.includes(concern.id) && (
              <span className="card-check">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
