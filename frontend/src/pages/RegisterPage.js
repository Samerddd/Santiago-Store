import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { C, Btn, Input, Alert, Card } from '../components/UI';

export default function RegisterPage({ setPage }) {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    if (user) setPage(user.role === 'admin' ? 'admin' : 'dashboard');
  }, [user]);

  const set = (k) => (v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (form.username.length < 3) e.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'بريد إلكتروني غير صالح.';
    if (form.password.length < 6) e.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.';
    if (form.password !== form.confirm) e.confirm = 'كلمتا المرور غير متطابقتين.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setGlobalError('');
    try {
      const { token, user: userData } = await api.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(token, userData);
      setPage('dashboard');
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: '20px' }} dir="rtl">
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '56px', height: '56px', background: C.orange, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontWeight: '900', color: '#fff', fontSize: '28px' }}>S</div>
          <h1 style={{ color: C.text, fontWeight: '900', fontSize: '26px', marginBottom: '6px' }}>إنشاء حساب جديد</h1>
          <p style={{ color: C.textSub, fontSize: '14px' }}>Santiago Sports Store</p>
        </div>

        <Card style={{ padding: '32px' }}>
          <Alert type="error" message={globalError} />
          <Input label="اسم المستخدم" value={form.username} onChange={set('username')} placeholder="مثال: ahmed2024" required error={errors.username} autoFocus />
          <Input label="البريد الإلكتروني" value={form.email} onChange={set('email')} type="email" placeholder="example@email.com" required error={errors.email} />
          <Input label="كلمة المرور" value={form.password} onChange={set('password')} type="password" placeholder="6 أحرف على الأقل" required error={errors.password} />
          <Input label="تأكيد كلمة المرور" value={form.confirm} onChange={set('confirm')} type="password" placeholder="أعد كتابة كلمة المرور" required error={errors.confirm} />
          <Btn fullWidth size="lg" onClick={handleSubmit} disabled={loading}>
            {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
          </Btn>
        </Card>

        <p style={{ textAlign: 'center', marginTop: '20px', color: C.textSub, fontSize: '14px' }}>
          لديك حساب بالفعل؟{' '}
          <button onClick={() => setPage('login')} style={{ background: 'none', border: 'none', color: C.orange, cursor: 'pointer', fontFamily: 'inherit', fontWeight: '700', fontSize: '14px' }}>
            تسجيل الدخول
          </button>
        </p>
      </div>
    </div>
  );
}
