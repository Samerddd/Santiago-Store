import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { C, Btn, Input, Alert, Price } from '../components/UI';

export default function CheckoutPage({ setPage }) {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: user?.username || '', phone: '', address: '', city: '', payment: 'cash' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  const shipping = total >= 300 ? 0 : 30;
  const grandTotal = total + shipping;
  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  if (!user) { setPage('login'); return null; }
  if (cart.length === 0 && !orderId) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><div style={{ textAlign: 'center' }}><p style={{ color: C.textSub, marginBottom: '16px' }}>السلة فارغة</p><Btn onClick={() => setPage('shop')}>تسوق الآن</Btn></div></div>;
  }

  if (orderId) {
    return (
      <div style={{ maxWidth: '480px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }} dir="rtl">
        <div style={{ width: '72px', height: '72px', background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="36" height="36"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ color: C.text, fontWeight: '900', fontSize: '26px', marginBottom: '8px' }}>تم تأكيد طلبك</h2>
        <p style={{ color: C.textSub, marginBottom: '6px' }}>رقم الطلب: <strong style={{ color: C.orange }}>{orderId.slice(0, 8).toUpperCase()}</strong></p>
        <p style={{ color: C.textSub, marginBottom: '32px', fontSize: '14px' }}>سيتم التواصل معك قريباً لتأكيد الشحن</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Btn onClick={() => setPage('dashboard')}>طلباتي</Btn>
          <Btn variant="outline" onClick={() => setPage('home')}>الرئيسية</Btn>
        </div>
      </div>
    );
  }

  const placeOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const { orderId: id } = await api.createOrder({
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        shipping: { name: form.name, phone: form.phone, address: form.address, city: form.city },
        payment_method: form.payment,
      });
      clearCart();
      setOrderId(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '40px 20px' }} dir="rtl">
      <h1 style={{ color: C.text, fontWeight: '900', fontSize: '28px', marginBottom: '36px' }}>إتمام الشراء</h1>

      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
        {['معلومات الشحن', 'الدفع'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', background: step > i ? C.success : step === i + 1 ? C.orange : C.bgPanel, color: step >= i + 1 ? '#fff' : C.textMuted, border: `2px solid ${step >= i + 1 ? (step > i ? C.success : C.orange) : C.border}` }}>{step > i ? '✓' : i + 1}</div>
            <span style={{ color: step === i + 1 ? C.text : C.textMuted, fontSize: '14px', fontWeight: '600' }}>{s}</span>
            {i === 0 && <span style={{ color: C.textMuted, margin: '0 4px' }}>—</span>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
        <div>
          <Alert type="error" message={error} />
          {step === 1 ? (
            <div style={{ background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
              <h2 style={{ color: C.text, fontWeight: '800', marginBottom: '22px' }}>معلومات الشحن</h2>
              <Input label="الاسم الكامل" value={form.name} onChange={set('name')} required placeholder="الاسم الكامل" />
              <Input label="رقم الهاتف" value={form.phone} onChange={set('phone')} required placeholder="05xxxxxxxx" />
              <Input label="المدينة" value={form.city} onChange={set('city')} required placeholder="المدينة" />
              <Input label="العنوان التفصيلي" value={form.address} onChange={set('address')} required rows={3} placeholder="الحي، الشارع، رقم المبنى..." />
              <Btn fullWidth size="lg" disabled={!form.name || !form.phone || !form.city || !form.address} onClick={() => setStep(2)}>
                التالي: الدفع
              </Btn>
            </div>
          ) : (
            <div style={{ background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
              <h2 style={{ color: C.text, fontWeight: '800', marginBottom: '22px' }}>طريقة الدفع</h2>
              {[['cash', 'الدفع عند الاستلام', 'ادفع نقداً عند استلام طلبك'], ['card', 'بطاقة ائتمانية', 'فيزا أو ماستركارد']].map(([val, title, desc]) => (
                <button key={val} onClick={() => set('payment')(val)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '15px', borderRadius: '12px', border: `2px solid ${form.payment === val ? C.orange : C.border}`, background: form.payment === val ? 'rgba(255,107,0,0.08)' : 'transparent', cursor: 'pointer', marginBottom: '12px', textAlign: 'right', fontFamily: 'inherit' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.text, fontWeight: '700', fontSize: '15px' }}>{title}</div>
                    <div style={{ color: C.textSub, fontSize: '13px' }}>{desc}</div>
                  </div>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${form.payment === val ? C.orange : C.textMuted}`, background: form.payment === val ? C.orange : 'transparent', flexShrink: 0 }} />
                </button>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <Btn variant="outline" style={{ flex: 1 }} onClick={() => setStep(1)}>السابق</Btn>
                <Btn style={{ flex: 2 }} size="lg" onClick={placeOrder} disabled={loading}>{loading ? 'جارٍ التأكيد...' : 'تأكيد الطلب'}</Btn>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={{ background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', position: 'sticky', top: '100px' }}>
          <h3 style={{ color: C.text, fontWeight: '700', marginBottom: '16px' }}>ملخص الطلب</h3>
          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '14px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: C.text, fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                  <div style={{ color: C.textSub, fontSize: '12px' }}>x{item.qty}</div>
                </div>
                <Price amount={item.price * item.qty} size="sm" />
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '12px' }}>
            <Row label="المجموع" value={<Price amount={total} size="sm" />} />
            <Row label="الشحن" value={<span style={{ color: shipping === 0 ? C.success : C.textSub, fontSize: '14px', fontWeight: '600' }}>{shipping === 0 ? 'مجاني' : `₪${shipping}`}</span>} />
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: '10px', marginTop: '8px' }}>
              <span style={{ color: C.text, fontWeight: '700' }}>الإجمالي</span>
              <Price amount={grandTotal} size="md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ color: C.textSub, fontSize: '14px' }}>{label}</span>
      {value}
    </div>
  );
}

const C = { orange: '#ff6b00', bgPanel: '#1a1a1a', border: 'rgba(255,107,0,0.15)', text: '#fff', textSub: '#a0a0a0', textMuted: '#555', success: '#22c55e' };
