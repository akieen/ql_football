import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#1b2245',
      borderTop: 'none',
      padding: '48px 0 24px'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div className="navbar-brand-icon">⚽</div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>KSport</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              Hệ thống đặt sân bóng đá trực tuyến hàng đầu. Tìm sân, đặt lịch nhanh chóng!
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: 14, color: '#fff' }}>Dịch vụ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/pitches" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.88rem' }}>Đặt sân bóng</Link>
              <Link to="/branches" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.88rem' }}>Chi nhánh</Link>
              <Link to="/my-bookings" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '0.88rem' }}>Lịch đặt của tôi</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: 14, color: '#fff' }}>Liên hệ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem' }}>
              <span>📞 1900 xxxx</span>
              <span>📧 contact@ksport.vn</span>
              <span>📍 TP. Hồ Chí Minh</span>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
          © 2026 KSport. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}
