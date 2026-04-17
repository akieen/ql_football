import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { branchService } from '../../services/branchService';
import { pitchService } from '../../services/pitchService';
import { bookingService } from '../../services/bookingService';
import { promotionService } from '../../services/promotionService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ branches: 0, pitches: 0, bookings: 0, promotions: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      branchService.getAll(),
      pitchService.getAll(),
      bookingService.getAll(),
      promotionService.getAll(),
    ]).then(([b, p, bk, pr]) => {
      const bkData = bk.data.data || [];
      setStats({
        branches: (b.data.data || []).length,
        pitches: (p.data.data || []).length,
        bookings: bkData.length,
        promotions: (pr.data.data || []).length,
      });
      setBookings(bkData.slice(0, 8));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STATUS_MAP = {
    pending: { label: 'Chờ xác nhận', cls: 'badge-yellow' },
    confirmed: { label: 'Đã xác nhận', cls: 'badge-green' },
    cancelled: { label: 'Đã hủy', cls: 'badge-red' },
    completed: { label: 'Hoàn thành', cls: 'badge-blue' },
  };

  const statCards = [
    { icon: '🏢', label: 'Chi nhánh', value: stats.branches, cls: 'green' },
    { icon: '⚽', label: 'Sân bóng', value: stats.pitches, cls: 'blue' },
    { icon: '📋', label: 'Đặt sân', value: stats.bookings, cls: 'yellow' },
    { icon: '🎁', label: 'Khuyến mãi', value: stats.promotions, cls: 'purple' },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page">
          <div className="admin-page-header">
            <div>
              <h2 style={{ marginBottom: 4 }}>📊 Tổng quan hệ thống</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Chào mừng trở lại! Đây là tổng quan hoạt động hôm nay.
              </p>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '8px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>
              📅 {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="stats-grid">
            {statCards.map(s => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
                <div>
                  <div className="stat-value">{loading ? '—' : s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4>📋 Đặt sân gần đây</h4>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>8 mới nhất</span>
            </div>
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : bookings.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📋</div><p>Chưa có đặt sân nào</p></div>
            ) : (
              <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Khách hàng</th><th>Sân</th><th>Chi nhánh</th>
                      <th>Ngày</th><th>Giờ</th><th>Tổng tiền</th><th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => {
                      const st = STATUS_MAP[b.status] || { label: b.status, cls: 'badge-primary' };
                      return (
                        <tr key={b.id}>
                          <td style={{ color: 'var(--text-muted)' }}>#{i + 1}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.full_name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.email}</div>
                          </td>
                          <td>{b.pitch_name}</td>
                          <td>{b.name_branch}</td>
                          <td>{b.booking_date}</td>
                          <td>{b.start_time} - {b.end_time}</td>
                          <td style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                            {Number(b.total_price).toLocaleString('vi-VN')}đ
                          </td>
                          <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
