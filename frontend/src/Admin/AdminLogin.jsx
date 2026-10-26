import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check rate limiting
    const lastAttempt = localStorage.getItem('lastLoginAttempt');
    const attemptCount = parseInt(localStorage.getItem('loginAttempts') || '0');
    
    if (attemptCount >= 5 && lastAttempt) {
      const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt);
      if (timeSinceLastAttempt < 15 * 60 * 1000) { // 15 minutes
        setError('Too many login attempts. Please try again later.');
        setLoading(false);
        return;
      } else {
        // Reset after 15 minutes
        localStorage.setItem('loginAttempts', '0');
      }
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Check if user is admin
        const userResponse = await fetch(`${API_URL}/api/profile`, {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });

        const userData = await userResponse.json();

        if (userData.user && userData.user.role === 'admin') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userRole', 'admin');
          localStorage.setItem('userName', userData.user.name);
          localStorage.setItem('loginAttempts', '0'); // Reset on success
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
          // Increment failed attempts
          localStorage.setItem('loginAttempts', (attemptCount + 1).toString());
          localStorage.setItem('lastLoginAttempt', Date.now().toString());
        }
      } else {
        setError(data.message || 'Login failed');
        // Increment failed attempts
        localStorage.setItem('loginAttempts', (attemptCount + 1).toString());
        localStorage.setItem('lastLoginAttempt', Date.now().toString());
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#6b7280', marginBottom: '8px' }}>Direct Admin Access</h2>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            Please use the main website login for admin access
          </p>
        </div>
        
        <div style={{ 
          background: '#f3f4f6', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
            <strong>For Admin Login:</strong>
          </p>
          <ol style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            paddingLeft: '20px',
            margin: 0,
            lineHeight: '1.8'
          }}>
            <li>Go to main website</li>
            <li>Click "Login" in navigation</li>
            <li>Enter admin email and password</li>
            <li>You'll be automatically redirected here</li>
          </ol>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          style={{
            width: '100%',
            padding: '12px',
            background: '#2d5f3f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Go to Main Website
        </button>

        <div style={{ 
          marginTop: '24px', 
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fbbf24'
        }}>
          <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
            💡 <strong>Note:</strong> Direct admin panel access has been disabled for security. 
            Admin users are automatically redirected from the main login page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
