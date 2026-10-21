import { useState, useEffect } from 'react';
import './SalesAnalytics.css';

const SalesAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="sales-analytics">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="sales-analytics">
        <div className="error-state">
          <span>⚠️ {error || 'No data available'}</span>
          <button onClick={fetchAnalytics} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { 
    totalSales, 
    totalOrders, 
    completedOrders, 
    pendingOrders, 
    cancelledOrders,
    ordersByStatus,
    productSales 
  } = analytics;

  const productSalesArray = Object.entries(productSales || {}).map(([name, data]) => ({
    name,
    quantity: data.quantity,
    revenue: data.revenue
  })).sort((a, b) => b.revenue - a.revenue);

  const averageOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;
  const successRate = totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0;

  return (
    <div className="sales-analytics">
      <div className="page-header">
        <div>
          <h2>Sales Analytics</h2>
          <p>Overview of your business performance</p>
        </div>
        <button className="refresh-btn" onClick={fetchAnalytics}>
          🔄 Refresh
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="main-stats-grid">
        <div className="stat-card-large primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">₹{totalSales?.toLocaleString() || 0}</div>
            <div className="stat-subtext">From all completed orders</div>
          </div>
        </div>

        <div className="stat-card-large success">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{totalOrders || 0}</div>
            <div className="stat-subtext">{completedOrders || 0} completed</div>
          </div>
        </div>

        <div className="stat-card-large info">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Average Order Value</div>
            <div className="stat-value">₹{averageOrderValue}</div>
            <div className="stat-subtext">Per order</div>
          </div>
        </div>

        <div className="stat-card-large warning">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Success Rate</div>
            <div className="stat-value">{successRate}%</div>
            <div className="stat-subtext">Order completion rate</div>
          </div>
        </div>
      </div>

      {/* Orders Status Overview */}
      <div className="section-header">
        <h3>Orders by Status</h3>
      </div>
      <div className="status-grid">
        <div className="status-card">
          <div className="status-icon pending">⏳</div>
          <div className="status-info">
            <div className="status-label">Pending</div>
            <div className="status-value">{pendingOrders || 0}</div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon processing">⚙️</div>
          <div className="status-info">
            <div className="status-label">Processing</div>
            <div className="status-value">{ordersByStatus?.processing || 0}</div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon shipped">🚚</div>
          <div className="status-info">
            <div className="status-label">Shipped</div>
            <div className="status-value">{ordersByStatus?.shipped || 0}</div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon delivered">✅</div>
          <div className="status-info">
            <div className="status-label">Delivered</div>
            <div className="status-value">{completedOrders || 0}</div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon cancelled">❌</div>
          <div className="status-info">
            <div className="status-label">Cancelled</div>
            <div className="status-value">{cancelledOrders || 0}</div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-icon refunded">💸</div>
          <div className="status-info">
            <div className="status-label">Refunded</div>
            <div className="status-value">{ordersByStatus?.refunded || 0}</div>
          </div>
        </div>
      </div>

      {/* Product Sales Table */}
      <div className="section-header">
        <h3>Product-wise Sales Performance</h3>
        <p>Top selling products by revenue</p>
      </div>
      
      {productSalesArray.length === 0 ? (
        <div className="no-data-card">
          <p>No product sales data available</p>
        </div>
      ) : (
        <div className="product-sales-table-container">
          <table className="product-sales-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {productSalesArray.map((product, index) => (
                <tr key={index}>
                  <td>
                    <div className="rank-badge">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </div>
                  </td>
                  <td>
                    <div className="product-name">{product.name}</div>
                  </td>
                  <td>
                    <div className="quantity-cell">
                      <span className="quantity-badge">{product.quantity} units</span>
                    </div>
                  </td>
                  <td>
                    <div className="revenue-cell">₹{product.revenue.toLocaleString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-section">
        <div className="summary-card">
          <h4>📈 Business Insights</h4>
          <ul>
            <li>Total revenue generated: <strong>₹{totalSales?.toLocaleString() || 0}</strong></li>
            <li>Total orders received: <strong>{totalOrders || 0}</strong></li>
            <li>Successfully delivered: <strong>{completedOrders || 0}</strong></li>
            <li>Pending fulfillment: <strong>{pendingOrders || 0}</strong></li>
            <li>Cancellation rate: <strong>{totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : 0}%</strong></li>
          </ul>
        </div>

        <div className="summary-card">
          <h4>🎯 Quick Actions</h4>
          <ul className="action-links">
            <li>• Review pending orders and update status</li>
            <li>• Check low stock products and reorder</li>
            <li>• Follow up on cancelled orders</li>
            <li>• Process refund requests</li>
            <li>• Update product prices based on demand</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
