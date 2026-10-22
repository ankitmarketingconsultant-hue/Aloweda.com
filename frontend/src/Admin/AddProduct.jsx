import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'cream',
    price: '',
    mrp: '',
    stock: '100',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/bundles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          mrp: parseFloat(formData.mrp),
          stock: parseInt(formData.stock),
          description: formData.description
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Product added successfully!');
        // Reset form
        setFormData({
          name: '',
          category: 'cream',
          price: '',
          mrp: '',
          stock: '100',
          description: ''
        });
      } else {
        setError(data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container" style={{ paddingTop: '40px' }}>
      <div className="admin-login-box" style={{ maxWidth: '600px' }}>
        <div className="admin-login-header">
          <h1>Add New Product</h1>
          <p>Manually add a product to database</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="The Day Cream 50G"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
              style={{ 
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '15px',
                width: '100%'
              }}
            >
              <option value="cream">Cream</option>
              <option value="serum">Serum</option>
              <option value="oil">Oil</option>
              <option value="facewash">Face Wash</option>
              <option value="haircare">Hair Care</option>
              <option value="lipcare">Lip Care</option>
              <option value="combo">Combo</option>
              <option value="tattoo">Tattoo Care</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                required
                disabled={loading}
                min="0"
                step="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mrp">MRP (₹) *</label>
              <input
                type="number"
                id="mrp"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                placeholder="549"
                required
                disabled={loading}
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="100"
              required
              disabled={loading}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description..."
              required
              disabled={loading}
              rows="4"
              style={{
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '15px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="submit" 
              className="admin-login-btn"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Adding...' : '✅ Add Product'}
            </button>
            
            <button 
              type="button"
              onClick={() => navigate('/admin/products')}
              className="admin-login-btn"
              disabled={loading}
              style={{ flex: 1, background: '#6b7280' }}
            >
              ← Back to Products
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
