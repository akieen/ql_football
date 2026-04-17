import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', cls: 'badge-yellow' },
  confirmed: { label: 'Đã xác nhận', cls: 'badge-green' },
  cancelled: { label: 'Đã hủy', cls: 'badge-red' },
  completed: { label: 'Hoàn thành', cls: 'badge-blue' },
};

export default function BookingManage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    bookingService.getAll().then(r => setBookings(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      toast.success('Cập nhật trạng thái thành công');
      load();
    } catch { toast.error('Cập nhật thất bại'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa booking này?')) return;
    try { await bookingService.delete(id); toast.success('Xóa thành công'); load(); }
    catch { toast.error('Không thể xóa'); }
  };

  const filtered = bookings.filter(b => {
    const matchStatus = !filter || b.status === filter;
    const matchSearch = !search ||
      b.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.pitch_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.name_branch?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const total = filtered.reduce((s, b) => s + Number(b.total_price || 0), 0);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page">
          <div className="admin-page-header">
            <div>
              <h2>📋 Quản lý đặt sân</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                {filtered.length} đơn · Doanh thu: <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{total.toLocaleString('vi-VN')}đ</span>
              </p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={load}>🔄 Làm mới</button>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
              <span>🔍</span>
              <input placeholder="Tìm khách, sân, chi nhánh..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-input" style={{ minWidth: 180, width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? <div className="page-loader"><div className="spinner" /></div>
              : filtered.length === 0 ? <div className="empty-state"><div className="empty-icon">📋</div><p>Không có đặt sân nào</p></div>
              : (
                <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr><th>#</th><th>Khách hàng</th><th>Sân / Chi nhánh</th><th>Ngày & Giờ</th><th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th></tr>
                    </thead>
                    <tbody>
                      {filtered.map((b, i) => {
                        const st = STATUS_MAP[b.status] || { label: b.status, cls: 'badge-primary' };
                        return (
                          <tr key={b.id}>
                            <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.full_name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.email}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{b.pitch_name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🏢 {b.name_branch}</div>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.88rem' }}>📅 {b.booking_date}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⏰ {b.start_time} - {b.end_time}</div>
                            </td>
                            <td style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{Number(b.total_price).toLocaleString('vi-VN')}đ</td>
                            <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {b.status === 'pending' && (
                                  <button className="btn btn-sm" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', padding: '4px 10px' }} onClick={() => handleStatus(b.id, 'confirmed')}>✓ Xác nhận</button>
                                )}
                                {(b.status === 'pending' || b.status === 'confirmed') && (
                                  <button className="btn btn-sm" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', padding: '4px 10px' }} onClick={() => handleStatus(b.id, 'cancelled')}>✕ Hủy</button>
                                )}
                                {b.status === 'confirmed' && (
                                  <button className="btn btn-sm" style={{ background: 'var(--info-bg)', color: 'var(--info)', border: '1px solid rgba(59,130,246,.3)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', padding: '4px 10px' }} onClick={() => handleStatus(b.id, 'completed')}>✔ Hoàn thành</button>
                                )}
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>🗑</button>
                              </div>
                            </td>
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
