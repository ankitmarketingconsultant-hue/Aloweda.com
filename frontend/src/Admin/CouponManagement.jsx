import { useState, useEffect } from 'react';
import './CouponManagement.css';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    discount: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '',
    isActive: true
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/coupon`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setCoupons(data.coupons);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingCoupon 
        ? `${API_URL}/api/coupon/${editingCoupon._id}`
        : `${API_URL}/api/coupon`;
      
      const response = await fetch(url, {
        method: editingCoupon ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          usageLimit: formData.usageLimit || null,
          maxDiscount: formData.maxDiscount || null
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchCoupons();
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/coupon/${coupon._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !coupon.isActive })
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/coupon/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      type: coupon.type,
      discount: coupon.discount,
      minOrderValue: coupon.minOrderValue || '',
      maxDiscount: coupon.maxDiscount || '',
      usageLimit: coupon.usageLimit || '',
      validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
      validTo: new Date(coupon.validTo).toISOString().split('T')[0],
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      type: 'percentage',
      discount: '',
      minOrderValue: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: new Date().toISOString().split('T')[0],
      validTo: '',
      isActive: true
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isExpired = (date) => new Date(date) < new Date();

  if (loading) {
    return (
      <div className="coupon-loading">
        <div className="spinner"></div>
        <p>Loading coupons...</p>
      </div>
    );
  }

  return (
    <div className="coupon-management">
      <div className="coupon-header">
        <div>
          <h2>🎫 Coupon Management</h2>
          <p className="coupon-subtitle">Create and manage discount coupons</p>
        </div>
        <button className="create-coupon-btn" onClick={() => { resetForm(); setShowModal(true); }}>
          ➕ Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="coupon-stats">
        <div className="stat-box">
          <h3>{coupons.length}</h3>
          <p>Total Coupons</p>
        </div>
        <div className="stat-box active">
          <h3>{coupons.filter(c => c.isActive).length}</h3>
          <p>Active</p>
        </div>
        <div className="stat-box">
          <h3>{coupons.filter(c => isExpired(c.validTo)).length}</h3>
          <p>Expired</p>
        </div>
        <div className="stat-box">
          <h3>{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</h3>
          <p>Total Uses</p>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="coupons-grid">
        {coupons.map(coupon => (
          <div key={coupon._id} className={`coupon-card ${!coupon.isActive ? 'inactive' : ''} ${isExpired(coupon.validTo) ? 'expired' : ''}`}>
            <div className="coupon-header-card">
              <div className="coupon-code">{coupon.code}</div>
              <div className="coupon-status">
                {!coupon.isActive && <span className="badge inactive">Inactive</span>}
                {isExpired(coupon.validTo) && <span className="badge expired">Expired</span>}
                {coupon.isActive && !isExpired(coupon.validTo) && <span className="badge active">Active</span>}
              </div>
            </div>

            <div className="coupon-discount">
              {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
            </div>

            {coupon.description && <p className="coupon-description">{coupon.description}</p>}

            <div className="coupon-details">
              <div className="detail-row">
                <span>Min Order:</span>
                <strong>₹{coupon.minOrderValue || 0}</strong>
              </div>
              {coupon.maxDiscount && (
                <div className="detail-row">
                  <span>Max Discount:</span>
                  <strong>₹{coupon.maxDiscount}</strong>
                </div>
              )}
              <div className="detail-row">
                <span>Usage:</span>
                <strong>{coupon.usedCount} / {coupon.usageLimit || '∞'}</strong>
              </div>
              <div className="detail-row">
                <span>Valid Until:</span>
                <strong>{formatDate(coupon.validTo)}</strong>
              </div>
            </div>

            <div className="coupon-actions">
              <button className="btn-edit" onClick={() => handleEdit(coupon)}>✏️ Edit</button>
              <button 
                className={`btn-toggle ${coupon.isActive ? 'active' : ''}`}
                onClick={() => handleToggleActive(coupon)}
              >
                {coupon.isActive ? '👁️ Hide' : '👁️‍🗨️ Show'}
              </button>
              <button className="btn-delete" onClick={() => handleDelete(coupon._id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="no-coupons">
          <p>🎫 No coupons yet. Create your first coupon!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="coupon-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="e.g., SUMMER50"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe this coupon..."
                  rows="2"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount {formData.type === 'percentage' ? '(%)' : '(₹)'} *</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    placeholder={formData.type === 'percentage' ? '10' : '100'}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
                <div className="form-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valid From *</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valid Until *</label>
                  <input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <span>Active (visible to customers)</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
