import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { C, Btn, Price } from './UI';

export default function CartSidebar({ open, onClose, setPage }) {
  const { cart, updateQty, removeFromCart, total, count } = useCart();
  const { user } = useAuth();

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }} onClick={onClose} />
      <div style={{ width: '380px', maxWidth: '95vw', background: C.bg, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', height: '100%' }} dir="rtl">
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: C.text, fontWeight: '800', fontSize: '18px' }}>سلة التسوق ({count})</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textSub, cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ color: C.textSub, fontSize: '16px', marginBottom: '20px' }}>السلة فارغة</div>
              <Btn size="sm" onClick={() => { onClose(); setPage('shop'); }}>تصفح المنتجات</Btn>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '12px', marginBottom: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '58px', height: '58px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: C.bgPanel }}>
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, fontSize: '12px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="1.5" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: C.text, fontWeight: '600', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                <Price amount={item.price} size="sm" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                  <QtyBtn onClick={() => updateQty(item.id, item.qty - 1)}>-</QtyBtn>
                  <span style={{ color: C.text, fontWeight: '700', width: '28px', textAlign: 'center' }}>{item.qty}</span>
                  <QtyBtn onClick={() => updateQty(item.id, item.qty + 1)}>+</QtyBtn>
                  <button onClick={() => removeFromCart(item.id)} style={{ marginRight: 'auto', background: 'none', border: 'none', color: C.danger, cursor: 'pointer', padding: '4px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '16px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', alignItems: 'center' }}>
              <span style={{ color: C.textSub, fontWeight: '600' }}>الإجمالي:</span>
              <Price amount={total} size="lg" />
            </div>
            <Btn fullWidth size="lg" onClick={() => {
              onClose();
              if (!user) { setPage('login'); return; }
              setPage('checkout');
            }}>
              {user ? 'إتمام الشراء' : 'سجل الدخول للمتابعة'}
            </Btn>
            <button onClick={onClose} style={{ display: 'block', width: '100%', marginTop: '8px', background: 'none', border: 'none', color: C.textSub, cursor: 'pointer', padding: '8px', fontFamily: 'inherit', fontSize: '13px' }}>
              مواصلة التسوق
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QtyBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,107,0,0.15)', border: 'none', cursor: 'pointer', color: '#ff6b00', fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>
      {children}
    </button>
  );
}
