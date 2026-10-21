import { useState, useEffect } from 'react';
import './OrdersManagement.css';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionModal, setActionModal] = useState({ show: false, type: '', orderId: '' });
  const [actionReason, setActionReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setOrders(orders.map(o => 
          o._id === orderId ? { ...o, status: newStatus } : o
        ));
        alert('Order status updated successfully!');
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setProcessing(false);
    }
  };

  const openActionModal = (type, orderId) => {
    setActionModal({ show: true, type, orderId });
    setActionReason('');
    setRefundAmount('');
  };

  const closeActionModal = () => {
    setActionModal({ show: false, type: '', orderId: '' });
    setActionReason('');
    setRefundAmount('');
  };

  const handleAction = async () => {
    const { type, orderId } = actionModal;

    if (!actionReason && type !== 'replace') {
      alert('Please provide a reason');
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      
      let endpoint = '';
      let body = {};

      switch (type) {
        case 'cancel':
          endpoint = `${API_URL}/api/admin/orders/${orderId}/cancel`;
          body = { reason: actionReason };
          break;
        case 'refund':
          endpoint = `${API_URL}/api/admin/orders/${orderId}/refund`;
          body = { reason: actionReason, refundAmount: refundAmount ? parseFloat(refundAmount) : undefined };
          break;
        case 'replace':
          endpoint = `${API_URL}/api/admin/orders/${orderId}/replace`;
          body = { reason: actionReason || 'Product replacement' };
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        await fetchOrders(); // Refresh orders
        closeActionModal();
        alert(`Order ${type}led successfully!`);
      } else {
        alert(data.message || `Failed to ${type} order`);
      }
    } catch (err) {
      console.error(`Error ${type}ing order:`, err);
      alert(`Failed to ${type} order`);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444',
      refunded: '#f97316',
      replaced: '#06b6d4',
    };
    return colors[status] || '#6b7280';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="orders-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-management">
      <div className="page-header">
        <div>
          <h2>Orders Management</h2>
          <p>View and manage all customer orders</p>
        </div>
        <button className="refresh-btn" onClick={fetchOrders}>
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-value">{orderStats.total}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>{orderStats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>{orderStats.delivered}</div>
          <div className="stat-label">Delivered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ef4444' }}>{orderStats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by customer name, email, or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
          <option value="replaced">Replaced</option>
        </select>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id-section">
                  <span className="order-label">Order ID:</span>
                  <span className="order-id">{order._id?.substring(0, 12)}...</span>
                </div>
                <span 
                  className="status-badge"
                  style={{ 
                    background: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status)
                  }}
                >
                  {order.status?.toUpperCase()}
                </span>
              </div>

              <div className="order-body">
                <div className="order-info-grid">
                  <div className="info-item">
                    <span className="info-label">Customer:</span>
                    <span className="info-value">{order.user?.name || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{order.user?.email || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{order.user?.phone || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Amount:</span>
                    <span className="info-value amount">₹{order.totalAmount || 0}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Payment Method:</span>
                    <span className="info-value">{order.paymentMethod || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="order-items">
                    <strong>Items:</strong>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} × {item.quantity} - ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {order.shippingAddress && (
                  <div className="shipping-address">
                    <strong>Shipping Address:</strong>
                    <p>
                      {order.shippingAddress.street}, {order.shippingAddress.city}, 
                      {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                )}
              </div>

              <div className="order-actions">
                <select
                  className="status-select"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={processing || order.status === 'delivered'}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>

                <button
                  className="action-btn cancel-btn"
                  onClick={() => openActionModal('cancel', order._id)}
                  disabled={processing || order.status === 'delivered' || order.status === 'cancelled'}
                >
                  ❌ Cancel
                </button>

                <button
                  className="action-btn refund-btn"
                  onClick={() => openActionModal('refund', order._id)}
                  disabled={processing || order.status === 'refunded'}
                >
                  💰 Refund
                </button>

                <button
                  className="action-btn replace-btn"
                  onClick={() => openActionModal('replace', order._id)}
                  disabled={processing || order.status === 'replaced'}
                >
                  🔄 Replace
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Modal */}
      {actionModal.show && (
        <div className="modal-overlay" onClick={closeActionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)} Order</h3>
              <button className="modal-close" onClick={closeActionModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Reason:</label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={`Enter reason for ${actionModal.type}...`}
                  rows="4"
                />
              </div>

              {actionModal.type === 'refund' && (
                <div className="form-group">
                  <label>Refund Amount (optional):</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="Leave empty for full refund"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={closeActionModal}>
                Cancel
              </button>
              <button 
                className="modal-btn confirm" 
                onClick={handleAction}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
