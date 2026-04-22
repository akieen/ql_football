import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userBtnHover, setUserBtnHover] = useState(false);
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
        <span>KSport</span>
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
                onMouseEnter={() => setUserBtnHover(true)}
                onMouseLeave={() => setUserBtnHover(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: userBtnHover ? '#fff' : 'transparent',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 10px',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(90deg,#8c1a17,#cd122d)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                  boxShadow: '0 2px 8px rgba(140,26,23,0.45)'
                }}>
                  {user.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ color: userBtnHover ? '#111' : '#fff', fontSize: '0.88rem', transition: 'color 0.2s' }}>{user.full_name}</span>
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
            <Link
              to="/login"
              className="btn btn-sm"
              style={{
                background: 'transparent',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.6)',
                borderRadius: 'var(--radius-full)',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.borderColor = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
            >Đăng nhập</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}
