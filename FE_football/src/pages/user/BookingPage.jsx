import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { pitchService } from '../../services/pitchService';
import { scheduleService } from '../../services/scheduleService';
import { promotionService } from '../../services/promotionService';
import { bookingService } from '../../services/bookingService';
import toast from 'react-hot-toast';

const IMG_BASE = 'http://localhost:3000/';
const DAYS = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];

export default function BookingPage() {
  const { pitchId } = useParams();
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [pitch, setPitch] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    booking_date: '',
    start_time: '',
    end_time: '',
    notes: '',
    promo_code: '',
  });
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([
      pitchService.getAll(),
      scheduleService.getAll(),
      promotionService.getAll(),
    ]).then(([p, s, pr]) => {
      const found = (p.data.data || []).find(x => String(x.id) === String(pitchId));
      setPitch(found || null);
      setSchedules((s.data.data || []).filter(x => String(x.pitch_id) === String(pitchId)));
      setPromotions(pr.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [pitchId]);

  const getScheduleForDate = (dateStr) => {
    if (!dateStr) return null;
    const day = new Date(dateStr).getDay(); // 0=Sun
    return schedules.find(s => Number(s.date_of_week) === day && s.is_active);
  };

  const calcTotal = () => {
    if (!pitch || !form.start_time || !form.end_time) return 0;
    const [sh, sm] = form.start_time.split(':').map(Number);
    const [eh, em] = form.end_time.split(':').map(Number);
    const hours = Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
    const base = hours * Number(pitch.price_per_hour);
    if (appliedPromo) {
      if (appliedPromo.discount_type === 'percent') return base * (1 - appliedPromo.discount_value / 100);
      return Math.max(0, base - appliedPromo.discount_value);
    }
    return base;
  };

  const applyPromo = () => {
    const promo = promotions.find(p => p.code === form.promo_code && p.is_active);
    if (promo) { setAppliedPromo(promo); toast.success(`Áp dụng mã "${promo.code}" thành công!`); }
    else { toast.error('Mã khuyến mãi không hợp lệ'); setAppliedPromo(null); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.booking_date || !form.start_time || !form.end_time) {
      toast.error('Vui lòng điền đầy đủ thông tin'); return;
    }
    setSubmitting(true);
    try {
      await bookingService.create({
        user_id: user.user_id,
        pitch_id: pitchId,
        booking_date: form.booking_date,
        start_time: form.start_time,
        end_time: form.end_time,
        total_price: calcTotal(),
        promotion_id: appliedPromo?.id || null,
        notes: form.notes,
      });
      toast.success('🎉 Đặt sân thành công!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đặt sân thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const sched = getScheduleForDate(form.booking_date);

  if (loading) return (
    <>
      <Navbar />
      <div className="page-loader" style={{ paddingTop: 100 }}><div className="spinner" /></div>
    </>
  );

  if (!pitch) return (
    <>
      <Navbar />
      <div className="empty-state" style={{ paddingTop: 120 }}>
        <div className="empty-icon">⚽</div>
        <p>Không tìm thấy sân bóng</p>
        <Link to="/pitches" className="btn btn-primary" style={{ marginTop: 16 }}>← Quay lại</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page-pt" style={{ minHeight: '100vh', paddingTop: 88 }}>
        <div className="container" style={{ paddingBottom: 60 }}>
          <Link to="/pitches" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex' }}>← Quay lại</Link>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>

            {/* Left: Pitch info */}
            <div>
              <div className="card" style={{ marginBottom: 20, overflow: 'hidden' }}>
                {pitch.image_url && (
                  <img src={`${IMG_BASE}${pitch.image_url}`} alt={pitch.name}
                    style={{ width: '100%', height: 260, objectFit: 'cover' }} />
                )}
                <div style={{ padding: 24 }}>
                  <h2 style={{ marginBottom: 10 }}>{pitch.name}</h2>
                  {pitch.description && <p style={{ color: 'var(--text-muted)', marginBottom: 14 }}>{pitch.description}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                      {Number(pitch.price_per_hour).toLocaleString('vi-VN')}đ/giờ
                    </span>
                  </div>
                </div>
              </div>

              {schedules.length > 0 && (
                <div className="card" style={{ padding: 24 }}>
                  <h4 style={{ marginBottom: 16 }}>📅 Lịch hoạt động</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {schedules.map(s => (
                      <div key={s.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)'
                      }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{DAYS[s.date_of_week]}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                          {s.open_time} - {s.close_time}
                        </span>
                        <span className={`badge ${s.is_active ? 'badge-green' : 'badge-red'}`}>
                          {s.is_active ? 'Mở' : 'Đóng'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Booking form */}
            <div className="card" style={{ padding: 28, position: 'sticky', top: 88 }}>
              <h3 style={{ marginBottom: 20 }}>📋 Đặt sân</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Ngày đặt sân *</label>
                  <input type="date" className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.booking_date}
                    onChange={e => setForm({ ...form, booking_date: e.target.value })}
                    required
                  />
                  {sched && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                      ✅ Sân mở: {sched.open_time} - {sched.close_time}
                    </span>
                  )}
                  {form.booking_date && !sched && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>⚠ Ngày này sân không hoạt động</span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Giờ bắt đầu *</label>
                    <input type="time" className="form-input"
                      value={form.start_time}
                      min={sched?.open_time}
                      onChange={e => setForm({ ...form, start_time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giờ kết thúc *</label>
                    <input type="time" className="form-input"
                      value={form.end_time}
                      max={sched?.close_time}
                      onChange={e => setForm({ ...form, end_time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mã khuyến mãi</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="form-input" placeholder="Nhập mã..."
                      value={form.promo_code}
                      onChange={e => setForm({ ...form, promo_code: e.target.value })}
                    />
                    <button type="button" className="btn btn-outline btn-sm" onClick={applyPromo}>Áp dụng</button>
                  </div>
                  {appliedPromo && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                      🎁 Giảm {appliedPromo.discount_type === 'percent' ? `${appliedPromo.discount_value}%` : `${Number(appliedPromo.discount_value).toLocaleString('vi-VN')}đ`}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú</label>
                  <textarea className="form-input" rows={3} placeholder="Yêu cầu đặc biệt..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                {calcTotal() > 0 && (
                  <div style={{
                    background: 'var(--primary-subtle)', border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius)', padding: '14px 16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Tổng tiền</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                        {calcTotal().toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={submitting}>
                  {submitting ? '⏳ Đang đặt...' : '🏟 Xác nhận đặt sân'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
