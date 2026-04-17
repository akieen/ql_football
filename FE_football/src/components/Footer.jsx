import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-surface)', borderTop: '1px solid var(--border)',
      padding: '48px 0 24px'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div className="navbar-brand-icon">⚽</div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>FútbolPro</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Hệ thống đặt sân bóng đá trực tuyến hàng đầu. Tìm sân, đặt lịch nhanh chóng!
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: 14, color: 'var(--primary-light)' }}>Dịch vụ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/pitches" className="text-muted" style={{ color: 'var(--text-muted)' }}>Đặt sân bóng</Link>
              <Link to="/branches" className="text-muted" style={{ color: 'var(--text-muted)' }}>Chi nhánh</Link>
              <Link to="/my-bookings" className="text-muted" style={{ color: 'var(--text-muted)' }}>Lịch đặt của tôi</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: 14, color: 'var(--primary-light)' }}>Liên hệ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              <span>📞 1900 xxxx</span>
              <span>📧 contact@futbolpro.vn</span>
              <span>📍 TP. Hồ Chí Minh</span>
            </div>
          </div>
        </div>
        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          © 2026 FútbolPro. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}
