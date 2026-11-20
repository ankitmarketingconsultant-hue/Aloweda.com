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
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setUploadProgress('');

    try {
      const token = localStorage.getItem('token');

      // Upload all images to Cloudinary
      const uploadedUrls = [];
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadProgress(`Uploading image ${i + 1} of ${imageFiles.length}...`);
        const fd = new FormData();
        fd.append('image', imageFiles[i]);

        const uploadRes = await fetch(`${API_URL}/api/upload/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd,
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.imageUrl) {
          const url = uploadData.imageUrl.startsWith('http')
            ? uploadData.imageUrl
            : `${API_URL}${uploadData.imageUrl}`;
          uploadedUrls.push(url);
        } else {
          setError(`Image ${i + 1} upload failed: ${uploadData.message || 'Please try again'}`);
          setLoading(false);
          setUploadProgress('');
          return;
        }
      }

      setUploadProgress('Saving product...');

      const response = await fetch(`${API_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          mrp: parseFloat(formData.mrp),
          stock: parseInt(formData.stock),
          description: formData.description || formData.name,
          images: uploadedUrls,
          isActive: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Product added successfully!');
        navigate('/admin/products');
      } else {
        setError(data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress('');
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

        {uploadProgress && (
          <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', color: '#065f46', fontSize: '14px' }}>
            ⏳ {uploadProgress}
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
              style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '15px', width: '100%' }}
            >
              <option value="cream">Cream</option>
              <option value="serum">Serum</option>
              <option value="oil">Oil</option>
              <option value="facewash">Face Wash</option>
              <option value="moisturiser">Moisturiser</option>
              <option value="haircare">Hair Care</option>
              <option value="lipcare">Lip Care</option>
              <option value="combo">Combo / Skincare Rituals</option>
              <option value="tattoo">Tattoo Care</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="499" required disabled={loading} min="0" step="1" />
            </div>
            <div className="form-group">
              <label htmlFor="mrp">MRP (₹) *</label>
              <input type="number" id="mrp" name="mrp" value={formData.mrp} onChange={handleChange} placeholder="549" required disabled={loading} min="0" step="1" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} placeholder="100" required disabled={loading} min="0" />
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
              style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '15px', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          {/* Multiple Image Upload */}
          <div className="form-group">
            <label>Product Images (Optional)</label>

            {/* Previews with remove button */}
            {imagePreviews.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {imagePreviews.map((src, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px', border: '2px solid #6ee7b7', display: 'block' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      disabled={loading}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 20, height: 20, borderRadius: '50%',
                        background: '#ef4444', color: '#fff',
                        border: 'none', cursor: 'pointer',
                        fontSize: '11px', fontWeight: '700',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            <label
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', background: '#1f4d3d', color: '#fff',
                borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px', fontWeight: '600', opacity: loading ? 0.6 : 1,
              }}
            >
              📷 {imagePreviews.length > 0 ? 'Add More Images' : 'Choose Images'}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={loading}
                style={{ display: 'none' }}
              />
            </label>
            <small style={{ color: '#6b7280', display: 'block', marginTop: '6px' }}>
              Select one or more images (max 5MB each). You can add more later via Edit.
            </small>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="admin-login-btn" disabled={loading} style={{ flex: 1 }}>
              {loading ? (uploadProgress || 'Adding...') : '✅ Add Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="admin-login-btn" disabled={loading} style={{ flex: 1, background: '#6b7280' }}>
              ← Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
