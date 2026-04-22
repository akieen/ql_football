import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { branchService } from '../../services/branchService';
import { pitchService } from '../../services/pitchService';

export default function HomePage() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    branchService.getAll().then(r => setBranches(r.data.data || [])).catch(() => {});
    pitchService.getAll().then(r => setPitches(r.data.data || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/branches?q=${search}`);
  };

  const features = [
    { icon: '🔍', title: 'Tìm kiếm dễ dàng', desc: 'Tìm sân bóng gần bạn theo địa điểm, chi nhánh' },
    { icon: '📅', title: 'Đặt lịch nhanh', desc: 'Chọn giờ, đặt sân chỉ trong vài bước đơn giản' },
    { icon: '💳', title: 'Thanh toán an toàn', desc: 'Đa dạng hình thức thanh toán, bảo mật tuyệt đối' },
    { icon: '🎁', title: 'Ưu đãi hấp dẫn', desc: 'Nhiều mã giảm giá và khuyến mãi mỗi ngày' },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <div className="container" style={{ zIndex: 1 }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <div className="badge badge-primary" style={{ marginBottom: 20, display: 'inline-flex' }}>
              ⚡ Nền tảng đặt sân hàng đầu Việt Nam
            </div>
            <h1 style={{ marginBottom: 20, lineHeight: 1.15 }}>
              Đặt sân bóng đá<br />
              <span style={{ color: 'var(--primary-light)' }}>nhanh chóng & dễ dàng</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
              Hàng trăm sân bóng chất lượng cao, đặt lịch trực tuyến 24/7, giá tốt nhất thị trường.
            </p>

            <form onSubmit={handleSearch} style={{ maxWidth: 520, margin: '0 auto 40px' }}>
              <div className="search-bar">
                <span>🔍</span>
                <input
                  placeholder="Tìm chi nhánh, sân bóng..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm">Tìm kiếm</button>
              </div>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
              {[
                { n: branches.length || '10+', l: 'Chi nhánh' },
                { n: pitches.length || '50+', l: 'Sân bóng' },
                { n: '1000+', l: 'Lượt đặt' },
                { n: '4.9⭐', l: 'Đánh giá' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.n}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '-100px', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(102,100,161,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-80px', width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(79,77,141,0.10) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
      </section>

      {/* Features */}
      <section className="section" style={{ background: '#1b2245' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 12, color: '#f0f0f6' }}>Tại sao chọn KSport?</h2>
          <p style={{ textAlign: 'center', marginBottom: 36, color: 'var(--midnight-300)', fontSize: '1rem' }}>Trải nghiệm đặt sân bóng đẳng cấp với công nghệ hiện đại</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
            {features.map(f => (
              <div key={f.title} style={{
                padding: 28, textAlign: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 'var(--radius-lg)',
                transition: 'var(--transition)'
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'rgba(102,100,161,0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', margin: '0 auto 16px'
                }}>{f.icon}</div>
                <h4 style={{ marginBottom: 8, color: '#f0f0f6' }}>{f.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--midnight-300)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches preview */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2>Chi nhánh nổi bật</h2>
              <p style={{ marginTop: 4, color: 'var(--text-muted)' }}>Hệ thống sân bóng phủ khắp thành phố</p>
            </div>
            <Link to="/branches" className="btn btn-outline">Xem tất cả →</Link>
          </div>
          <div className="grid-3">
            {branches.slice(0, 6).map(b => (
              <div key={b.id} className="card" style={{ padding: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: 'var(--primary-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', marginBottom: 14
                }}>🏢</div>
                <h4 style={{ marginBottom: 6 }}>{b.name_branch}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>📍 {b.address}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>📞 {b.phone}</p>
                <Link to={`/pitches?branch=${b.id}`} className="btn btn-outline btn-sm btn-full">Xem sân →</Link>
              </div>
            ))}
          </div>
          {branches.length === 0 && (
            <div className="empty-state"><div className="empty-icon">🏢</div><p>Chưa có chi nhánh</p></div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: '#1b2245' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 16, color: '#f0f0f6' }}>Sẵn sàng đặt sân?</h2>
          <p style={{ color: 'var(--midnight-300)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Đăng ký miễn phí và bắt đầu đặt sân bóng ngay hôm nay
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">🚀 Đăng ký miễn phí</Link>
            <Link to="/pitches" className="btn btn-outline btn-lg" style={{ color: '#f0f0f6', borderColor: 'rgba(255,255,255,0.3)' }}>⚽ Xem sân bóng</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
