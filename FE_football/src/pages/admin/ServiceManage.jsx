import { useEffect, useState, useRef } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';
import { serviceService } from '../../services/serviceService';
import { pitchService } from '../../services/pitchService';
import toast from 'react-hot-toast';

const IMG_BASE = 'http://localhost:3000/';
const EMPTY = { pitch_id: '', name: '', description: '', price: '' };

export default function ServiceManage() {
  const [services, setServices] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, edit: null });
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    Promise.all([serviceService.getAll(), pitchService.getAll()])
      .then(([s, p]) => { setServices(s.data.data || []); setPitches(p.data.data || []); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setImageFile(null); setImagePreview(''); setModal({ open: true, edit: null }); };
  const openEdit = (s) => {
    setForm({ pitch_id: s.pitch_id || '', name: s.name, description: s.description || '', price: s.price });
    setImageFile(null);
    setImagePreview(s.image_url ? `${IMG_BASE}${s.image_url}` : '');
    setModal({ open: true, edit: s });
  };
  const closeModal = () => setModal({ open: false, edit: null });

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Tên và giá là bắt buộc'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image_url', imageFile);
      if (modal.edit) {
        await serviceService.update(modal.edit.id, fd);
        toast.success('Cập nhật thành công');
      } else {
        await serviceService.create(fd);
        toast.success('Thêm dịch vụ thành công');
      }
      load(); closeModal();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa dịch vụ này?')) return;
    try { await serviceService.delete(id); toast.success('Xóa thành công'); load(); }
    catch { toast.error('Không thể xóa'); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page">
          <div className="admin-page-header">
            <div>
              <h2>🛎 Quản lý dịch vụ</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>Tổng cộng {services.length} dịch vụ</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>+ Thêm dịch vụ</button>
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : services.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🛎</div><p>Chưa có dịch vụ nào</p></div>
            ) : (
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr><th>Ảnh</th><th>Tên dịch vụ</th><th>Mô tả</th><th>Giá</th><th>Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {services.map(s => (
                      <tr key={s.id}>
                        <td>
                          {s.image_url
                            ? <img src={`${IMG_BASE}${s.image_url}`} style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} alt="" />
                            : <div style={{ width: 48, height: 36, background: 'var(--bg-surface)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛎</div>
                          }
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                        <td style={{ maxWidth: 220 }}>
                          <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.description || '—'}</span>
                        </td>
                        <td style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{Number(s.price).toLocaleString('vi-VN')}đ</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>✏ Sửa</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>🗑 Xóa</button>
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

      <Modal isOpen={modal.open} onClose={closeModal}
        title={modal.edit ? '✏ Sửa dịch vụ' : '+ Thêm dịch vụ'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={closeModal}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳...' : '💾 Lưu'}</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Sân liên kết</label>
          <select className="form-input" value={form.pitch_id} onChange={e => setForm({ ...form, pitch_id: e.target.value })}>
            <option value="">-- Không liên kết --</option>
            {pitches.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Tên dịch vụ *</label>
          <input className="form-input" placeholder="VD: Cho thuê giày" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Giá (VNĐ) *</label>
          <input type="number" className="form-input" placeholder="50000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Hình ảnh</label>
          <div className="image-upload" onClick={() => fileRef.current?.click()}>
            <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={e => { const f = e.target.files[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
            {imagePreview ? <img src={imagePreview} className="image-preview" alt="preview" /> : <div><div style={{ fontSize: '1.5rem' }}>📷</div><p className="text-muted">Click để chọn ảnh</p></div>}
          </div>
        </div>
      </Modal>
    </div>
  );
}
