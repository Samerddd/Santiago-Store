import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { C, Btn, Input, Alert, Badge, StatusBadge, Spinner, Price, Modal, Empty } from '../components/UI';

export default function AdminDashboard({ setPage }) {
  const { user, logout, isAdmin } = useAuth();
  const [section, setSection] = useState('analytics');

  useEffect(() => {
    if (!user || !isAdmin) { setPage('login'); }
  }, [user]);

  if (!user || !isAdmin) return null;

  const sideItems = [
    { id: 'analytics', label: 'الاحصائيات', icon: BarChart },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'categories', label: 'الفئات', icon: Grid },
    { id: 'orders', label: 'الطلبات', icon: Orders },
    { id: 'users', label: 'المستخدمون', icon: Users },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }} dir="rtl">
      {/* Sidebar */}
      <div style={{ width: '216px', background: C.bgCard, borderLeft: `1px solid ${C.border}`, padding: '24px 12px', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ marginBottom: '28px', padding: '0 8px' }}>
          <div style={{ color: C.orange, fontWeight: '900', fontSize: '15px' }}>لوحة التحكم</div>
          <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '2px' }}>Santiago Sports</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {sideItems.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600', fontSize: '14px', textAlign: 'right', background: section === s.id ? 'rgba(255,107,0,0.15)' : 'transparent', color: section === s.id ? C.orange : C.textSub, transition: 'all 0.2s' }}>
                <Icon /> {s.label}
              </button>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: '12px', paddingTop: '12px' }}>
            <button onClick={() => setPage('home')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600', fontSize: '14px', background: 'transparent', color: C.textSub, width: '100%' }}>
              <Home /> المتجر
            </button>
            <button onClick={() => { logout(); setPage('home'); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600', fontSize: '14px', background: 'transparent', color: C.danger, width: '100%' }}>
              <LogOut /> خروج
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {section === 'analytics' && <AnalyticsSection />}
        {section === 'products' && <ProductsSection />}
        {section === 'categories' && <CategoriesSection />}
        {section === 'orders' && <OrdersSection />}
        {section === 'users' && <UsersSection />}
      </div>
    </div>
  );
}

/* ── Analytics ──────────────────────────────────────────────── */
function AnalyticsSection() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.getStats().then(s => setStats(s)).catch(() => {});
    api.allOrders().then(r => setOrders(r.orders.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ color: C.text, fontWeight: '900', fontSize: '28px', marginBottom: '28px' }}>الاحصائيات</h1>
      {!stats ? <Spinner /> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              ['المنتجات', stats.total_products, C.orange],
              ['المستخدمون', stats.total_users, C.info],
              ['الطلبات', stats.total_orders, C.success],
              ['الإيرادات', `₪${Number(stats.total_revenue).toFixed(0)}`, C.warning],
            ].map(([l, v, color]) => (
              <div key={l} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '22px' }}>
                <div style={{ color, fontWeight: '900', fontSize: '32px' }}>{v}</div>
                <div style={{ color: C.textSub, fontSize: '14px', marginTop: '4px' }}>{l}</div>
              </div>
            ))}
          </div>

          {stats.low_stock > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', color: C.danger, fontWeight: '600', fontSize: '14px' }}>
              تنبيه: {stats.low_stock} منتج على وشك النفاد من المخزون
            </div>
          )}

          {orders.length > 0 && (
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '22px' }}>
              <h3 style={{ color: C.text, fontWeight: '700', marginBottom: '16px' }}>آخر الطلبات</h3>
              {orders.map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ color: C.text, fontWeight: '600', fontSize: '14px' }}>#{o.id?.slice(0, 8).toUpperCase()} — {o.username}</div>
                    <div style={{ color: C.textMuted, fontSize: '12px' }}>{new Date(o.created_at).toLocaleDateString('ar')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <StatusBadge status={o.status} />
                    <Price amount={o.total} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Products ───────────────────────────────────────────────── */
function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([p, c]) => { setProducts(p.products); setCategories(c.categories); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const deleteProduct = async (id) => {
    if (!window.confirm('هل تريد حذف هذا المنتج؟')) return;
    await api.deleteProduct(id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: C.text, fontWeight: '900', fontSize: '28px' }}>المنتجات ({products.length})</h1>
        <Btn onClick={() => { setEditing(null); setShowModal(true); }}>اضافة منتج</Btn>
      </div>

      {loading ? <Spinner /> : products.length === 0 ? (
        <Empty title="لا توجد منتجات" subtitle="أضف أول منتج لمتجرك" action={<Btn onClick={() => { setEditing(null); setShowModal(true); }}>اضافة منتج</Btn>} />
      ) : (
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['المنتج', 'الفئة', 'السعر', 'المخزون', 'الحالة', 'اجراءات'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', color: C.textSub, fontSize: '13px', fontWeight: '600', textAlign: 'right' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', background: C.bgPanel, flexShrink: 0 }}>
                        {p.images?.[0] ? <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <NoImg />}
                      </div>
                      <span style={{ color: C.text, fontSize: '14px', fontWeight: '600' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}><Badge>{p.category_name || '—'}</Badge></td>
                  <td style={{ padding: '13px 16px' }}><Price amount={p.price} size="sm" /></td>
                  <td style={{ padding: '13px 16px' }}><Badge color={p.stock > 5 ? C.success : p.stock > 0 ? C.warning : C.danger}>{p.stock}</Badge></td>
                  <td style={{ padding: '13px 16px' }}><Badge color={p.stock > 0 ? C.success : C.danger}>{p.stock > 0 ? 'متاح' : 'نفذ'}</Badge></td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Btn size="sm" variant="outline" onClick={() => { setEditing(p); setShowModal(true); }}>تعديل</Btn>
                      <Btn size="sm" variant="danger" onClick={() => deleteProduct(p.id)}>حذف</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ProductModal product={editing} categories={categories} onClose={() => setShowModal(false)} onSave={load} />
      )}
    </div>
  );
}

