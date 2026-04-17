import { useEffect, useState, useRef } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';
import { pitchService } from '../../services/pitchService';
import { branchService } from '../../services/branchService';
import toast from 'react-hot-toast';

const IMG_BASE = 'http://localhost:3000/';
const EMPTY = { branch_id: '', name: '', description: '', price_per_hour: '', status: 'active' };

export default function PitchManage() {
  const [pitches, setPitches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, edit: null });
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    Promise.all([pitchService.getAll(), branchService.getAll()])
      .then(([p, b]) => { setPitches(p.data.data || []); setBranches(b.data.data || []); })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setImageFile(null); setImagePreview(''); setModal({ open: true, edit: null }); };
  const openEdit = (p) => {
    setForm({ branch_id: p.branch_id, name: p.name, description: p.description || '', price_per_hour: p.price_per_hour, status: p.status || 'active' });
    setImageFile(null);
    setImagePreview(p.image_url ? `${IMG_BASE}${p.image_url}` : '');
    setModal({ open: true, edit: p });
  };
  const closeModal = () => setModal({ open: false, edit: null });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.branch_id || !form.name || !form.price_per_hour) { toast.error('Vui lòng điền đủ thông tin'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image_url', imageFile);
      if (modal.edit) {
        await pitchService.update(modal.edit.id, fd);
        toast.success('Cập nhật sân thành công');
      } else {
        await pitchService.create(fd);
        toast.success('Thêm sân thành công');
      }
      load(); closeModal();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi xảy ra'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa sân này?')) return;
    try { await pitchService.delete(id); toast.success('Xóa thành công'); load(); }
    catch { toast.error('Không thể xóa sân'); }
  };

  const getBranch = (id) => branches.find(b => b.id === id);
  const filtered = pitches.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page">
          <div className="admin-page-header">
            <div>
              <h2>⚽ Quản lý sân bóng</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>Tổng cộng {pitches.length} sân</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>+ Thêm sân</button>
          </div>

          <div className="search-bar" style={{ maxWidth: 380, marginBottom: 20 }}>
            <span>🔍</span>
            <input placeholder="Tìm tên sân..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">⚽</div><p>Không có sân nào</p></div>
            ) : (
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr><th>Ảnh</th><th>Tên sân</th><th>Chi nhánh</th><th>Giá/giờ</th><th>Trạng thái</th><th>Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => {
                      const br = getBranch(p.branch_id);
                      return (
                        <tr key={p.id}>
                          <td>
                            {p.image_url
                              ? <img src={`${IMG_BASE}${p.image_url}`} style={{ width: 52, height: 38, objectFit: 'cover', borderRadius: 6 }} alt="" />
                              : <div style={{ width: 52, height: 38, background: 'var(--bg-surface)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚽</div>
                            }
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                          <td>{br?.name_branch || '—'}</td>
                          <td style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{Number(p.price_per_hour).toLocaleString('vi-VN')}đ</td>
                          <td><span className={`badge ${p.status === 'active' ? 'badge-green' : 'badge-red'}`}>{p.status === 'active' ? 'Hoạt động' : 'Tạm nghỉ'}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏ Sửa</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑 Xóa</button>
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

      <Modal isOpen={modal.open} onClose={closeModal}
        title={modal.edit ? '✏ Sửa sân bóng' : '+ Thêm sân bóng'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={closeModal}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Đang lưu...' : '💾 Lưu'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Chi nhánh *</label>
          <select className="form-input" value={form.branch_id} onChange={e => setForm({ ...form, branch_id: e.target.value })}>
            <option value="">-- Chọn chi nhánh --</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name_branch}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Tên sân *</label>
          <input className="form-input" placeholder="VD: Sân 5 người A" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Giá/giờ (VNĐ) *</label>
          <input className="form-input" type="number" placeholder="200000" value={form.price_per_hour} onChange={e => setForm({ ...form, price_per_hour: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Mô tả</label>
          <textarea className="form-input" rows={3} placeholder="Mô tả về sân..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Hình ảnh</label>
          <div className="image-upload" onClick={() => fileRef.current?.click()}>
            <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handleImage} />
            {imagePreview
              ? <img src={imagePreview} className="image-preview" alt="preview" />
              : <div><div style={{ fontSize: '2rem', marginBottom: 8 }}>📷</div><p className="text-muted">Click để chọn ảnh</p></div>
            }
          </div>
        </div>
      </Modal>
    </div>
  );
}
