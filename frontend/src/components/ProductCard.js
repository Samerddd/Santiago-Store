import { useState } from 'react';
import { C, Badge, Price } from './UI';

export default function ProductCard({ product, onView, onAddCart }) {
  const [hov, setHov] = useState(false);
  const outOfStock = product.stock === 0;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: C.bgCard, border: `1px solid ${hov ? C.borderHover : C.border}`,
        borderRadius: '16px', overflow: 'hidden', transition: 'all 0.22s',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? `0 12px 40px rgba(255,107,0,0.15)` : 'none',
      }}>
      {/* Image */}
      <div style={{ height: '210px', position: 'relative', overflow: 'hidden', background: C.bgPanel, cursor: 'pointer' }} onClick={() => onView(product)}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hov ? 'scale(1.05)' : 'scale(1)' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="1" width="48" height="48"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span style={{ color: C.textMuted, fontSize: '12px' }}>لا توجد صورة</span>
          </div>
        )}

        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <Badge>{product.category_name}</Badge>
        </div>

        {outOfStock && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: C.danger, fontWeight: '800', fontSize: '16px', border: `2px solid ${C.danger}`, padding: '5px 14px', borderRadius: '8px' }}>نفذ المخزون</span>
          </div>
        )}

        {!outOfStock && product.stock <= 5 && (
          <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <Badge color={C.warning}>آخر {product.stock}</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ color: C.text, fontWeight: '700', fontSize: '15px', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => onView(product)}>
          {product.name}
        </h3>
        {product.description && (
          <p style={{ color: C.textSub, fontSize: '13px', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Price amount={product.price} size="md" />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onView(product)}
              style={{ padding: '7px 12px', borderRadius: '8px', background: 'transparent', border: `1.5px solid ${C.border}`, color: C.textSub, cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit', fontWeight: '600', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}>
              عرض
            </button>
            <button onClick={() => !outOfStock && onAddCart(product)} disabled={outOfStock}
              style={{ padding: '7px 14px', borderRadius: '8px', background: outOfStock ? C.bgPanel : C.orange, color: outOfStock ? C.textMuted : '#fff', border: 'none', cursor: outOfStock ? 'not-allowed' : 'pointer', fontSize: '12px', fontFamily: 'inherit', fontWeight: '700', transition: 'all 0.2s' }}>
              أضف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const C = { bgCard: '#161616', bgPanel: '#1a1a1a', border: 'rgba(255,107,0,0.15)', borderHover: 'rgba(255,107,0,0.4)', text: '#fff', textSub: '#a0a0a0', textMuted: '#555', orange: '#ff6b00', danger: '#ef4444', warning: '#f59e0b' };
