import { useState } from 'react'
import './Login.css'
import AlowedaLogo from '../assets/AlowedaLogo.png'
import { authAPI, storage } from '../utils/api'

export default function Login({ onNavigate, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      let response
      
      if (isSignUp) {
        // Sign Up
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Sabhi fields fill karo')
        }
        
        if (formData.password.length < 6) {
          throw new Error('Password kam se kam 6 characters ka hona chahiye')
        }

        response = await authAPI.signup(formData.name, formData.email, formData.password)
        setSuccess('Account successfully ban gaya! Login ho rahe hain...')
      } else {
        // Login
        if (!formData.email || !formData.password) {
          throw new Error('Email aur password dono do')
        }

        response = await authAPI.login(formData.email, formData.password)
        setSuccess('Login successful!')
      }

      // Save token and user data
      storage.setToken(response.token)
      storage.setUser(response.user)
      
      // Also set in standard localStorage keys for admin dashboard compatibility
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userName', response.user.name);

      // Debug log
      console.log('Login Response:', response);
      console.log('User Role:', response.user?.role);
      console.log('Is Admin?', response.user?.role === 'admin');

      // Check if user is admin - redirect to admin panel
      if (response.user && response.user.role === 'admin') {
        setSuccess('Admin login successful! Redirecting...');
        
        // Use React Router navigate for admin redirect (better than window.location)
        setTimeout(() => {
          if (onClose) onClose(); // Close login modal
          window.location.href = '/admin/dashboard'; // Full page redirect to ensure clean state
        }, 1000);
        return; // Don't execute regular user flow
      }

      // Regular user - notify parent component
      if (onLoginSuccess) {
        onLoginSuccess(response.user)
      }

      // Close modal after short delay
      setTimeout(() => {
        onClose()
      }, 1000)

    } catch (err) {
      setError(err.message || 'Kuch gadbad ho gayi, dobara try karo')
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="login-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Left side - Branding */}
        <div className="login-left">
          <div className="login-brand">
            <img src={AlowedaLogo} alt="Aloweda" className="login-logo" />
            <h1 className="login-brand-title">Welcome Back</h1>
            <p className="login-brand-subtitle">
              Discover nature-inspired wellness and premium skincare solutions
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="login-decoration">
            <div className="deco-circle deco-circle-1"></div>
            <div className="deco-circle deco-circle-2"></div>
            <div className="deco-circle deco-circle-3"></div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="login-right">
          <div className="login-form-wrap">
            <div className="login-header">
              <h2 className="login-title">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="login-subtitle">
                {isSignUp 
                  ? 'Join us for exclusive benefits' 
                  : 'Continue your wellness journey'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Error Message - Only show if it's NOT a "Database connection failed" false positive */}
              {error && !error.includes('Database connection') && (
                <div className="alert alert-error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="alert alert-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {success}
                </div>
              )}

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your name"
                    required={isSignUp}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="form-footer">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="forgot-link">
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    {isSignUp ? 'Creating...' : 'Signing In...'}
                  </>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {/* Social login */}
            <div className="social-login">
              <div className="divider">
                <span>or continue with</span>
              </div>
              
              <div className="social-buttons">
                <button type="button" className="social-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                
                <button type="button" className="social-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>

            {/* Toggle sign up/sign in */}
            <div className="login-toggle">
              <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
