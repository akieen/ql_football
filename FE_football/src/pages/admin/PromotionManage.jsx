import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';
import { promotionService } from '../../services/promotionService';
import toast from 'react-hot-toast';

const EMPTY = { code: '', description: '', discount_type: 'percent', discount_value: '', max_discount_amount: '', min_booking_amount: '', start_at: '', expires_at: '', usage_limit: '', is_active: 1 };

export default function PromotionManage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, edit: null });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    promotionService.getAll().then(r => setPromotions(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal({ open: true, edit: null }); };
  const openEdit = (p) => {
    setForm({ code: p.code, description: p.description || '', discount_type: p.discount_type, discount_value: p.discount_value, max_discount_amount: p.max_discount_amount || '', min_booking_amount: p.min_booking_amount || '', start_at: p.start_at ? p.start_at.slice(0, 10) : '', expires_at: p.expires_at ? p.expires_at.slice(0, 10) : '', usage_limit: p.usage_limit || '', is_active: p.is_active });
    setModal({ open: true, edit: p });
  };
  const closeModal = () => setModal({ open: false, edit: null });

  const handleSave = async () => {
    if (!form.code || !form.discount_value) { toast.error('Mã và giá trị giảm là bắt buộc'); return; }
    setSaving(true);
    try {
      if (modal.edit) { await promotionService.update(modal.edit.id, form); toast.success('Cập nhật thành công'); }
      else { await promotionService.create(form); toast.success('Thêm khuyến mãi thành công'); }
      load(); closeModal();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa khuyến mãi này?')) return;
    try { await promotionService.delete(id); toast.success('Xóa thành công'); load(); }
    catch { toast.error('Không thể xóa'); }
  };

  const filtered = promotions.filter(p => p.code?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page">
          <div className="admin-page-header">
            <div>
              <h2>🎁 Quản lý khuyến mãi</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>Tổng cộng {promotions.length} mã</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>+ Thêm khuyến mãi</button>
          </div>

          <div className="search-bar" style={{ maxWidth: 320, marginBottom: 20 }}>
            <span>🔍</span>
            <input placeholder="Tìm mã khuyến mãi..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? <div className="page-loader"><div className="spinner" /></div>
              : filtered.length === 0 ? <div className="empty-state"><div className="empty-icon">🎁</div><p>Chưa có khuyến mãi</p></div>
              : (
                <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr><th>Mã</th><th>Loại giảm</th><th>Giá trị</th><th>Hạn dùng</th><th>Đã dùng</th><th>Trạng thái</th><th>Thao tác</th></tr>
                    </thead>
                    <tbody>
                      {filtered.map(p => (
                        <tr key={p.id}>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)', fontSize: '0.95rem', background: 'var(--primary-subtle)', padding: '3px 8px', borderRadius: 6 }}>{p.code}</span>
                          </td>
                          <td>{p.discount_type === 'percent' ? 'Phần trăm' : 'Số tiền cố định'}</td>
                          <td style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                            {p.discount_type === 'percent' ? `${p.discount_value}%` : `${Number(p.discount_value).toLocaleString('vi-VN')}đ`}
                          </td>
                          <td style={{ fontSize: '0.82rem' }}>{p.expires_at ? new Date(p.expires_at).toLocaleDateString('vi-VN') : '—'}</td>
                          <td>{p.usage_count || 0}{p.usage_limit ? `/${p.usage_limit}` : ''}</td>
                          <td><span className={`badge ${p.is_active ? 'badge-green' : 'badge-red'}`}>{p.is_active ? 'Hoạt động' : 'Tắt'}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </div>
      </main>

      <Modal isOpen={modal.open} onClose={closeModal} size="modal-lg"
        title={modal.edit ? '✏ Sửa khuyến mãi' : '+ Thêm khuyến mãi'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={closeModal}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳...' : '💾 Lưu'}</button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Mã khuyến mãi *</label>
            <input className="form-input" placeholder="VD: SUMMER20" style={{ textTransform: 'uppercase' }} value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>
          <div className="form-group">
            <label className="form-label">Loại giảm giá *</label>
            <select className="form-input" value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })}>
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định (đ)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Giá trị giảm *</label>
            <input type="number" className="form-input" placeholder={form.discount_type === 'percent' ? '20' : '50000'} value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Giảm tối đa (đ)</label>
            <input type="number" className="form-input" placeholder="Không giới hạn" value={form.max_discount_amount} onChange={e => setForm({ ...form, max_discount_amount: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Đặt tối thiểu (đ)</label>
            <input type="number" className="form-input" placeholder="0" value={form.min_booking_amount} onChange={e => setForm({ ...form, min_booking_amount: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Giới hạn dùng</label>
            <input type="number" className="form-input" placeholder="Không giới hạn" value={form.usage_limit} onChange={e => setForm({ ...form, usage_limit: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Ngày bắt đầu</label>
            <input type="date" className="form-input" value={form.start_at} onChange={e => setForm({ ...form, start_at: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Ngày hết hạn</label>
            <input type="date" className="form-input" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-input" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Trạng thái</label>
          <select className="form-input" value={form.is_active} onChange={e => setForm({ ...form, is_active: Number(e.target.value) })}>
            <option value={1}>Hoạt động</option>
            <option value={0}>Tắt</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
