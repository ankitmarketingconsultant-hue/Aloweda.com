import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const QuickAdminSetup = () => {
  const [status, setStatus] = useState('ready');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const ADMIN_CREDENTIALS = {
    name: 'AlowedaAdmin',
    email: 'admin@aloweda.com',
    password: 'Aloweda2024',
    phone: '1234567890',
    role: 'admin'
  };

  const createAdmin = async () => {
    setStatus('creating');
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ADMIN_CREDENTIALS),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        if (data.message && data.message.includes('already registered')) {
          setStatus('exists');
          setError('Admin account already exists! You can login now.');
          setTimeout(() => {
            navigate('/admin/login');
          }, 2000);
        } else {
          setStatus('error');
          setError(data.message || 'Failed to create admin');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setStatus('error');
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box" style={{ maxWidth: '500px' }}>
        <div className="admin-login-header">
          <h1>Quick Admin Setup</h1>
          <p>One-click admin account creation</p>
        </div>

        {status === 'ready' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ 
              background: '#f7fafc', 
              padding: '24px', 
              borderRadius: '8px', 
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1a202c' }}>
                Admin Credentials:
              </h3>
              <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.8' }}>
                <div><strong>Email:</strong> admin@aloweda.com</div>
                <div><strong>Password:</strong> Aloweda2024</div>
                <div><strong>Role:</strong> Admin</div>
              </div>
            </div>

            <button 
              onClick={createAdmin}
              className="admin-login-btn"
              style={{ width: '100%' }}
            >
              🚀 Create Admin Account
            </button>
          </div>
        )}

        {status === 'creating' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: '#4a5568', fontSize: '15px' }}>Creating admin account...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: '#10b981', margin: '0 0 12px 0' }}>Success!</h3>
            <p style={{ color: '#4a5568', fontSize: '14px' }}>
              Admin account created successfully!
            </p>
            <p style={{ color: '#718096', fontSize: '13px', marginTop: '8px' }}>
              Redirecting to login...
            </p>
          </div>
        )}

        {status === 'exists' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>ℹ️</div>
            <h3 style={{ color: '#3b82f6', margin: '0 0 12px 0' }}>Already Exists</h3>
            <p style={{ color: '#4a5568', fontSize: '14px' }}>
              {error}
            </p>
            <p style={{ color: '#718096', fontSize: '13px', marginTop: '8px' }}>
              Redirecting to login...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '20px 0' }}>
            <div className="admin-login-error">
              <span>⚠️ {error}</span>
            </div>
            <button 
              onClick={createAdmin}
              className="admin-login-btn"
              style={{ width: '100%', marginTop: '20px' }}
            >
              🔄 Try Again
            </button>
          </div>
        )}

        <div className="admin-login-footer" style={{ marginTop: '30px' }}>
          <p>
            <a href="/admin/login" style={{ color: '#667eea', fontWeight: '600' }}>
              Go to Login
            </a>
            {' | '}
            <a href="/admin/register" style={{ color: '#667eea', fontWeight: '600' }}>
              Manual Registration
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickAdminSetup;
