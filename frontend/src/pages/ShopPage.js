import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { C, Spinner, Empty } from '../components/UI';

export default function ShopPage({ setPage }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    api.getCategories().then(r => setCategories(r.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (catFilter) params.category = catFilter;
    if (search) params.search = search;
    api.getProducts(params)
      .then(r => {
        let p = r.products;
        if (sort === 'price-asc') p = [...p].sort((a, b) => a.price - b.price);
        else if (sort === 'price-desc') p = [...p].sort((a, b) => b.price - a.price);
        setProducts(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, catFilter, sort]);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px' }} dir="rtl">
      <h1 style={{ color: C.text, fontWeight: '900', fontSize: '32px', marginBottom: '8px' }}>المتجر</h1>
      <p style={{ color: C.textSub, marginBottom: '32px' }}>{products.length} منتج</p>

      {/* Search & filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن منتج..."
            style={{ background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, outline: 'none', width: '100%', padding: '10px 40px 10px 14px', fontSize: '14px', fontFamily: 'inherit', direction: 'rtl' }} />
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: C.textMuted }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, padding: '10px 14px', fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }}>
          <option value=''>جميع الفئات</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ background: C.bgInput, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, padding: '10px 14px', fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }}>
          <option value='newest'>الأحدث</option>
          <option value='price-asc'>السعر: من الأقل</option>
          <option value='price-desc'>السعر: من الأعلى</option>
        </select>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[{ slug: '', name: 'الكل' }, ...categories].map(cat => (
          <button key={cat.slug || 'all'} onClick={() => setCatFilter(cat.slug || '')}
            style={{ padding: '7px 18px', borderRadius: '100px', border: `1px solid ${catFilter === (cat.slug || '') ? C.orange : C.border}`, background: catFilter === (cat.slug || '') ? C.orange : 'transparent', color: catFilter === (cat.slug || '') ? '#fff' : C.textSub, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}>
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spinner size={40} /></div>
      ) : products.length === 0 ? (
        <Empty title="لا توجد منتجات" subtitle={search ? `لا توجد نتائج لـ "${search}"` : 'لا توجد منتجات في هذه الفئة'} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p}
              onView={p => setPage('product-' + p.id)}
              onAddCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

const C = { orange: '#ff6b00', bg: '#0d0d0d', bgInput: '#111', bgCard: '#161616', border: 'rgba(255,107,0,0.15)', text: '#fff', textSub: '#a0a0a0', textMuted: '#555' };
