import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { branchService } from '../../services/branchService';

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    branchService.getAll()
      .then(r => setBranches(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = branches.filter(b =>
    b.name_branch?.toLowerCase().includes(search.toLowerCase()) ||
    b.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="page-pt" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>🏢 Chi nhánh</h1>
            <p style={{ color: 'var(--text-muted)' }}>Tìm chi nhánh sân bóng gần bạn</p>
          </div>

          <div className="search-bar" style={{ maxWidth: 480, marginBottom: 32 }}>
            <span>🔍</span>
            <input
              placeholder="Tìm theo tên, địa chỉ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="page-loader"><div className="spinner" /><p className="loading-text">Đang tải...</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <p>Không tìm thấy chi nhánh nào</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(b => (
                <div key={b.id} className="card fade-in" style={{ padding: 28 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: 'linear-gradient(135deg,var(--primary-subtle),rgba(163,230,53,0.08))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.75rem', marginBottom: 16, border: '1px solid var(--border-strong)'
                  }}>🏢</div>
                  <h3 style={{ marginBottom: 12 }}>{b.name_branch}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
                      <span>📍</span><span>{b.address}</span>
                    </span>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
                      <span>📞</span><span>{b.phone}</span>
                    </span>
                  </div>
                  <Link to={`/pitches?branch=${b.id}`} className="btn btn-primary btn-sm btn-full">
                    ⚽ Xem sân bóng
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
