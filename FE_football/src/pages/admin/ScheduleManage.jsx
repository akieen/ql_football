import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Modal from '../../components/Modal';
import { scheduleService } from '../../services/scheduleService';
import { pitchService } from '../../services/pitchService';
import { branchService } from '../../services/branchService';
import toast from 'react-hot-toast';

const DAYS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const EMPTY = { pitch_id: '', date_of_week: '1', open_time: '06:00', close_time: '22:00', slot_duration_minutes: '60', price_override: '', is_active: 1 };

export default function ScheduleManage() {
  const [schedules, setSchedules] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, edit: null });
  const [form, setForm] = useState(EMPTY);
  const [selectedBranch, setSelectedBranch] = useState(''); // chi nhánh chọn trong modal
  const [filterBranch, setFilterBranch] = useState('');    // chi nhánh lọc bảng
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([scheduleService.getAll(), pitchService.getAll(), branchService.getAll()])
      .then(([s, p, b]) => {
        setSchedules(s.data.data || []);
        setPitches(p.data.data || []);
        setBranches(b.data.data || []);
      })
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setSelectedBranch('');
    setModal({ open: true, edit: null });
  };

  const openEdit = (s) => {
    // Tìm branch_id của sân đang sửa
    const pitch = pitches.find(p => p.id === s.pitch_id);
    setSelectedBranch(pitch ? String(pitch.branch_id) : '');
    setForm({
      pitch_id: s.pitch_id,
      date_of_week: String(s.date_of_week),
      open_time: s.open_time,
      close_time: s.close_time,
      slot_duration_minutes: String(s.slot_duration_minutes),
      price_override: s.price_override || '',
      is_active: s.is_active
    });
    setModal({ open: true, edit: s });
  };

  const closeModal = () => { setModal({ open: false, edit: null }); setSelectedBranch(''); };

  const handleSave = async () => {
    if (!form.pitch_id) { toast.error('Vui lòng chọn sân'); return; }
    setSaving(true);
    try {
      if (modal.edit) {
        await scheduleService.update(modal.edit.id, form);
        toast.success('Cập nhật lịch thành công');
      } else {
        await scheduleService.create(form);
        toast.success('Thêm lịch thành công');
      }
      load(); closeModal();
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi xảy ra'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa lịch này?')) return;
    try { await scheduleService.delete(id); toast.success('Xóa thành công'); load(); }
    catch { toast.error('Không thể xóa'); }
  };

  const getPitch = (id) => pitches.find(p => p.id === id);
  const getBranch = (id) => branches.find(b => b.id === id);

  // Sân thuộc chi nhánh đang chọn trong modal
  const pitchesInBranch = selectedBranch
    ? pitches.filter(p => String(p.branch_id) === String(selectedBranch))
    : [];

  // Lọc danh sách lịch theo chi nhánh (bảng chính)
  const filteredSchedules = filterBranch
    ? schedules.filter(s => {
        const p = getPitch(s.pitch_id);
        return p && String(p.branch_id) === String(filterBranch);
      })
    : schedules;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page">
          <div className="admin-page-header">
            <div>
              <h2>📅 Quản lý lịch hoạt động</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>Tổng cộng {schedules.length} lịch</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>+ Thêm lịch</button>
          </div>

          {/* Filter chi nhánh cho bảng */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>🏢 Lọc theo chi nhánh:</span>
            <select
              className="form-input"
              style={{ maxWidth: 260, margin: 0 }}
              value={filterBranch}
              onChange={e => setFilterBranch(e.target.value)}
            >
              <option value="">-- Tất cả chi nhánh --</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name_branch}</option>
              ))}
            </select>
            {filterBranch && (
              <button className="btn btn-ghost btn-sm" onClick={() => setFilterBranch('')}>✕ Xóa lọc</button>
            )}
          </div>

          <div className="card" style={{ padding: 0 }}>
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : filteredSchedules.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📅</div><p>Chưa có lịch nào</p></div>
            ) : (
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Sân</th>
                      <th>Chi nhánh</th>
                      <th>Ngày trong tuần</th>
                      <th>Giờ mở – đóng</th>
                      <th>Slot (phút)</th>
                      <th>Giá override</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchedules.map((s, i) => {
                      const pitch = getPitch(s.pitch_id);
                      const branch = pitch ? getBranch(pitch.branch_id) : null;
                      return (
                        <tr key={s.id}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td style={{ fontWeight: 600 }}>{pitch?.name || `Sân #${s.pitch_id}`}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                            🏢 {branch?.name_branch || '—'}
                          </td>
                          <td>{DAYS[s.date_of_week]}</td>
                          <td>{s.open_time} – {s.close_time}</td>
                          <td>{s.slot_duration_minutes} phút</td>
                          <td>{s.price_override ? `${Number(s.price_override).toLocaleString('vi-VN')}đ` : '—'}</td>
                          <td><span className={`badge ${s.is_active ? 'badge-green' : 'badge-red'}`}>{s.is_active ? 'Mở' : 'Đóng'}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>✏</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>🗑</button>
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
        title={modal.edit ? '✏ Sửa lịch hoạt động' : '+ Thêm lịch hoạt động'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={closeModal}>Hủy</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳...' : '💾 Lưu'}</button>
          </>
        }
      >
        {/* Bước 1: Chọn chi nhánh */}
        <div className="form-group">
          <label className="form-label">Chi nhánh *</label>
          <select
            className="form-input"
            value={selectedBranch}
            onChange={e => { setSelectedBranch(e.target.value); setForm({ ...form, pitch_id: '' }); }}
          >
            <option value="">-- Chọn chi nhánh --</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name_branch}</option>
            ))}
          </select>
        </div>

        {/* Bước 2: Chọn sân (chỉ hiện sân thuộc chi nhánh) */}
        <div className="form-group">
          <label className="form-label">Sân bóng *</label>
          <select
            className="form-input"
            value={form.pitch_id}
            onChange={e => setForm({ ...form, pitch_id: e.target.value })}
            disabled={!selectedBranch}
          >
            <option value="">
              {selectedBranch ? '-- Chọn sân --' : '-- Chọn chi nhánh trước --'}
            </option>
            {pitchesInBranch.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {selectedBranch && pitchesInBranch.length === 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Chi nhánh này chưa có sân nào.
            </p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Ngày trong tuần *</label>
          <select className="form-input" value={form.date_of_week} onChange={e => setForm({ ...form, date_of_week: e.target.value })}>
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Giờ mở *</label>
            <input lang="en-GB" type="time" className="form-input" value={form.open_time} onChange={e => setForm({ ...form, open_time: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Giờ đóng *</label>
            <input lang="en-GB" type="time" className="form-input" value={form.close_time} onChange={e => setForm({ ...form, close_time: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Slot (phút) *</label>
            <input type="number" className="form-input" value={form.slot_duration_minutes} onChange={e => setForm({ ...form, slot_duration_minutes: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Giá override (đ)</label>
            <input type="number" className="form-input" placeholder="Để trống = dùng giá sân" value={form.price_override} onChange={e => setForm({ ...form, price_override: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Trạng thái</label>
          <select className="form-input" value={form.is_active} onChange={e => setForm({ ...form, is_active: Number(e.target.value) })}>
            <option value={1}>Mở</option>
            <option value={0}>Đóng</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
