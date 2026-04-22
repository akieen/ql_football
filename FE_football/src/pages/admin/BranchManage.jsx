import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';
import { branchService } from '../../services/branchService';
import toast from 'react-hot-toast';

const EMPTY = { user_id: '', name_branch: '', address: '', phone: '' };

export default function BranchManage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, edit: null });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    branchService.getAll().then(r => setBranches(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal({ open: true, edit: null }); };
  const openEdit = (b) => { setForm({ user_id: b.user_id || '', name_branch: b.name_branch, address: b.address, phone: b.phone }); setModal({ open: true, edit: b }); };
  const closeModal = () => setModal({ open: false, edit: null });

  const handleSave = async () => {
    if (!form.name_branch || !form.address) { toast.error('Vui lòng điền đủ thông tin'); return; }
    setSaving(true);
    try {
      if (modal.edit) {
        await branchService.update(modal.edit.id, form);
        toast.success('Cập nhật chi nhánh thành công');
      } else {
        await branchService.create(form);
        toast.success('Thêm chi nhánh thành công');
      }
      load(); closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi xảy ra');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa chi nhánh này?')) return;
    try {
      await branchService.delete(id);
      toast.success('Xóa thành công');
      load();
    } catch { toast.error('Không thể xóa chi nhánh'); }
  };

  const filtered = branches.filter(b =>
    b.name_branch?.toLowerCase().includes(search.toLowerCase()) ||
    b.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page">
          <div className="admin-page-header">
            <div>
              <h2>🏢 Quản lý chi nhánh</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
                Tổng cộng {branches.length} chi nhánh
              </p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>+ Thêm chi nhánh</button>
          </div>

          <div className="search-bar" style={{ maxWidth: 380, marginBottom: 20 }}>
            <span>🔍</span>
            <input placeholder="Tìm chi nhánh..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🏢</div><p>Không có chi nhánh nào</p></div>
            ) : (
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr><th>#</th><th>Tên chi nhánh</th><th>Địa chỉ</th><th>Số điện thoại</th><th>Người quản lý</th><th>Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, i) => (
                      <tr key={b.id}>
                        <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.name_branch}</span></td>
                        <td>📍 {b.address}</td>
                        <td>📞 {b.phone}</td>
                        <td>
                          {b.manager_name ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>👤 {b.manager_name}</span>
                              {b.manager_email && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>✉ {b.manager_email}</span>}
                              {b.manager_phone && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📞 {b.manager_phone}</span>}
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa có quản lý</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => openEdit(b)}>✏ Sửa</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>🗑 Xóa</button>
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

      <Modal
        isOpen={modal.open} onClose={closeModal}
        title={modal.edit ? '✏ Sửa chi nhánh' : '+ Thêm chi nhánh'}
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
          <label className="form-label">Tên chi nhánh *</label>
          <input className="form-input" placeholder="VD: Chi nhánh Quận 1" value={form.name_branch} onChange={e => setForm({ ...form, name_branch: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Địa chỉ *</label>
          <input className="form-input" placeholder="Số nhà, đường, quận..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Số điện thoại</label>
          <input className="form-input" placeholder="0909xxxxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">User ID (quản lý)</label>
          <input className="form-input" type="number" placeholder="ID người quản lý" value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
