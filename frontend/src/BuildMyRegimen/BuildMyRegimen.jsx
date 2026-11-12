import { useState } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import SkinCareStep from './SkinCareStep'
import BundleStep from './BundleStep'
import SkinTypeStep from './SkinTypeStep'
import HairCareStep from './HairCareStep'
import LipCareStep from './LipCareStep'
import useSEO from '../utils/useSEO'
import TattooCareStep from './TattooCareStep'
import PhotoUploadStep from './PhotoUploadStep'
import ConsultationStep from './ConsultationStep'
import RecommendationResults from './RecommendationResults'
import './BuildMyRegimen.css'

const STEPS = [
  { id: 1, label: 'Get Started',       title: 'Choose your routine type',           subtitle: 'What kind of skincare routine are you looking for?' },
  { id: 2, label: 'Skin Type',          title: "What's your skin type?",             subtitle: 'Select the one that best describes your skin' },
  { id: 3, label: 'Skin Concerns',      title: 'What are your skin concerns?',       subtitle: 'Select all that apply' },
  { id: 4, label: 'Hair Care',          title: 'Do you need hair care products?',    subtitle: 'Select your hair concerns' },
  { id: 5, label: 'Lip Care',           title: 'Do you need lip care products?',     subtitle: 'Select your lip concerns' },
  { id: 6, label: 'Tattoo Care',        title: 'Do you have a tattoo?',              subtitle: 'Select your tattoo concerns, or skip if not applicable' },
  { id: 7, label: 'Photo (Optional)',   title: 'Upload a photo',                     subtitle: 'Optional — helps us understand your skin better' },
  { id: 8, label: 'Contact Details',    title: 'Your contact details',               subtitle: "We'll send your personalized routine to your email" }
]

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BuildMyRegimen({ onNavigate, onLoginClick, cartCount, onAddToCart }) {
  useSEO({
    title: 'Build My Skincare Regimen | Personalised Routine | Aloweda',
    description: 'Answer a few questions and get your personalised skincare routine from Aloweda. Products matched to your skin type, concerns and goals.',
    canonical: '/build-my-regimen',
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState({
    skinConcerns: [],
    bundle: '',
    skinType: '',
    hairConcerns: [],
    lipConcerns: [],
    tattooConcerns: [],
    photo: null,
    consultation: {
      name: '',
      email: '',
      phone: '',
      age: '',
      additionalConcerns: '',
      currentRoutine: '',
      allergies: '',
      consent: false
    }
  })

  const totalSteps = STEPS.length
  const activeStep = STEPS.find(s => s.id === currentStep)

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateConsultation = (field, value) => {
    setFormData(prev => ({
      ...prev,
      consultation: {
        ...prev.consultation,
        [field]: value
      }
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
      // Scroll to split screen section (skip hero)
      const splitScreen = document.querySelector('.split-screen-container')
      if (splitScreen) {
        splitScreen.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      // Scroll to split screen section (skip hero)
      const splitScreen = document.querySelector('.split-screen-container')
      if (splitScreen) {
        splitScreen.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleSubmit = async () => {
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.bundle !== ''
      case 2:
        return formData.skinType !== ''
      case 3:
        return formData.skinConcerns.length > 0
      case 4:
        return true // Hair care is optional
      case 5:
        return true // Lip care is optional
      case 6:
        return true // Tattoo care is optional
      case 7:
        return true // Photo is optional
      case 8:
        return (
          formData.consultation.name &&
          formData.consultation.email &&
          formData.consultation.phone &&
          formData.consultation.consent
        )
      default:
        return false
    }
  }

  if (showResults) {
    return <RecommendationResults formData={formData} onNavigate={onNavigate} onAddToCart={onAddToCart} />
  }

  return (
    <div className="build-regimen-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* Split Screen Layout */}
      <div className="split-screen-container">
        {/* Left Side - Progress Rail + Question */}
        <div className="question-panel">
          <div className="question-content">

            <div className="progress-rail">
              <span className="rail-eyebrow">Step {currentStep} of {totalSteps}</span>

              <div className="rail-track" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
                <div className="rail-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
              </div>

              <ol className="rail-steps">
                {STEPS.map(step => {
                  const isDone = currentStep > step.id
                  const isCurrent = currentStep === step.id
                  return (
                    <li key={step.id} className={`rail-step ${isCurrent ? 'is-current' : ''} ${isDone ? 'is-done' : ''}`}>
                      <span className="rail-step-marker">
                        {isDone ? <CheckIcon /> : step.id}
                      </span>
                      <span className="rail-step-label">{step.label}</span>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="rail-question">
              <h1 className="question-title">{activeStep.title}</h1>
              <p className="question-subtitle">{activeStep.subtitle}</p>

              {currentStep > 1 && (
                <button className="nav-btn nav-btn--back" onClick={handleBack}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Options */}
        <div className="options-panel">
          {/* This heading is now OUTSIDE every per-step conditional below,
              so it renders unconditionally for currentStep 1 through 7. */}
          <div className="options-content">
            <p className="bundle-step-question">
              {currentStep === 1 && 'What are you looking for?'}
              {currentStep === 2 && "What's your skin type?"}
              {currentStep === 3 && 'What are your skin concerns?'}
              {currentStep === 4 && 'What are your hair care goals?'}
              {currentStep === 5 && 'What do you need for your lips?'}
              {currentStep === 6 && 'Do you have a tattoo?'}
              {currentStep === 7 && 'Upload your photo (optional)'}
              {currentStep === 8 && 'How can we reach you?'}
            </p>

            {currentStep === 1 && (
              <BundleStep
                selected={formData.bundle}
                onSelect={(bundle) => updateFormData('bundle', bundle)}
              />
            )}

            {currentStep === 2 && (
              <SkinTypeStep
                selected={formData.skinType}
                onSelect={(skinType) => updateFormData('skinType', skinType)}
              />
            )}

            {currentStep === 3 && (
              <SkinCareStep
                selected={formData.skinConcerns}
                onSelect={(concerns) => updateFormData('skinConcerns', concerns)}
              />
            )}

            {currentStep === 4 && (
              <HairCareStep
                selected={formData.hairConcerns}
                onSelect={(concerns) => updateFormData('hairConcerns', concerns)}
              />
            )}

            {currentStep === 5 && (
              <LipCareStep
                selected={formData.lipConcerns}
                onSelect={(concerns) => updateFormData('lipConcerns', concerns)}
              />
            )}

            {currentStep === 6 && (
              <TattooCareStep
                selected={formData.tattooConcerns}
                onSelect={(concerns) => updateFormData('tattooConcerns', concerns)}
              />
            )}

            {currentStep === 7 && (
              <PhotoUploadStep
                photo={formData.photo}
                onPhotoChange={(photo) => updateFormData('photo', photo)}
              />
            )}

            {currentStep === 8 && (
              <ConsultationStep
                data={formData.consultation}
                onChange={updateConsultation}
              />
            )}

            {/* Next Button */}
            <button
              className={`next-btn ${!canProceed() ? 'next-btn--disabled' : ''}`}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === totalSteps ? 'Get My Routine' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}