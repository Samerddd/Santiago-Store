import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import { C, Btn, Badge, Price, Spinner, StatusBadge } from '../components/UI';

export default function ProductPage({ productId, setPage }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.getProduct(productId)
      .then(r => setProduct(r.product))
      .catch(() => setPage('shop'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Spinner size={40} /></div>;
  if (!product) return null;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px' }} dir="rtl">
      <button onClick={() => setPage('shop')} style={{ background: 'none', border: 'none', color: C.textSub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '28px', fontFamily: 'inherit', fontSize: '14px' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
        العودة للمتجر
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '52px', alignItems: 'start' }}>
        {/* Images */}
        <div>
          <div style={{ background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '18px', height: '420px', overflow: 'hidden', marginBottom: '12px' }}>
            {product.images?.[activeImg] ? (
              <img src={product.images[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="1" width="56" height="56"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span style={{ color: C.textMuted, fontSize: '13px' }}>لا توجد صورة</span>
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', border: `2px solid ${activeImg === i ? C.orange : 'transparent'}`, cursor: 'pointer', background: 'none', padding: 0, flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category_name && <div style={{ marginBottom: '10px' }}><Badge>{product.category_name}</Badge></div>}
          <h1 style={{ color: C.text, fontWeight: '900', fontSize: '32px', lineHeight: '1.2', marginBottom: '16px' }}>{product.name}</h1>
          <Price amount={product.price} size="xl" />

          {product.description && (
            <div style={{ background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px', margin: '20px 0', color: C.textSub, lineHeight: '1.8', fontSize: '15px' }}>
              {product.description}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ color: C.textSub, fontSize: '14px' }}>المخزون:</span>
            <Badge color={product.stock > 5 ? C.success : product.stock > 0 ? C.warning : C.danger}>
              {product.stock > 0 ? `${product.stock} قطعة متاحة` : 'نفذ المخزون'}
            </Badge>
          </div>

          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
              <span style={{ color: C.textSub, fontSize: '14px' }}>الكمية:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '4px 8px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,107,0,0.15)', border: 'none', cursor: 'pointer', color: C.orange, fontWeight: '700', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>-</button>
                <span style={{ color: C.text, fontWeight: '700', width: '36px', textAlign: 'center', fontSize: '18px' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,107,0,0.15)', border: 'none', cursor: 'pointer', color: C.orange, fontWeight: '700', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>+</button>
              </div>
            </div>
          )}

          <Btn fullWidth size="lg" onClick={handleAdd} disabled={product.stock === 0}
            style={{ background: added ? C.success : C.orange, fontSize: '16px' }}>
            {added ? 'تمت الإضافة للسلة' : product.stock === 0 ? 'نفذ المخزون' : 'إضافة إلى السلة'}
          </Btn>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[['شحن سريع لجميع المناطق'], ['إرجاع مجاني خلال 30 يوم'], ['منتج أصلي ومضمون']].map(([t]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.textSub, fontSize: '13px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const C = { orange: '#ff6b00', bgPanel: '#1a1a1a', bgCard: '#161616', border: 'rgba(255,107,0,0.15)', text: '#fff', textSub: '#a0a0a0', textMuted: '#555', success: '#22c55e', warning: '#f59e0b', danger: '#ef4444' };
