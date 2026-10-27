import { useState, useEffect } from 'react';
import './UsersManagement.css';

const UsersManagement = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUserAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUserAnalytics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_URL}/api/admin/users/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch user analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit' // Show seconds
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return 'Active';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDateShort = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="users-loading">
        <div className="spinner"></div>
        <p>Loading user analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-error">
        <p>⚠️ {error}</p>
        <button onClick={fetchUserAnalytics}>Retry</button>
      </div>
    );
  }

  return (
    <div className="users-management">
      <div className="users-header">
        <h2>👥 User Analytics & Activity</h2>
        <button className="refresh-btn" onClick={fetchUserAnalytics}>
          🔄 Refresh
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-cards">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{analytics?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✨</div>
          <div className="stat-content">
            <h3>{analytics?.usersToday || 0}</h3>
            <p>Logins Today</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{analytics?.usersThisWeek || 0}</h3>
            <p>This Week</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{analytics?.usersThisMonth || 0}</h3>
            <p>This Month</p>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{analytics?.activeUsers || 0}</h3>
            <p>Active (7 days)</p>
          </div>
        </div>

        <div className="stat-card admin">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <h3>{analytics?.adminUsers || 0}</h3>
            <p>Admins</p>
          </div>
        </div>
      </div>

      {/* Top Active Users */}
      {analytics?.topActiveUsers && analytics.topActiveUsers.length > 0 && (
        <div className="top-users-section">
          <h3>🏆 Most Active Users</h3>
          <div className="top-users-grid">
            {analytics.topActiveUsers.map((user, index) => (
              <div key={user.id} className="top-user-card">
                <div className="top-user-rank">#{index + 1}</div>
                <div className="top-user-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <div className="top-user-stats">
                    <span>🔐 {user.loginCount} logins</span>
                    <span>📅 {formatDateShort(user.lastLogin)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Signups Chart */}
      {analytics?.dailySignups && (
        <div className="chart-section">
          <h3>📈 Daily Signups (Last 30 Days)</h3>
          <div className="signup-chart">
            {Object.entries(analytics.dailySignups).map(([date, count]) => (
              <div key={date} className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ 
                    height: `${Math.max(count * 20, 5)}px`,
                    backgroundColor: count > 0 ? '#2d5f3f' : '#e5e7eb'
                  }}
                  title={`${date}: ${count} users`}
                >
                  {count > 0 && <span className="bar-label">{count}</span>}
                </div>
                <div className="chart-label">
                  {new Date(date).getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-table-section">
        <div className="table-header">
          <h3>📋 All Users ({filteredUsers.length})</h3>
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Signup Date</th>
                <th>Last Login</th>
                <th>Login Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-name-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td>{formatDateShort(user.signupDate)}</td>
                  <td>{formatDateShort(user.lastLogin)}</td>
                  <td>
                    <span className="login-count">{user.loginCount || 0}</span>
                  </td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedUser(user)}
                    >
                      👁️ Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Activity Details</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="user-detail-section">
                <div className="user-detail-avatar">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-detail-info">
                  <h4>{selectedUser.name}</h4>
                  <p>{selectedUser.email}</p>
                  <span className={`role-badge ${selectedUser.role}`}>
                    {selectedUser.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                </div>
              </div>

              <div className="user-stats-grid">
                <div className="user-stat">
                  <span className="stat-label">Signup Date</span>
                  <span className="stat-value">{formatDate(selectedUser.signupDate)}</span>
                </div>
                <div className="user-stat">
                  <span className="stat-label">Last Login</span>
                  <span className="stat-value">{formatDate(selectedUser.lastLogin)}</span>
                </div>
                <div className="user-stat">
                  <span className="stat-label">Total Logins</span>
                  <span className="stat-value">{selectedUser.loginCount || 0}</span>
                </div>
                <div className="user-stat">
                  <span className="stat-label">Phone</span>
                  <span className="stat-value">{selectedUser.phone || 'Not provided'}</span>
                </div>
              </div>

              {selectedUser.recentLogins && selectedUser.recentLogins.length > 0 && (
                <div className="login-history-section">
                  <h4>🕒 Recent Login History</h4>
                  <div className="login-history-list">
                    {selectedUser.recentLogins.map((login, index) => (
                      <div key={index} className="login-history-item">
                        <div className="login-time">
                          {formatDate(login.timestamp)}
                        </div>
                        <div className="login-details">
                          <span className="login-ip">🌐 {login.ipAddress || 'Unknown IP'}</span>
                          <span className="login-device">💻 {login.userAgent || 'Unknown device'}</span>
                          <span className="login-duration">
                            ⏱️ Session: {formatDuration(login.sessionDuration)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
