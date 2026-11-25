import { useState, useEffect, useRef } from 'react';
import './MarketingAnalytics.css';

const MarketingAnalytics = () => {
  const [summary, setSummary]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [days, setDays]           = useState('30');
  const realtimeRef               = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, [days]);

  // Auto-refresh realtime count every 30s
  useEffect(() => {
    realtimeRef.current = setInterval(() => {
      fetchRealtime();
    }, 30000);
    return () => clearInterval(realtimeRef.current);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/site-analytics/summary?days=${days}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || 'Failed to fetch'); return; }
      setSummary(data.summary);
    } catch (err) {
      setError('Could not load analytics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtime = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/site-analytics/summary?days=1`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSummary(prev => prev ? { ...prev, realtimeViewers: data.summary.realtimeViewers } : prev);
      }
    } catch (_) {}
  };

  const maxViews = summary?.dailyData?.length
    ? Math.max(...summary.dailyData.map(d => d.views), 1)
    : 1;

  if (loading) return (
    <div className="marketing-loading">
      <div className="spinner"></div>
      <p>Loading website analytics...</p>
    </div>
  );

  if (error) return (
    <div className="marketing-analytics">
      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 24, marginTop: 16 }}>
        <p style={{ color: '#dc2626' }}>⚠️ {error}</p>
        <button onClick={fetchData} style={{ marginTop: 12, padding: '8px 16px', background: '#1f4d3d', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          🔄 Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="marketing-analytics">
      {/* Header */}
      <div className="marketing-header">
        <div>
          <h2>📊 Website Analytics</h2>
          <p className="marketing-subtitle">Real-time visitor tracking — independent, no third-party</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="timeframe-selector">
            {[['7','7 Days'],['14','14 Days'],['30','30 Days'],['90','90 Days']].map(([val, label]) => (
              <button key={val} className={days === val ? 'active' : ''} onClick={() => setDays(val)}>{label}</button>
            ))}
          </div>
          <button onClick={fetchData} style={{ padding: '8px 14px', background: '#1f4d3d', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary" style={{ position: 'relative' }}>
          <div className="metric-icon">🟢</div>
          <div className="metric-content">
            <h3>{summary?.realtimeViewers ?? 0}</h3>
            <p>Live Visitors (last 30 min)</p>
          </div>
          <span style={{ position: 'absolute', top: 10, right: 12, fontSize: 10, color: '#10b981', fontWeight: 700 }}>LIVE</span>
        </div>
        <div className="metric-card success">
          <div className="metric-icon">👁️</div>
          <div className="metric-content">
            <h3>{summary?.todayViews?.toLocaleString() ?? 0}</h3>
            <p>Today's Page Views</p>
          </div>
        </div>
        <div className="metric-card warning">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{summary?.todayVisitors?.toLocaleString() ?? 0}</h3>
            <p>Today's Visitors</p>
          </div>
        </div>
        <div className="metric-card info">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{summary?.totalPageViews?.toLocaleString() ?? 0}</h3>
            <p>Total Page Views ({days}d)</p>
          </div>
        </div>
        <div className="metric-card bounce">
          <div className="metric-icon">🧑‍💻</div>
          <div className="metric-content">
            <h3>{summary?.uniqueVisitors?.toLocaleString() ?? 0}</h3>
            <p>Unique Visitors ({days}d)</p>
          </div>
        </div>
        <div className="metric-card duration">
          <div className="metric-icon">📄</div>
          <div className="metric-content">
            <h3>
              {summary?.uniqueVisitors > 0
                ? (summary.totalPageViews / summary.uniqueVisitors).toFixed(1)
                : '0'}
            </h3>
            <p>Pages / Visitor</p>
          </div>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="chart-section" style={{ marginTop: 24 }}>
        <h3>📈 Daily Traffic ({days} Days)</h3>
        {summary?.dailyData?.length === 0 ? (
          <p style={{ color: '#6b7280', padding: '20px 0' }}>No data yet — visitors will appear here as they browse the site.</p>
        ) : (
          <>
            <div className="trend-chart" style={{ alignItems: 'flex-end', minHeight: 120 }}>
              {(summary?.dailyData || []).map((day, i) => (
                <div key={i} className="trend-bar-group" style={{ flex: 1, minWidth: 0 }}>
                  <div className="trend-bars" style={{ height: 100 }}>
                    <div
                      className="trend-bar views"
                      style={{ height: `${Math.round((day.views / maxViews) * 100)}%`, minHeight: day.views > 0 ? 4 : 0 }}
                      title={`${day.views} views`}
                    />
                    <div
                      className="trend-bar conversions"
                      style={{ height: `${Math.round((day.visitors / maxViews) * 100)}%`, minHeight: day.visitors > 0 ? 4 : 0 }}
                      title={`${day.visitors} visitors`}
                    />
                  </div>
                  <div className="trend-label" style={{ fontSize: 10 }}>{day.date?.slice(5)}</div>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <span><span className="legend-dot views"></span> Page Views</span>
              <span><span className="legend-dot conversions"></span> Visitors</span>
            </div>
          </>
        )}
      </div>

      <div className="analytics-grid" style={{ marginTop: 24 }}>
        {/* Top Pages */}
        <div className="analytics-card">
          <h3>🔥 Top Pages</h3>
          {summary?.topPages?.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 14 }}>No data yet</p>
          ) : (
            <div className="top-pages-list">
              {(summary?.topPages || []).map((p, i) => (
                <div key={i} className="page-item">
                  <div className="page-info">
                    <span className="page-rank">#{i + 1}</span>
                    <div>
                      <div className="page-path">{p.page || '/'}</div>
                      <div className="page-stats">{p.views} views</div>
                    </div>
                  </div>
                  <div className="page-bar">
                    <div className="page-bar-fill" style={{ width: `${Math.round((p.views / (summary.topPages[0]?.views || 1)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="analytics-card">
          <h3>🌐 Traffic Sources (UTM)</h3>
          {summary?.topSources?.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 14 }}>No UTM traffic yet — add UTM params to your ads.</p>
          ) : (
            <div className="traffic-sources">
              {(summary?.topSources || []).map((s, i) => {
                const total = summary.topSources.reduce((a, x) => a + x.visits, 0);
                const pct = total > 0 ? Math.round((s.visits / total) * 100) : 0;
                return (
                  <div key={i} className="traffic-item">
                    <div className="traffic-header">
                      <span className="traffic-source">
                        {s.source?.includes('facebook') ? '📘 ' : s.source?.includes('instagram') ? '📸 ' : s.source?.includes('google') ? '🔍 ' : '🌐 '}
                        {s.source}
                      </span>
                      <span className="traffic-percentage">{pct}%</span>
                    </div>
                    <div className="traffic-bar">
                      <div className="traffic-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="traffic-count">{s.visits} visits</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingAnalytics;
