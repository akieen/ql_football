import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', cls: 'badge-yellow' },
  confirmed: { label: 'Đã xác nhận', cls: 'badge-green' },
  cancelled: { label: 'Đã hủy', cls: 'badge-red' },
  completed: { label: 'Hoàn thành', cls: 'badge-blue' },
};

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    bookingService.getByUser(user.user_id)
      .then(r => setBookings(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Bạn có chắc muốn hủy đặt sân này?')) return;
    try {
      await bookingService.updateStatus(id, 'cancelled');
      toast.success('Hủy đặt sân thành công');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch { toast.error('Không thể hủy đặt sân'); }
  };

  return (
    <>
      <Navbar />
      <div className="page-pt" style={{ minHeight: '100vh', paddingTop: 88 }}>
        <div className="container" style={{ paddingBottom: 60 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>📋 Lịch đặt sân của tôi</h1>
            <p style={{ color: 'var(--text-muted)' }}>Quản lý tất cả lịch đặt sân của bạn</p>
          </div>

          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>Bạn chưa có lịch đặt sân nào</p>
              <Link to="/pitches" className="btn btn-primary" style={{ marginTop: 16 }}>⚽ Đặt sân ngay</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {bookings.map(b => {
                const st = STATUS_MAP[b.status] || { label: b.status, cls: 'badge-primary' };
                return (
                  <div key={b.id} className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <h4>{b.pitch_name || 'Sân bóng'}</h4>
                          <span className={`badge ${st.cls}`}>{st.label}</span>
                        </div>
                        {/* Thời gian đặt - nổi bật */}
                        {b.booking_date && b.start_time && b.end_time && (() => {
                          const dateObj = new Date(b.booking_date);
                          const dayNames = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
                          const dateLabel = `${dayNames[dateObj.getDay()]}, ${dateObj.toLocaleDateString('vi-VN')}`;
                          const [sh, sm] = b.start_time.split(':').map(Number);
                          const [eh, em] = b.end_time.split(':').map(Number);
                          const totalMins = eh * 60 + em - sh * 60 - sm;
                          const hrs = Math.floor(totalMins / 60);
                          const mns = totalMins % 60;
                          const dur = hrs > 0 ? (mns > 0 ? `${hrs}h${mns}p` : `${hrs} giờ`) : `${mns} phút`;
                          return (
                            <div style={{
                              display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12,
                              padding: '10px 14px',
                              background: 'linear-gradient(135deg,rgba(140,26,23,0.2),rgba(205,18,45,0.1))',
                              border: '1px solid rgba(205,18,45,0.3)',
                              borderRadius: 'var(--radius)',
                            }}>
                              <span style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                background: 'rgba(255,255,255,0.08)', borderRadius: 20,
                                padding: '3px 10px', fontSize: '0.82rem', color: '#fff', fontWeight: 500
                              }}>📅 {dateLabel}</span>
                              <span style={{
                                display: 'flex', alignItems: 'center', gap: 5,
                                background: 'rgba(205,18,45,0.25)', borderRadius: 20,
                                padding: '3px 10px', fontSize: '0.9rem', color: 'var(--primary-light)', fontWeight: 700
                              }}>🕐 {b.start_time} – {b.end_time}</span>
                              {totalMins > 0 && (
                                <span style={{
                                  display: 'flex', alignItems: 'center', gap: 5,
                                  background: 'rgba(255,255,255,0.06)', borderRadius: 20,
                                  padding: '3px 10px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500
                                }}>⏱ {dur}</span>
                              )}
                            </div>
                          );
                        })()}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '6px 20px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🏢 {b.name_branch}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 700 }}>
                            💰 {Number(b.total_price).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                        {b.notes && <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: 8 }}>📝 {b.notes}</p>}
                      </div>
                      {b.status === 'pending' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Hủy đặt</button>
                      )}
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
