import { useState, useEffect } from 'react';
import './MarketingAnalytics.css';

const MarketingAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    leads: 0,
    conversions: 0,
    conversionRate: 0,
    topPages: [],
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('today'); // today, week, month

  useEffect(() => {
    fetchMarketingAnalytics();
  }, [timeframe]);

  const fetchMarketingAnalytics = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - Replace with real backend endpoint
      // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // const token = localStorage.getItem('token');
      // const response = await fetch(`${API_URL}/api/admin/marketing/analytics?timeframe=${timeframe}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockData = {
          pageViews: 1847,
          uniqueVisitors: 892,
          leads: 34,
          conversions: 12,
          conversionRate: 1.35,
          bounceRate: 42.5,
          avgSessionDuration: '3m 24s',
          topPages: [
            { page: '/products', views: 456, conversions: 8 },
            { page: '/', views: 389, conversions: 2 },
            { page: '/cart', views: 234, conversions: 12 },
            { page: '/about', views: 178, conversions: 0 },
            { page: '/contact', views: 145, conversions: 5 }
          ],
          trafficSources: [
            { source: 'Direct', visitors: 423, percentage: 47.4 },
            { source: 'Facebook', visitors: 245, percentage: 27.5 },
            { source: 'Google', visitors: 156, percentage: 17.5 },
            { source: 'Instagram', visitors: 68, percentage: 7.6 }
          ],
          recentEvents: [
            { type: 'Purchase', time: '2 mins ago', value: '₹1,249', user: 'guest@example.com' },
            { type: 'AddToCart', time: '5 mins ago', value: '₹649', user: 'user@gmail.com' },
            { type: 'Lead', time: '12 mins ago', value: 'Newsletter signup', user: 'new@user.com' },
            { type: 'ViewContent', time: '15 mins ago', value: 'Super Glow Serum', user: 'visitor@site.com' },
            { type: 'Purchase', time: '23 mins ago', value: '₹899', user: 'customer@email.com' }
          ],
          dailyTrend: generateDailyTrend()
        };
        
        setAnalytics(mockData);
        setLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Error fetching marketing analytics:', error);
      setLoading(false);
    }
  };

  const generateDailyTrend = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        views: Math.floor(Math.random() * 300) + 100,
        conversions: Math.floor(Math.random() * 15) + 1
      });
    }
    return days;
  };

  if (loading) {
    return (
      <div className="marketing-loading">
        <div className="spinner"></div>
        <p>Loading marketing analytics...</p>
      </div>
    );
  }

  return (
    <div className="marketing-analytics">
      <div className="marketing-header">
        <div>
          <h2>📊 Marketing & Conversion Analytics</h2>
          <p className="marketing-subtitle">Facebook Pixel tracking & conversion data</p>
        </div>
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'today' ? 'active' : ''}
            onClick={() => setTimeframe('today')}
          >
            Today
          </button>
          <button 
            className={timeframe === 'week' ? 'active' : ''}
            onClick={() => setTimeframe('week')}
          >
            This Week
          </button>
          <button 
            className={timeframe === 'month' ? 'active' : ''}
            onClick={() => setTimeframe('month')}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">👁️</div>
          <div className="metric-content">
            <h3>{analytics.pageViews.toLocaleString()}</h3>
            <p>Page Views</p>
            <span className="metric-change positive">+12.5% vs yesterday</span>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{analytics.uniqueVisitors.toLocaleString()}</h3>
            <p>Unique Visitors</p>
            <span className="metric-change positive">+8.3% vs yesterday</span>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">📧</div>
          <div className="metric-content">
            <h3>{analytics.leads}</h3>
            <p>Leads Generated</p>
            <span className="metric-change positive">+5 today</span>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">🛒</div>
          <div className="metric-content">
            <h3>{analytics.conversions}</h3>
            <p>Conversions</p>
            <span className="metric-change neutral">{analytics.conversionRate}% rate</span>
          </div>
        </div>

        <div className="metric-card bounce">
          <div className="metric-icon">↩️</div>
          <div className="metric-content">
            <h3>{analytics.bounceRate}%</h3>
            <p>Bounce Rate</p>
            <span className="metric-change negative">+2.1% vs yesterday</span>
          </div>
        </div>

        <div className="metric-card duration">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>{analytics.avgSessionDuration}</h3>
            <p>Avg Session</p>
            <span className="metric-change positive">+15s vs yesterday</span>
          </div>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="chart-section">
        <h3>📈 7-Day Trend</h3>
        <div className="trend-chart">
          {analytics.dailyTrend?.map((day, index) => (
            <div key={index} className="trend-bar-group">
              <div className="trend-bars">
                <div 
                  className="trend-bar views"
                  style={{ height: `${(day.views / 400) * 100}%` }}
                  title={`${day.views} views`}
                />
                <div 
                  className="trend-bar conversions"
                  style={{ height: `${(day.conversions / 15) * 100}%` }}
                  title={`${day.conversions} conversions`}
                />
              </div>
              <div className="trend-label">{day.date}</div>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span><span className="legend-dot views"></span> Page Views</span>
          <span><span className="legend-dot conversions"></span> Conversions</span>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Top Pages */}
        <div className="analytics-card">
          <h3>🔥 Top Performing Pages</h3>
          <div className="top-pages-list">
            {analytics.topPages?.map((page, index) => (
              <div key={index} className="page-item">
                <div className="page-info">
                  <span className="page-rank">#{index + 1}</span>
                  <div>
                    <div className="page-path">{page.page}</div>
                    <div className="page-stats">
                      {page.views} views • {page.conversions} conversions
                    </div>
                  </div>
                </div>
                <div className="page-bar">
                  <div 
                    className="page-bar-fill"
                    style={{ width: `${(page.views / analytics.topPages[0].views) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="analytics-card">
          <h3>🌐 Traffic Sources</h3>
          <div className="traffic-sources">
            {analytics.trafficSources?.map((source, index) => (
              <div key={index} className="traffic-item">
                <div className="traffic-header">
                  <span className="traffic-source">{source.source}</span>
                  <span className="traffic-percentage">{source.percentage}%</span>
                </div>
                <div className="traffic-bar">
                  <div 
                    className="traffic-bar-fill"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <div className="traffic-count">{source.visitors} visitors</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="recent-events-section">
        <h3>🔴 Real-Time Events</h3>
        <div className="events-list">
          {analytics.recentEvents?.map((event, index) => (
            <div key={index} className="event-item">
              <div className={`event-badge ${event.type.toLowerCase()}`}>
                {event.type === 'Purchase' && '🛍️'}
                {event.type === 'AddToCart' && '🛒'}
                {event.type === 'Lead' && '📧'}
                {event.type === 'ViewContent' && '👁️'}
              </div>
              <div className="event-details">
                <div className="event-type">{event.type}</div>
                <div className="event-value">{event.value}</div>
              </div>
              <div className="event-meta">
                <div className="event-user">{event.user}</div>
                <div className="event-time">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facebook Pixel Info */}
      <div className="pixel-info-card">
        <div className="pixel-status">
          <span className="status-dot active"></span>
          <div>
            <h4>Facebook Pixel Active</h4>
            <p>Pixel ID: 1130650692951273</p>
          </div>
        </div>
        <div className="pixel-actions">
          <button className="pixel-btn">📊 View in Facebook</button>
          <button className="pixel-btn">🔄 Refresh Data</button>
        </div>
      </div>
    </div>
  );
};

export default MarketingAnalytics;