function ProductModal({ product, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    category_id: product?.category_id || '',
    price: product?.price || '',
    stock: product?.stock ?? '',
    description: product?.description || '',
    images: product?.images || [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    Promise.all(files.map(f => new Promise(res => {
      const r = new FileReader();
      r.onload = ev => res(ev.target.result);
      r.readAsDataURL(f);
    }))).then(results => {
      setForm(p => ({ ...p, images: [...p.images, ...results].slice(0, 5) }));
      setUploading(false);
    });
  };

  const save = async () => {
    if (!form.name || !form.price) { setError('الاسم والسعر مطلوبان.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = { ...form, price: Number(form.price), stock: Number(form.stock), category_id: form.category_id || null };
      if (product) await api.updateProduct(product.id, data);
      else await api.createProduct(data);
      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={product ? 'تعديل المنتج' : 'اضافة منتج جديد'} onClose={onClose} width="640px">
      <Alert type="error" message={error} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
        <Input label="اسم المنتج" value={form.name} onChange={set('name')} required placeholder="اسم المنتج" />
        <Input label="الفئة" value={form.category_id} onChange={set('category_id')} options={categories.map(c => ({ value: c.id, label: c.name }))} />
        <Input label="السعر (₪)" value={form.price} onChange={set('price')} type="number" min="0" required placeholder="مثال: 149" />
        <Input label="الكمية في المخزن" value={form.stock} onChange={set('stock')} type="number" min="0" required placeholder="مثال: 25" />
      </div>
      <Input label="الوصف" value={form.description} onChange={set('description')} rows={3} placeholder="وصف المنتج..." />

      {/* Images */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', color: C.textSub, fontSize: '13px', marginBottom: '10px', fontWeight: '600' }}>
          صور المنتج <span style={{ color: C.textMuted }}>(حتى 5 صور)</span>
        </label>
        {form.images.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {form.images.map((img, i) => (
              <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${C.border}` }} />
                <button onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                  style={{ position: 'absolute', top: '-6px', left: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: C.danger, border: 'none', color: '#fff', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>x</button>
                {i === 0 && <span style={{ position: 'absolute', bottom: '3px', right: '3px', background: C.orange, color: '#fff', fontSize: '9px', padding: '1px 4px', borderRadius: '3px' }}>رئيسية</span>}
              </div>
            ))}
          </div>
        )}
        {form.images.length < 5 && (
          <>
            <input type="file" ref={fileRef} accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current.click()}
              style={{ width: '100%', padding: '20px', borderRadius: '10px', border: `2px dashed ${C.border}`, background: 'transparent', cursor: 'pointer', color: C.textSub, fontFamily: 'inherit', fontSize: '14px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}>
              {uploading ? 'جارٍ الرفع...' : 'انقر لرفع الصور (PNG, JPG)'}
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Btn variant="outline" style={{ flex: 1 }} onClick={onClose}>الغاء</Btn>
        <Btn style={{ flex: 2 }} onClick={save} disabled={loading}>{loading ? 'جارٍ الحفظ...' : product ? 'حفظ التعديلات' : 'اضافة المنتج'}</Btn>
      </div>
    </Modal>
  );
}

/* ── Categories ─────────────────────────────────────────────── */
function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  useEffect(() => { api.adminCategories().then(r => setCategories(r.categories)).catch(() => {}); }, []);
  return (
    <div>
      <h1 style={{ color: C.text, fontWeight: '900', fontSize: '28px', marginBottom: '28px' }}>الفئات</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '22px', textAlign: 'center' }}>
            <div style={{ color: C.text, fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>{cat.name}</div>
            <div style={{ color: C.orange, fontWeight: '900', fontSize: '28px' }}>{cat.product_count}</div>
            <div style={{ color: C.textMuted, fontSize: '12px' }}>منتج</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Orders ─────────────────────────────────────────────────── */
function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.allOrders().then(r => setOrders(r.orders)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await api.updateOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <h1 style={{ color: C.text, fontWeight: '900', fontSize: '28px', marginBottom: '28px' }}>الطلبات ({orders.length})</h1>
      {loading ? <Spinner /> : orders.length === 0 ? (
        <Empty title="لا توجد طلبات بعد" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ color: C.orange, fontWeight: '700' }}>#{o.id?.slice(0, 8).toUpperCase()}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div style={{ color: C.textSub, fontSize: '13px', marginBottom: '3px' }}>
                    المستخدم: <strong style={{ color: C.text }}>{o.username}</strong> ({o.email})
                  </div>
                  <div style={{ color: C.textSub, fontSize: '13px', marginBottom: '3px' }}>
                    الشحن: {o.shipping_name} — {o.shipping_city} — {o.shipping_phone}
                  </div>
                  {o.items_summary && <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '4px' }}>{o.items_summary}</div>}
                  <div style={{ color: C.textMuted, fontSize: '12px', marginTop: '4px' }}>
                    {new Date(o.created_at).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <Price amount={o.total} size="md" />
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                    style={{ background: C.bgPanel, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, padding: '7px 12px', fontSize: '13px', fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }}>
                    <option value="processing">قيد المعالجة</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Users ──────────────────────────────────────────────────── */
function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    api.getUsers().then(r => setUsers(r.users)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('هل تريد حذف هذا المستخدم؟')) return;
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 style={{ color: C.text, fontWeight: '900', fontSize: '28px', marginBottom: '28px' }}>المستخدمون ({users.length})</h1>
      {loading ? <Spinner /> : (
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['المستخدم', 'البريد الالكتروني', 'الدور', 'الطلبات', 'الانفاق الكلي', 'تاريخ التسجيل', 'اجراءات'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', color: C.textSub, fontSize: '13px', fontWeight: '600', textAlign: 'right' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
                        {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.username?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ color: C.text, fontWeight: '600', fontSize: '14px' }}>{u.username}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', color: C.textSub, fontSize: '13px' }}>{u.email}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <Badge color={u.role === 'admin' ? C.warning : C.info}>{u.role === 'admin' ? 'مسؤول' : 'مستخدم'}</Badge>
                  </td>
                  <td style={{ padding: '13px 16px', color: C.text, fontWeight: '600' }}>{u.order_count}</td>
                  <td style={{ padding: '13px 16px' }}><Price amount={u.total_spent} size="sm" /></td>
                  <td style={{ padding: '13px 16px', color: C.textMuted, fontSize: '12px' }}>
                    {new Date(u.created_at).toLocaleDateString('ar')}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {u.id !== currentUser?.id && u.role !== 'admin' && (
                      <Btn size="sm" variant="danger" onClick={() => deleteUser(u.id)}>حذف</Btn>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── SVG Icons ───────────────────────────────────────────────── */
const BarChart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const Package = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>;
const Grid = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const Orders = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>;
const Users = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const Home = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const LogOut = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const NoImg = () => <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>;

const C = { orange: '#ff6b00', bg: '#0d0d0d', bgCard: '#161616', bgPanel: '#1a1a1a', border: 'rgba(255,107,0,0.15)', text: '#fff', textSub: '#a0a0a0', textMuted: '#555', success: '#22c55e', danger: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
