import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { pitchService } from '../../services/pitchService';
import { branchService } from '../../services/branchService';

const IMG_BASE = 'http://localhost:3000/';

export default function PitchesPage() {
  const [pitches, setPitches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const [selectedBranch, setSelectedBranch] = useState(searchParams.get('branch') || '');

  useEffect(() => {
    Promise.all([
      pitchService.getAll(),
      branchService.getAll()
    ]).then(([p, b]) => {
      setPitches(p.data.data || []);
      setBranches(b.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = pitches.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchBranch = !selectedBranch || String(p.branch_id) === String(selectedBranch);
    return matchSearch && matchBranch;
  });

  return (
    <>
      <Navbar />
      <div className="page-pt" style={{ minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>⚽ Sân bóng</h1>
            <p style={{ color: 'var(--text-muted)' }}>Chọn sân phù hợp và đặt lịch ngay</p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 260 }}>
              <span>🔍</span>
              <input placeholder="Tìm tên sân..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select
              className="form-input" style={{ minWidth: 200, width: 'auto' }}
              value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}
            >
              <option value="">Tất cả chi nhánh</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name_branch}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="page-loader"><div className="spinner" /><p className="loading-text">Đang tải...</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">⚽</div><p>Không tìm thấy sân nào</p></div>
          ) : (
            <div className="grid-3">
              {filtered.map(p => {
                const branch = branches.find(b => b.id === p.branch_id);
                return (
                  <div key={p.id} className="card fade-in" style={{ cursor: 'pointer' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                      {p.image_url ? (
                        <img
                          src={`${IMG_BASE}${p.image_url}`}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => e.target.style.display = 'none'}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%', background: 'var(--bg-surface)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'
                        }}>⚽</div>
                      )}
                      <div style={{
                        position: 'absolute', top: 12, right: 12,
                        background: 'rgba(0,0,0,0.7)', borderRadius: 'var(--radius-full)',
                        padding: '4px 10px', fontSize: '0.8rem', color: 'var(--primary-light)',
                        fontWeight: 700, backdropFilter: 'blur(8px)'
                      }}>
                        {Number(p.price_per_hour).toLocaleString('vi-VN')}đ/h
                      </div>
                    </div>
                    <div style={{ padding: 20 }}>
                      <h4 style={{ marginBottom: 6 }}>{p.name}</h4>
                      {branch && (
                        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                          🏢 {branch.name_branch} — 📍 {branch.address}
                        </p>
                      )}
                      {p.description && (
                        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {p.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/booking/${p.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                          📅 Đặt sân
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
