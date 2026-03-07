import { useState } from 'react';

// ─── Design tokens ────────────────────────────────────────────
export const C = {
  orange: '#ff6b00',
  orangeHover: '#e55f00',
  orangeLight: 'rgba(255,107,0,0.12)',
  bg: '#0d0d0d',
  bgCard: '#161616',
  bgPanel: '#1a1a1a',
  bgInput: '#111111',
  border: 'rgba(255,107,0,0.15)',
  borderHover: 'rgba(255,107,0,0.4)',
  text: '#ffffff',
  textSub: '#a0a0a0',
  textMuted: '#555555',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

// ─── Button ────────────────────────────────────────────────────
export function Btn({ children, onClick, type = 'button', variant = 'primary', size = 'md', disabled, fullWidth, style }) {
  const [hov, setHov] = useState(false);

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    fontFamily: 'inherit', fontWeight: '700', cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: '10px', transition: 'all 0.18s',
    width: fullWidth ? '100%' : undefined, opacity: disabled ? 0.5 : 1,
    padding: size === 'sm' ? '7px 16px' : size === 'lg' ? '14px 32px' : '10px 22px',
    fontSize: size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px',
  };

  const variants = {
    primary: { background: hov && !disabled ? C.orangeHover : C.orange, color: '#fff' },
    outline: { background: 'transparent', color: C.orange, border: `1.5px solid ${C.orange}`, ...(hov && !disabled ? { background: C.orangeLight } : {}) },
    ghost: { background: hov && !disabled ? 'rgba(255,255,255,0.07)' : 'transparent', color: C.textSub },
    danger: { background: hov && !disabled ? '#dc2626' : C.danger, color: '#fff' },
    success: { background: hov && !disabled ? '#16a34a' : C.success, color: '#fff' },
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────
export function Input({ label, value, onChange, type = 'text', placeholder, required, error, rows, options, min, disabled, autoFocus }) {
  const [focused, setFocused] = useState(false);
  const inputStyle = {
    background: C.bgInput, border: `1px solid ${error ? C.danger : focused ? C.orange : C.border}`,
    borderRadius: '10px', color: C.text, outline: 'none', width: '100%',
    padding: '11px 14px', fontSize: '14px', fontFamily: 'inherit', direction: 'rtl',
    transition: 'border-color 0.2s',
  };
  return (
    <div style={{ marginBottom: '18px' }}>
      {label && (
        <label style={{ display: 'block', color: C.textSub, fontSize: '13px', marginBottom: '7px', fontWeight: '600' }}>
          {label}{required && <span style={{ color: C.orange }}> *</span>}
        </label>
      )}
      {rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
          required={required} disabled={disabled} style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      ) : options ? (
        <select value={value} onChange={e => onChange(e.target.value)} required={required} disabled={disabled}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          <option value=''>اختر...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          required={required} disabled={disabled} min={min} autoFocus={autoFocus} style={inputStyle}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      )}
      {error && <p style={{ color: C.danger, fontSize: '12px', marginTop: '5px' }}>{error}</p>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────
export function Card({ children, style, hover }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${hov && hover ? C.borderHover : C.border}`,
      borderRadius: '16px', transition: 'all 0.22s',
      transform: hov && hover ? 'translateY(-3px)' : 'none',
      boxShadow: hov && hover ? `0 8px 32px rgba(255,107,0,0.18)` : 'none',
      ...style,
    }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────
export function Badge({ children, color = C.orange }) {
  return (
    <span style={{
      background: `${color}20`, color, border: `1px solid ${color}40`,
      borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: '700',
    }}>{children}</span>
  );
}

// ─── Alert ────────────────────────────────────────────────────
export function Alert({ type = 'error', message }) {
  if (!message) return null;
  const colors = { error: C.danger, success: C.success, warning: C.warning, info: C.info };
  const color = colors[type] || colors.error;
  return (
    <div style={{
      background: `${color}18`, border: `1px solid ${color}40`, borderRadius: '10px',
      padding: '12px 16px', color, fontSize: '14px', marginBottom: '16px', fontWeight: '600',
    }}>{message}</div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 24 }) {
  return (
    <div style={{
      width: size, height: size, border: `3px solid ${C.border}`,
      borderTopColor: C.orange, borderRadius: '50%',
      animation: 'spin 0.7s linear infinite', display: 'inline-block',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Page Loader ──────────────────────────────────────────────
export function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Spinner size={40} />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────
export function Empty({ title, subtitle, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ width: '64px', height: '64px', background: C.orangeLight, border: `1px solid ${C.border}`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="1.5" width="32" height="32"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
      </div>
      <div style={{ color: C.text, fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{title}</div>
      {subtitle && <div style={{ color: C.textSub, fontSize: '14px', marginBottom: '24px' }}>{subtitle}</div>}
      {action}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width = '560px' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: width, maxHeight: '90vh',
        background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '20px',
        overflowY: 'auto',
      }} dir="rtl">
        <div style={{ padding: '22px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: C.bgPanel, zIndex: 1 }}>
          <h2 style={{ color: C.text, fontWeight: '800', fontSize: '20px' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textSub, cursor: 'pointer', padding: '4px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    processing: { label: 'قيد المعالجة', color: C.warning },
    shipped: { label: 'تم الشحن', color: C.info },
    delivered: { label: 'تم التوصيل', color: C.success },
    cancelled: { label: 'ملغي', color: C.danger },
  };
  const s = map[status] || { label: status, color: C.textSub };
  return <Badge color={s.color}>{s.label}</Badge>;
}

// ─── Price display ─────────────────────────────────────────────
export function Price({ amount, size = 'md' }) {
  const sizes = { sm: '14px', md: '18px', lg: '28px', xl: '36px' };
  return (
    <span style={{ color: C.orange, fontWeight: '800', fontSize: sizes[size] }}>
      ₪{Number(amount).toFixed(0)}
    </span>
  );
}
