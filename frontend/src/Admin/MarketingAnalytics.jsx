import { useState, useEffect } from 'react';
import './MarketingAnalytics.css';

const PIXEL_ID = '1130650692951273';

const EVENT_ICONS = {
  PageView:        '👁️',
  ViewContent:     '📄',
  AddToCart:       '🛒',
  Purchase:        '🛍️',
  InitiateCheckout:'💳',
  AddPaymentInfo:  '💰',
  Lead:            '📧',
  Search:          '🔍',
};

const MarketingAnalytics = () => {
  const [events, setEvents]         = useState([]);
  const [daily, setDaily]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [timeframe, setTimeframe]   = useState('28'); // days
  const [pixelInfo, setPixelInfo]   = useState({ since: '', until: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [eventsRes, dailyRes] = await Promise.all([
        fetch(`${API_URL}/api/meta-insights/events?days=${timeframe}`, { headers }),
        fetch(`${API_URL}/api/meta-insights/daily?days=7`, { headers }),
      ]);

      const eventsData = await eventsRes.json();
      const dailyData  = await dailyRes.json();

      if (!eventsData.success) {
        setError(eventsData.message || 'Failed to fetch Meta data');
        return;
      }

      // Convert events object to sorted array
      const eventsArr = Object.entries(eventsData.events || {})
        .map(([name, d]) => ({ name, count: d.count, lastReceived: d.lastReceived }))
        .sort((a, b) => b.count - a.count);

      setEvents(eventsArr);
      setPixelInfo({ since: eventsData.since, until: eventsData.until });

      if (dailyData.success) {
        setDaily(dailyData.daily || []);
      }
    } catch (err) {
      setError('Could not connect to Meta API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Derived totals
  const pageViews   = events.find(e => e.name === 'PageView')?.count || 0;
  const purchases   = events.find(e => e.name === 'Purchase')?.count || 0;
  const addToCart   = events.find(e => e.name === 'AddToCart')?.count || 0;
  const viewContent = events.find(e => e.name === 'ViewContent')?.count || 0;
  const checkouts   = events.find(e => e.name === 'InitiateCheckout')?.count || 0;
  const convRate    = pageViews > 0 ? ((purchases / pageViews) * 100).toFixed(2) : '0.00';

  if (loading) {
    return (
      <div className="marketing-loading">
        <div className="spinner"></div>
        <p>Loading Meta Pixel data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketing-analytics">
        <div className="marketing-header">
          <div>
            <h2>📊 Marketing & Conversion Analytics</h2>
            <p className="marketing-subtitle">Facebook Pixel · ID: {PIXEL_ID}</p>
          </div>
        </div>
        <div className="error-state" style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 24, marginTop: 16 }}>
          <p style={{ color: '#dc2626', marginBottom: 12 }}>⚠️ {error}</p>
          {error.includes('META_ACCESS_TOKEN') && (
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              Add <strong>META_ACCESS_TOKEN</strong> in Vercel backend environment variables.<br />
              Get it from: Meta Business Suite → Settings → System Users → Generate Token
            </p>
          )}
          <button onClick={fetchData} style={{ marginTop: 12, padding: '8px 16px', background: '#1f4d3d', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="marketing-analytics">
      <div className="marketing-header">
        <div>
          <h2>📊 Marketing & Conversion Analytics</h2>
          <p className="marketing-subtitle">
            Facebook Pixel · ID: {PIXEL_ID} · {pixelInfo.since} → {pixelInfo.until}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="timeframe-selector">
            {[['7','7 Days'],['14','14 Days'],['28','28 Days']].map(([val, label]) => (
              <button key={val} className={timeframe === val ? 'active' : ''} onClick={() => setTimeframe(val)}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={fetchData} style={{ padding: '8px 14px', background: '#1f4d3d', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">👁️</div>
          <div className="metric-content">
            <h3>{pageViews.toLocaleString()}</h3>
            <p>Page Views</p>
          </div>
        </div>
        <div className="metric-card success">
          <div className="metric-icon">📄</div>
          <div className="metric-content">
            <h3>{viewContent.toLocaleString()}</h3>
            <p>View Content</p>
          </div>
        </div>
        <div className="metric-card warning">
          <div className="metric-icon">🛒</div>
          <div className="metric-content">
            <h3>{addToCart.toLocaleString()}</h3>
            <p>Add to Cart</p>
          </div>
        </div>
        <div className="metric-card info">
          <div className="metric-icon">💳</div>
          <div className="metric-content">
            <h3>{checkouts.toLocaleString()}</h3>
            <p>Initiate Checkout</p>
          </div>
        </div>
        <div className="metric-card bounce">
          <div className="metric-icon">🛍️</div>
          <div className="metric-content">
            <h3>{purchases.toLocaleString()}</h3>
            <p>Purchases</p>
          </div>
        </div>
        <div className="metric-card duration">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{convRate}%</h3>
            <p>Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* All Events Table */}
      <div className="section-header" style={{ marginTop: 32 }}>
        <h3>All Pixel Events</h3>
        <p>Total events tracked in selected period</p>
      </div>
      <div className="product-sales-table-container">
        <table className="product-sales-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Total Count</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: 24, color: '#6b7280' }}>No events found for this period</td></tr>
            ) : events.map((ev, i) => (
              <tr key={i}>
                <td>
                  <span style={{ marginRight: 8 }}>{EVENT_ICONS[ev.name] || '📊'}</span>
                  <strong>{ev.name}</strong>
                </td>
                <td>
                  <span className="quantity-badge">{ev.count?.toLocaleString()}</span>
                </td>
                <td>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>● Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Facebook Pixel Status */}
      <div className="pixel-info-card" style={{ marginTop: 24 }}>
        <div className="pixel-status">
          <span className="status-dot active"></span>
          <div>
            <h4>Facebook Pixel Active</h4>
            <p>Pixel ID: {PIXEL_ID} · Data from Meta Graph API v21.0</p>
          </div>
        </div>
        <div className="pixel-actions">
          <a
            href={`https://business.facebook.com/events_manager2/list/pixel/${PIXEL_ID}/overview`}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn"
            style={{ textDecoration: 'none' }}
          >
            📊 View in Meta
          </a>
          <button className="pixel-btn" onClick={fetchData}>🔄 Refresh Data</button>
        </div>
      </div>
    </div>
  );
};

export default MarketingAnalytics;
