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
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Upload image first if provided
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          imageUrl = uploadData.imageUrl;
        } else {
          throw new Error('Image upload failed');
        }
      }
      
      const response = await fetch(`${API_URL}/api/admin/products`, {
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
          description: formData.description,
          image: imageUrl || formData.image,
          isActive: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Product added successfully!');
        // Navigate back to products page
        navigate('/admin/products');
      } else {
        setError(data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Server error. Please try again.');
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

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              style={{
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '15px',
                width: '100%',
                cursor: 'pointer'
              }}
            />
            <small style={{ color: '#6b7280', display: 'block', marginTop: '8px' }}>
              Or enter image URL below
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL (Optional)</label>
            <input
              type="url"
              id="imageUrl"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/product.jpg"
              disabled={loading}
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Image Preview:
              </label>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0'
                }} 
              />
            </div>
          )}

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
