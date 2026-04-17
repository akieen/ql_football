import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Tổng quan', icon: '📊', to: '/admin' },
  { label: 'Chi nhánh', icon: '🏢', to: '/admin/branches' },
  { label: 'Sân bóng', icon: '⚽', to: '/admin/pitches' },
  { label: 'Lịch hoạt động', icon: '📅', to: '/admin/schedules' },
  { label: 'Dịch vụ', icon: '🛎', to: '/admin/services' },
  { label: 'Khuyến mãi', icon: '🎁', to: '/admin/promotions' },
  { label: 'Đặt sân', icon: '📋', to: '/admin/bookings' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="navbar-brand-icon" style={{ width: 32, height: 32, fontSize: '1rem' }}>⚽</div>
        <span>FútbolPro Admin</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Quản lý</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div className="sidebar-section-label" style={{ marginTop: 8 }}>Người dùng</div>
        <NavLink to="/" className="sidebar-link">
          <span className="icon">🌐</span> Về trang chủ
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user.full_name?.[0]?.toUpperCase() || 'A'}</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.full_name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {user.role === 'admin' ? 'Administrator' : 'Nhân viên'}
            </div>
          </div>
        </div>
        <button className="sidebar-link btn-full" onClick={handleLogout}>
          <span className="icon">🚪</span> Đăng xuất
        </button>
      </div>
    </aside>
  );
}
