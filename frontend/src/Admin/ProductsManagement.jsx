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

const emptyEdit = { name: '', category: 'cream', price: '', description: '', images: '' };

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
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState('');

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
  const openEditModal = (product) => {
    setEditProduct(product);
    setEditForm({
      name:        product.name        || '',
      category:    product.category    || 'cream',
      price:       product.price       ?? '',
      description: product.description || '',
      images:      (product.images || []).join(', '),
    });
    setImageFile(null);
    setImagePreview('');
    setEditModal(true);
  };

  const closeEditModal = () => {
    setEditModal(false);
    setEditProduct(null);
    setEditForm(emptyEdit);
    setImageFile(null);
    setImagePreview('');
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = async () => {
    if (!editProduct) return;
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');

      // Upload new image if chosen
      let uploadedUrl = '';
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        const upRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd,
        });
        const upData = await upRes.json();
        if (upRes.ok) uploadedUrl = upData.imageUrl;
        else throw new Error('Image upload failed');
      }

      // Build images array: if new image uploaded it REPLACES all old ones, else keep URL input
      const urlsFromInput = editForm.images
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const finalImages = uploadedUrl
        ? [uploadedUrl]           // new upload replaces everything
        : urlsFromInput;

      const payload = {
        name:        editForm.name,
        category:    editForm.category,
        price:       parseFloat(editForm.price),
        description: editForm.description,
        images:      finalImages,
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
              <th>Product Name</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr><td colSpan="5" className="no-data">No products found</td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 14 }}>
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
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Image URLs <span style={{ fontWeight: 400, color: '#6b7280' }}>(comma-separated)</span></label>
                <input
                  name="images"
                  value={editForm.images}
                  onChange={handleEditFormChange}
                  placeholder="https://…, https://…"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Upload New Image <span style={{ fontWeight: 400, color: '#6b7280' }}>(replaces current image)</span></label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageFile}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                />
              </div>

              {imagePreview && (
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: 160, maxHeight: 160, borderRadius: 8, border: '2px solid #e5e7eb' }} />
                </div>
              )}

              {/* Show current images */}
              {editProduct.images?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 6, fontSize: 13, color: '#6b7280' }}>Current Images:</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {editProduct.images.map((img, i) => (
                      <img key={i} src={img} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    ))}
                  </div>
                </div>
              )}
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
