import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsManagement.css';

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleImportProducts = async () => {
    if (!confirm('Import sample products to database? This will add 15 products.')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/api/import-products/init`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        alert(`✅ Success! ${data.count} products imported.`);
        fetchProducts(); // Refresh the list
      } else {
        alert(`⚠️ ${data.message || 'Import failed'}`);
        if (data.count > 0) {
          // Products already exist, just refresh
          fetchProducts();
        }
      }
    } catch (err) {
      console.error('Import error:', err);
      alert(`❌ Error: ${err.message}\n\nTry refreshing the page and check if products are already imported.`);
      // Try to fetch products anyway
      fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setNewPrice(product.price || '');
    setNewStock(product.stock || 0);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewPrice('');
    setNewStock('');
  };

  const handleUpdatePrice = async (productId) => {
    if (!newPrice || newPrice < 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/products/${productId}/price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setProducts(products.map(p => 
          p._id === productId ? { ...p, price: parseFloat(newPrice) } : p
        ));
        setEditingProduct(null);
        setNewPrice('');
        alert('Price updated successfully!');
      } else {
        alert(data.message || 'Failed to update price');
      }
    } catch (err) {
      console.error('Error updating price:', err);
      alert('Failed to update price');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStock = async (productId) => {
    if (newStock === '' || newStock < 0) {
      alert('Please enter a valid stock quantity');
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/admin/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: parseInt(newStock) }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setProducts(products.map(p => 
          p._id === productId ? { ...p, stock: parseInt(newStock) } : p
        ));
        alert('Stock updated successfully!');
      } else {
        alert(data.message || 'Failed to update stock');
      }
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock');
    } finally {
      setUpdating(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="page-header">
        <div>
          <h2>Products Management</h2>
          <p>View and manage all products</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="refresh-btn" 
            onClick={() => navigate('/admin/products/add')}
            style={{ background: '#10b981' }}
          >
            ➕ Add New Product
          </button>
          {products.length === 0 && (
            <button className="refresh-btn" onClick={handleImportProducts} style={{ background: '#3b82f6' }}>
              📦 Import Sample Products
            </button>
          )}
          <button className="refresh-btn" onClick={fetchProducts}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-stats">
        <div className="stat-card">
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {products.filter(p => (p.stock || 0) > 0).length}
          </div>
          <div className="stat-label">In Stock</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {products.filter(p => (p.stock || 0) === 0).length}
          </div>
          <div className="stat-label">Out of Stock</div>
        </div>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-info">
                      <strong>{product.name}</strong>
                      {product.description && (
                        <small>{product.description.substring(0, 50)}...</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{product.category || 'N/A'}</span>
                  </td>
                  <td>
                    {editingProduct === product._id ? (
                      <input
                        type="number"
                        className="price-input"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      <span className="price-display">₹{product.price || 0}</span>
                    )}
                  </td>
                  <td>
                    {editingProduct === product._id ? (
                      <input
                        type="number"
                        className="stock-input"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        min="0"
                      />
                    ) : (
                      <span className={`stock-badge ${(product.stock || 0) === 0 ? 'out-of-stock' : ''}`}>
                        {product.stock || 0} units
                      </span>
                    )}
                  </td>
                  <td>
                    {editingProduct === product._id ? (
                      <div className="action-buttons">
                        <button
                          className="save-btn"
                          onClick={() => handleUpdatePrice(product._id)}
                          disabled={updating}
                        >
                          💾 Save Price
                        </button>
                        <button
                          className="save-btn"
                          onClick={() => handleUpdateStock(product._id)}
                          disabled={updating}
                        >
                          📦 Save Stock
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                          disabled={updating}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(product)}
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsManagement;
