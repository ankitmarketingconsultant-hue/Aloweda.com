import { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    const adminAccess = sessionStorage.getItem('adminAccess');

    // Require both token+admin role AND session access
    if (!token || role !== 'admin' || adminAccess !== 'granted') {
      navigate('/admin/login');
      return;
    }

    setUserName(name || 'Admin');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    sessionStorage.removeItem('adminAccess'); // Clear session access
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Aloweda Admin</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/admin/dashboard" 
            className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            {isSidebarOpen && <span className="nav-label">Analytics</span>}
          </Link>

          <Link 
            to="/admin/products" 
            className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}
          >
            <span className="nav-icon">📦</span>
            {isSidebarOpen && <span className="nav-label">Products</span>}
          </Link>

          <Link 
            to="/admin/orders" 
            className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}
          >
            <span className="nav-icon">🛍️</span>
            {isSidebarOpen && <span className="nav-label">Orders</span>}
          </Link>

          <Link 
            to="/admin/content" 
            className={`nav-item ${isActive('/admin/content') ? 'active' : ''}`}
          >
            <span className="nav-icon">📝</span>
            {isSidebarOpen && <span className="nav-label">Content</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <div className="header-content">
            <h1>Dashboard</h1>
            <div className="admin-user-info">
              <span className="user-greeting">Welcome, {userName}</span>
              <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
