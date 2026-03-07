import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { C, Btn } from './UI';

export default function Navbar({ page, setPage, setCartOpen }) {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'shop', label: 'المتجر' },
    { id: 'contact', label: 'اتصل بنا' },
  ];

  return (
    <>
      {/* Top announcement */}
      <div style={{ background: C.orange, color: '#fff', textAlign: 'center', padding: '8px 16px', fontSize: '13px', fontWeight: '600' }}>
        شحن مجاني على الطلبات فوق ₪300
      </div>

      <nav style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '66px' }} dir="rtl">

          {/* Logo */}
          <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', background: C.orange, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff', fontSize: '20px', letterSpacing: '-1px' }}>S</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: C.text, fontWeight: '900', fontSize: '16px' }}>Santiago Store</div>
              <div style={{ color: C.orange, fontSize: '11px', fontWeight: '600' }}>متجر الرياضة</div>
            </div>
          </button>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {navLinks.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)}
                style={{ background: page === n.id ? C.orangeLight : 'none', color: page === n.id ? C.orange : C.textSub, border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {n.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Cart */}
            <button onClick={() => setCartOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textSub, position: 'relative', padding: '8px', display: 'flex', alignItems: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              {count > 0 && (
                <span style={{ position: 'absolute', top: '2px', left: '2px', background: C.orange, color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.orangeLight, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '6px 12px', cursor: 'pointer', color: C.text, fontFamily: 'inherit', fontSize: '13px', fontWeight: '600' }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff' }}>{user.username?.[0]?.toUpperCase()}</div>
                  )}
                  {user.username}
                </button>
                {userMenuOpen && (
                  <div style={{ position: 'absolute', top: '42px', left: 0, background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '12px', minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden' }}>
                    {isAdmin && (
                      <MenuBtn onClick={() => { setPage('admin'); setUserMenuOpen(false); }}>لوحة التحكم</MenuBtn>
                    )}
                    <MenuBtn onClick={() => { setPage('dashboard'); setUserMenuOpen(false); }}>لوحة المستخدم</MenuBtn>
                    <div style={{ borderTop: `1px solid ${C.border}` }} />
                    <MenuBtn onClick={() => { logout(); setUserMenuOpen(false); setPage('home'); }} danger>تسجيل الخروج</MenuBtn>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Btn variant="ghost" size="sm" onClick={() => setPage('login')}>دخول</Btn>
                <Btn size="sm" onClick={() => setPage('register')}>تسجيل</Btn>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

function MenuBtn({ children, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      style={{ display: 'block', width: '100%', textAlign: 'right', padding: '11px 16px', background: hov ? 'rgba(255,255,255,0.05)' : 'none', border: 'none', color: danger ? C.danger : C.text, cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', transition: 'background 0.15s' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

const C_local = { orange: '#ff6b00', textSub: '#a0a0a0', text: '#fff', danger: '#ef4444', orangeLight: 'rgba(255,107,0,0.12)', border: 'rgba(255,107,0,0.15)', bg: '#0d0d0d', bgPanel: '#1a1a1a' };
