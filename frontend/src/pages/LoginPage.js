import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { C, Btn, Input, Alert, Card } from '../components/UI';

export default function LoginPage({ setPage }) {
  const { login, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setPage(user.role === 'admin' ? 'admin' : 'dashboard');
  }, [user]);

  // Initialize Google Sign-In
  useEffect(() => {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!googleClientId || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCallback,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'filled_black', size: 'large', width: '100%', text: 'signin_with', locale: 'ar' }
    );
  }, []);

  const handleGoogleCallback = async (response) => {
    setLoading(true);
    setError('');
    try {
      const { token, user: userData } = await api.googleAuth(response.credential);
      login(token, userData);
      setPage(userData.role === 'admin' ? 'admin' : 'dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!username || !password) { setError('يرجى تعبئة جميع الحقول.'); return; }
    setLoading(true);
    setError('');
    try {
      const { token, user: userData } = await api.login({ username, password });
      login(token, userData);
      setPage(userData.role === 'admin' ? 'admin' : 'dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: '20px' }} dir="rtl">
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '56px', height: '56px', background: C.orange, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontWeight: '900', color: '#fff', fontSize: '28px' }}>S</div>
          <h1 style={{ color: C.text, fontWeight: '900', fontSize: '26px', marginBottom: '6px' }}>تسجيل الدخول</h1>
          <p style={{ color: C.textSub, fontSize: '14px' }}>Santiago Sports Store</p>
        </div>

        <Card style={{ padding: '32px' }}>
          <Alert type="error" message={error} />

          {/* Google Sign-In */}
          <div style={{ marginBottom: '20px' }}>
            <div id="google-signin-btn" style={{ width: '100%' }} />
            {!process.env.REACT_APP_GOOGLE_CLIENT_ID && (
              <div style={{ background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '11px 14px', color: C.textMuted, fontSize: '13px', textAlign: 'center' }}>
                تسجيل الدخول بـ Google (يتطلب إعداد REACT_APP_GOOGLE_CLIENT_ID)
              </div>
            )}
          </div>

          <Divider text="أو" />

          {/* Username/password form */}
          <div>
            <Input label="اسم المستخدم أو البريد الإلكتروني" value={username} onChange={setUsername} placeholder="أدخل اسم المستخدم" required autoFocus />
            <Input label="كلمة المرور" value={password} onChange={setPassword} type="password" placeholder="أدخل كلمة المرور" required />
            <Btn fullWidth size="lg" onClick={handleSubmit} disabled={loading} type="submit">
              {loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
            </Btn>
          </div>
        </Card>

        <p style={{ textAlign: 'center', marginTop: '20px', color: C.textSub, fontSize: '14px' }}>
          ليس لديك حساب؟{' '}
          <button onClick={() => setPage('register')} style={{ background: 'none', border: 'none', color: C.orange, cursor: 'pointer', fontFamily: 'inherit', fontWeight: '700', fontSize: '14px' }}>
            إنشاء حساب جديد
          </button>
        </p>
        <p style={{ textAlign: 'center', marginTop: '8px' }}>
          <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
            العودة للمتجر
          </button>
        </p>

        {/* Demo hint */}
        <div style={{ background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '12px 16px', marginTop: '16px', fontSize: '12px', color: C.textMuted, textAlign: 'center' }}>
          للدخول كمسؤول: username: admin | password: admin123
        </div>
      </div>
    </div>
  );
}

function Divider({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
      <div style={{ flex: 1, height: '1px', background: C.border }} />
      <span style={{ color: C.textMuted, fontSize: '13px' }}>{text}</span>
      <div style={{ flex: 1, height: '1px', background: C.border }} />
    </div>
  );
}
