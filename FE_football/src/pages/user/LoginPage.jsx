import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      toast.success('Đăng nhập thành công!');
      if (res.data.data.role == "admin") navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div style={{ fontSize: '2.5rem' }}>⚽</div>
          <h2>Chào mừng trở lại</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
            Đăng nhập để đặt sân bóng ngay
          </p>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: 8 }}>⚠ {error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email" className="form-input" placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password" className="form-input" placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? '⏳ Đang đăng nhập...' : '🔑 Đăng nhập'}
          </button>
        </form>

        <p className="auth-footer">
          Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Đăng ký ngay</Link>
        </p>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: '0.85rem', color: 'var(--text-muted)',
            textDecoration: 'none', transition: 'var(--transition)'
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            ← Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
