import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-brand-icon">⚽</div>
        <span>FútbolPro</span>
      </Link>

      <div className="navbar-nav">
        <Link to="/" className={isActive('/')}>Trang chủ</Link>
        <Link to="/branches" className={isActive('/branches')}>Chi nhánh</Link>
        <Link to="/pitches" className={isActive('/pitches')}>Sân bóng</Link>
        {user && <Link to="/my-bookings" className={isActive('/my-bookings')}>Lịch đặt</Link>}
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn btn-outline btn-sm">🛠 Admin</Link>
            )}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg,var(--primary),var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, color: '#fff'
                }}>
                  {user.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{user.full_name}</span>
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%', background: 'var(--bg-card)',
                  border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-lg)',
                  padding: 8, minWidth: 160, zIndex: 200, boxShadow: 'var(--shadow-lg)'
                }}>
                  <button className="sidebar-link" onClick={handleLogout}>🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Đăng nhập</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}
