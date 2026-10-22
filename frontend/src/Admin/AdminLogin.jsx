import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const navigate = useNavigate();

  // Secret access key - change this to your own secret
  const SECRET_ACCESS_KEY = 'ALOWEDA_SECURE_2024';

  useEffect(() => {
    // Check if URL has secret access key
    const accessKey = searchParams.get('key');
    const storedAccess = sessionStorage.getItem('adminAccess');
    
    if (accessKey === SECRET_ACCESS_KEY || storedAccess === 'granted') {
      setAccessGranted(true);
      sessionStorage.setItem('adminAccess', 'granted');
    } else {
      setAccessGranted(false);
    }
  }, [searchParams]);

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

  // If no access granted, show access denied page
  if (!accessGranted) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
          <h1 style={{ color: '#ef4444', marginBottom: '12px' }}>Access Denied</h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            This area is restricted to authorized personnel only.
          </p>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            If you are an administrator, please use the secure access link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Aloweda Administration Panel</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aloweda.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Secure admin access only</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
