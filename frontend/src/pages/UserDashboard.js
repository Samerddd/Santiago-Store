import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { C, Btn, Card, StatusBadge, Spinner, Price } from '../components/UI';

export default function UserDashboard({ setPage }) {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('overview');

  useEffect(() => {
    if (!user) { setPage('login'); return; }
    api.myOrders()
      .then(r => setOrders(r.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'orders', label: `طلباتي (${orders.length})` },
    { id: 'profile', label: 'الملف الشخصي' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }} dir="rtl">
      <h1 style={{ color: C.text, fontWeight: '900', fontSize: '28px', marginBottom: '32px' }}>
        مرحباً، {user.username}
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: `1px solid ${C.border}`, marginBottom: '32px' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)}
            style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${section === t.id ? C.orange : 'transparent'}`, color: section === t.id ? C.orange : C.textSub, cursor: 'pointer', fontFamily: 'inherit', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s', marginBottom: '-1px' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {section === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              ['إجمالي الطلبات', orders.length],
              ['الطلبات المكتملة', orders.filter(o => o.status === 'delivered').length],
              ['الطلبات قيد التنفيذ', orders.filter(o => o.status === 'processing' || o.status === 'shipped').length],
            ].map(([label, val]) => (
              <Card key={label} style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ color: C.orange, fontWeight: '900', fontSize: '36px' }}>{val}</div>
                <div style={{ color: C.textSub, fontSize: '14px', marginTop: '4px' }}>{label}</div>
              </Card>
            ))}
          </div>

          <h2 style={{ color: C.text, fontWeight: '700', marginBottom: '16px' }}>آخر الطلبات</h2>
          {loading ? <Spinner /> : orders.slice(0, 3).map(o => <OrderRow key={o.id} order={o} />)}
          {orders.length > 3 && <Btn variant="outline" size="sm" style={{ marginTop: '12px' }} onClick={() => setSection('orders')}>عرض جميع الطلبات</Btn>}
          {orders.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: C.textSub }}>
              لا توجد طلبات بعد.{' '}
              <button onClick={() => setPage('shop')} style={{ background: 'none', border: 'none', color: C.orange, cursor: 'pointer', fontFamily: 'inherit', fontWeight: '700' }}>تسوق الآن</button>
            </div>
          )}
        </div>
      )}

      {/* Orders */}
      {section === 'orders' && (
        <div>
          <h2 style={{ color: C.text, fontWeight: '800', marginBottom: '20px' }}>جميع طلباتي</h2>
          {loading ? <Spinner /> : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: C.textSub }}>لا توجد طلبات. <button onClick={() => setPage('shop')} style={{ background: 'none', border: 'none', color: C.orange, cursor: 'pointer', fontFamily: 'inherit', fontWeight: '700' }}>تسوق الآن</button></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map(o => <OrderRow key={o.id} order={o} detailed />)}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {section === 'profile' && (
        <div style={{ maxWidth: '480px' }}>
          <Card style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '24px', color: '#fff', flexShrink: 0 }}>
                {user.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ color: C.text, fontWeight: '800', fontSize: '18px' }}>{user.username}</div>
                <div style={{ color: C.textSub, fontSize: '14px' }}>{user.email}</div>
                <div style={{ marginTop: '6px' }}><span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '6px', padding: '2px 10px', fontSize: '12px', fontWeight: '700' }}>مستخدم نشط</span></div>
              </div>
            </div>
            {[['اسم المستخدم', user.username], ['البريد الإلكتروني', user.email], ['نوع الحساب', user.role === 'admin' ? 'مسؤول' : 'مستخدم'], ['طريقة التسجيل', user.google_id ? 'Google' : 'بريد وكلمة مرور']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.textSub, fontSize: '14px' }}>{l}</span>
                <span style={{ color: C.text, fontSize: '14px', fontWeight: '600' }}>{v}</span>
              </div>
            ))}
          </Card>
          <Btn variant="danger" style={{ marginTop: '16px' }} onClick={() => { logout(); setPage('home'); }}>تسجيل الخروج</Btn>
        </div>
      )}
    </div>
  );
}

function OrderRow({ order, detailed }) {
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ color: C.orange, fontWeight: '700', fontSize: '14px' }}>#{order.id?.slice(0, 8).toUpperCase()}</span>
            <StatusBadge status={order.status} />
          </div>
          <div style={{ color: C.textSub, fontSize: '13px' }}>
            {new Date(order.created_at).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {detailed && order.item_names && (
            <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '4px' }}>{order.item_names}</div>
          )}
        </div>
        <Price amount={order.total} size="md" />
      </div>
    </div>
  );
}

const C = { orange: '#ff6b00', bgCard: '#161616', bgPanel: '#1a1a1a', border: 'rgba(255,107,0,0.15)', text: '#fff', textSub: '#a0a0a0', textMuted: '#555' };
