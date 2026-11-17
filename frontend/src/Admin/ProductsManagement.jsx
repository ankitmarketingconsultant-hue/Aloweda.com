import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsManagement.css';

const CATEGORIES = [
  { value: 'all',      label: 'All' },
  { value: 'cream',    label: 'Cream' },
  { value: 'serum',    label: 'Serum' },
  { value: 'oil',      label: 'Oil' },
  { value: 'facewash', label: 'Face Wash' },
  { value: 'haircare', label: 'Hair Care' },
  { value: 'lipcare',  label: 'Lip Care' },
  { value: 'combo',    label: 'Combo' },
  { value: 'tattoo',   label: '🖊 Tattoo Care' },
];

const emptyEdit = { name: '', category: 'cream', price: '', mrp: '', stock: '', description: '', ingredients: '', howToUse: '', shippingReturns: '', images: '' };

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [searchTerm, setSearchTerm]     = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [updating, setUpdating]         = useState(false);

  // Edit modal state
  const [editModal, setEditModal]       = useState(false);
  const [editProduct, setEditProduct]   = useState(null);
  const [editForm, setEditForm]         = useState(emptyEdit);
  const [imageFiles, setImageFiles]     = useState([]);   // multiple new uploads
  const [imagePreviews, setImagePreviews] = useState([]); // previews for new uploads
  const [currentImages, setCurrentImages] = useState([]); // existing DB images (can remove individually)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/products`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleImportProducts = async () => {
    if (!confirm('Import sample products to database? This will add products if none exist.')) return;
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/api/import-products/init`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.success) {
        alert(`✅ ${data.count} products imported.`);
      } else {
        alert(`⚠️ ${data.message || 'Import failed'}`);
      }
      fetchProducts();
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
      fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  const handleAddTattooProducts = async () => {
    try {
      setUpdating(true);
      const response = await fetch(`${API_URL}/api/import-products/add-tattoo`, { method: 'POST' });
      const data = await response.json();
      alert(data.success ? `✅ ${data.message}` : `⚠️ ${data.message}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to add tattoo products');
    } finally {
      setUpdating(false);
    }
  };

  // ── Edit modal helpers ──────────────────────────────────────────────────
  // Normalize category value from DB to match select option values
  const normalizeCategoryValue = (cat) => {
    if (!cat) return 'cream';
    const map = {
      'cream':       'cream',
      'serum':       'serum',
      'oil':         'oil',
      'facewash':    'facewash',
      'face wash':   'facewash',
      'haircare':    'haircare',
      'hair care':   'haircare',
      'lipcare':     'lipcare',
      'lip care':    'lipcare',
      'combo':       'combo',
      'tattoo':      'tattoo',
      'tattoo care': 'tattoo',
    };
    return map[cat.toLowerCase()] || cat.toLowerCase();
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setEditForm({
      name:            product.name            || '',
      category:        normalizeCategoryValue(product.category),
      price:           product.price           ?? '',
      mrp:             product.mrp             ?? '',
      stock:           product.stock           ?? '',
      description:     product.description     || '',
      ingredients:     product.ingredients     || '',
      howToUse:        product.howToUse        || '',
      shippingReturns: product.shippingReturns || '',
      images:          (product.images || []).join(', '),
    });
    setCurrentImages(product.images || []);
    setImageFiles([]);
    setImagePreviews([]);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setEditProduct(null);
    setEditForm(emptyEdit);
    setCurrentImages([]);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Handle multiple image file selection
  const handleEditImageFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  // Remove an existing DB image
  const removeCurrentImage = (idx) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Remove a newly selected (not yet uploaded) image
  const removeNewImage = (idx) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveEdit = async () => {
    if (!editProduct) return;
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');

      // Upload all new image files
      let uploadedUrls = [];
      for (const file of imageFiles) {
        const fd = new FormData();
        fd.append('image', file);
        const upRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd,
        });
        const upData = await upRes.json();
        if (upRes.ok && upData.imageUrl) uploadedUrls.push(upData.imageUrl);
        else throw new Error('Image upload failed: ' + (upData.message || ''));
      }

      // Final images = remaining existing + newly uploaded
      const finalImages = [...currentImages, ...uploadedUrls];

      const payload = {
        name:            editForm.name,
        category:        editForm.category,
        price:           parseFloat(editForm.price),
        mrp:             editForm.mrp !== '' ? parseFloat(editForm.mrp) : undefined,
        stock:           editForm.stock !== '' ? parseInt(editForm.stock) : undefined,
        description:     editForm.description,
        ingredients:     editForm.ingredients,
        howToUse:        editForm.howToUse,
        shippingReturns: editForm.shippingReturns,
        images:          finalImages,
      };

      const response = await fetch(`${API_URL}/api/admin/products/${editProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setProducts(products.map(p => p._id === editProduct._id ? data.product : p));
        closeEditModal();
        alert('✅ Product updated successfully!');
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // ── Stock toggle ────────────────────────────────────────────────────────
  const handleToggleStock = async (product) => {
    const newStockValue = (product.stock || 0) > 0 ? 0 : 100;
    const action = newStockValue === 0 ? 'OUT OF STOCK' : 'IN STOCK';
    if (!confirm(`Mark "${product.name}" as ${action}?`)) return;
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/products/${product._id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ stock: newStockValue }),
      });
      const data = await response.json();
      if (data.success) {
        setProducts(products.map(p => p._id === product._id ? { ...p, stock: newStockValue } : p));
        alert(`✅ Marked as ${action}!`);
      } else {
        alert(data.message || 'Failed to toggle stock');
      }
    } catch (err) {
      alert('Failed to toggle stock: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // ── Filtering ───────────────────────────────────────────────────────────
  const filteredProducts = products.filter(product => {
    const matchSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      activeCategory === 'all' ||
      product.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  const tattooCnt = products.filter(p => p.category?.toLowerCase() === 'tattoo').length;

  if (loading) {
    return (
      <div className="products-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-management">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h2>Products Management</h2>
          <p>View and manage all products</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="refresh-btn" onClick={() => navigate('/admin/products/add')} style={{ background: '#10b981' }}>
            ➕ Add New Product
          </button>
          {tattooCnt === 0 && (
            <button className="refresh-btn" onClick={handleAddTattooProducts} style={{ background: '#7c3aed' }} disabled={updating}>
              🖊 Add Tattoo Products
            </button>
          )}
          {products.length === 0 && (
            <button className="refresh-btn" onClick={handleImportProducts} style={{ background: '#3b82f6' }}>
              📦 Import Sample Products
            </button>
          )}
          <button className="refresh-btn" onClick={fetchProducts}>🔄 Refresh</button>
        </div>
      </div>

      {error && <div className="error-message"><span>⚠️ {error}</span></div>}

      {/* ── Stats ── */}
      <div className="products-stats">
        <div className="stat-card"><div className="stat-value">{products.length}</div><div className="stat-label">Total Products</div></div>
        <div className="stat-card"><div className="stat-value">{products.filter(p => (p.stock || 0) > 0).length}</div><div className="stat-label">In Stock</div></div>
        <div className="stat-card"><div className="stat-value">{products.filter(p => (p.stock || 0) === 0).length}</div><div className="stat-label">Out of Stock</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#7c3aed' }}>{tattooCnt}</div><div className="stat-label">Tattoo Products</div></div>
      </div>

      {/* ── Search ── */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ── Category filter tabs ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              background: activeCategory === cat.value ? '#1f4d3d' : '#fff',
              color: activeCategory === cat.value ? '#fff' : '#374151',
              fontWeight: activeCategory === cat.value ? '600' : '400',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
          >
            {cat.label}
            <span style={{ marginLeft: '5px', opacity: 0.7 }}>
              ({cat.value === 'all'
                ? products.length
                : products.filter(p => p.category?.toLowerCase() === cat.value).length})
            </span>
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No products found</td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb', display: 'block' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ width: 52, height: 52, background: '#f3f4f6', borderRadius: 6, border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#9ca3af', textAlign: 'center', lineHeight: 1.2 }}>
                        No<br/>Image
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="product-info">
                      <strong>{product.name}</strong>
                      {product.description && (
                        <small>{product.description.substring(0, 55)}…</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="category-badge" style={product.category?.toLowerCase() === 'tattoo' ? { background: '#ede9fe', color: '#6d28d9' } : {}}>
                      {product.category || 'N/A'}
                    </span>
                  </td>
                  <td><span className="price-display">₹{product.price || 0}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label className="stock-toggle">
                        <input type="checkbox" checked={(product.stock || 0) > 0} onChange={() => handleToggleStock(product)} disabled={updating} />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className={`stock-badge ${(product.stock || 0) === 0 ? 'out-of-stock' : ''}`}>
                        {(product.stock || 0) === 0 ? '⚠️ OUT OF STOCK' : `✅ IN STOCK (${product.stock})`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => openEditModal(product)}>
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Edit Modal ── */}
      {editModal && editProduct && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px', width: '95%' }}>
            <div className="modal-header">
              <h3>✏️ Edit Product</h3>
              <button className="modal-close" onClick={closeEditModal}>✕</button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Product Name</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditFormChange}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={editForm.price}
                    onChange={handleEditFormChange}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>MRP (₹)</label>
                  <input
                    name="mrp"
                    type="number"
                    min="0"
                    value={editForm.mrp}
                    onChange={handleEditFormChange}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Stock</label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={editForm.stock}
                    onChange={handleEditFormChange}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  rows={4}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Key Ingredients</label>
                <textarea
                  name="ingredients"
                  value={editForm.ingredients}
                  onChange={handleEditFormChange}
                  rows={3}
                  placeholder="e.g. Aloe Vera, Vitamin E, Salicylic Acid 2%..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>How to Use</label>
                <textarea
                  name="howToUse"
                  value={editForm.howToUse}
                  onChange={handleEditFormChange}
                  rows={3}
                  placeholder="e.g. Apply a small amount to clean skin..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Shipping & Returns</label>
                <textarea
                  name="shippingReturns"
                  value={editForm.shippingReturns}
                  onChange={handleEditFormChange}
                  rows={2}
                  placeholder="e.g. Delivered in 5–7 business days..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Product Images
                </label>

                {/* Current images with remove button */}
                {currentImages.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Current images (click ✕ to remove):</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {currentImages.map((img, i) => (
                        <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                          <img
                            src={img}
                            alt={`img-${i}`}
                            style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '2px solid #e5e7eb', display: 'block' }}
                            onError={e => { e.target.style.opacity = 0.3; }}
                          />
                          <button
                            type="button"
                            onClick={() => removeCurrentImage(i)}
                            style={{
                              position: 'absolute', top: -6, right: -6,
                              width: 20, height: 20, borderRadius: '50%',
                              background: '#ef4444', color: '#fff',
                              border: 'none', cursor: 'pointer',
                              fontSize: 11, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              lineHeight: 1,
                            }}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New image previews with remove button */}
                {imagePreviews.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ fontSize: 12, color: '#059669', marginBottom: 6 }}>New images to upload:</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {imagePreviews.map((src, i) => (
                        <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                          <img
                            src={src}
                            alt={`new-${i}`}
                            style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '2px solid #059669', display: 'block' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            style={{
                              position: 'absolute', top: -6, right: -6,
                              width: 20, height: 20, borderRadius: '50%',
                              background: '#ef4444', color: '#fff',
                              border: 'none', cursor: 'pointer',
                              fontSize: 11, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload button */}
                <label
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', background: '#1f4d3d', color: '#fff',
                    borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  }}
                >
                  📷 Add Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditImageFiles}
                    style={{ display: 'none' }}
                  />
                </label>
                <span style={{ marginLeft: 8, fontSize: 12, color: '#6b7280' }}>
                  Select one or more images
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={closeEditModal} disabled={updating}>Cancel</button>
              <button className="modal-btn confirm" onClick={handleSaveEdit} disabled={updating}>
                {updating ? 'Saving…' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
