import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { C, Btn, Spinner, Price } from '../components/UI';

const CATEGORIES = [
  { slug: 'tracksuits', name: 'ترنجات' },
  { slug: 'club-tshirts', name: 'تيشيرتات أندية' },
  { slug: 'national-jerseys', name: 'تيشيرتات منتخبات' },
  { slug: 'shoes', name: 'أحذية رياضية' },
  { slug: 'accessories', name: 'اكسسوارات رياضية' },
];

export default function HomePage({ setPage }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    { title: 'ألبس بطولتك', subtitle: 'أحدث الملابس الرياضية الاحترافية', cat: 'tracksuits' },
    { title: 'تيشيرتات الأندية', subtitle: 'جميع الأندية العالمية والمحلية', cat: 'club-tshirts' },
    { title: 'المنتخبات الوطنية', subtitle: 'قدم لمنتخبك بأصيل وفخر', cat: 'national-jerseys' },
  ];

  useEffect(() => {
    let timer = setInterval(() => setActiveSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([p, c]) => { setProducts(p.products); setCategories(c.categories); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div dir="rtl">
      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, #0d0d0d 0%, #1a0a00 60%, #0d0d0d 100%)`, minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-120px', left: '-120px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,107,0,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px', width: '100%' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,107,0,0.15)', border: `1px solid rgba(255,107,0,0.3)`, borderRadius: '100px', padding: '6px 18px', marginBottom: '24px' }}>
              <span style={{ color: C.orange, fontWeight: '700', fontSize: '13px' }}>Santiago Sports Store</span>
            </div>
            <h1 style={{ color: C.text, fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px', transition: 'all 0.5s' }}>
              {heroSlides[activeSlide].title}
            </h1>
            <p style={{ color: C.textSub, fontSize: '18px', marginBottom: '36px', lineHeight: '1.7' }}>
              {heroSlides[activeSlide].subtitle}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Btn size="lg" onClick={() => setPage('shop')}>تسوق الآن</Btn>
              <Btn size="lg" variant="outline" onClick={() => setPage('shop')}>تصفح الفئات</Btn>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
              {heroSlides.map((_, i) => (
                <button key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? '28px' : '8px', height: '8px', borderRadius: '4px', background: i === activeSlide ? C.orange : C.textMuted, border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[['شحن سريع', 'توصيل لجميع المناطق'], ['إرجاع مجاني', 'خلال 30 يوم'], ['دفع آمن', 'مضمون 100%'], ['دعم 24/7', 'خدمة عملاء متميزة']].map(([t, d]) => (
            <div key={t} style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ color: C.text, fontWeight: '700', fontSize: '14px' }}>{t}</div>
              <div style={{ color: C.textSub, fontSize: '12px', marginTop: '3px' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 20px' }}>
        <SectionTitle title="تصفح الفئات" subtitle="مجموعة كاملة من الملابس والاكسسوارات الرياضية" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginTop: '32px' }}>
          {(categories.length > 0 ? categories : CATEGORIES).map(cat => (
            <button key={cat.slug || cat.id} onClick={() => setPage('shop')}
              style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '22px 14px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.22s', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.background = C.orangeLight; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgCard; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ color: C.text, fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{cat.name}</div>
              {cat.product_count !== undefined && <div style={{ color: C.textMuted, fontSize: '12px' }}>{cat.product_count} منتج</div>}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, padding: '60px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          <SectionTitle title="أحدث المنتجات" subtitle="تشكيلة مختارة من أفضل الملابس الرياضية" />
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><Spinner size={40} /></div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ color: C.textSub, fontSize: '16px', marginBottom: '16px' }}>لا توجد منتجات بعد. أضف منتجات من لوحة التحكم.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginTop: '32px' }}>
              {products.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p}
                  onView={p => setPage('product-' + p.id)}
                  onAddCart={addToCart} />
              ))}
            </div>
          )}
          {products.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <Btn variant="outline" size="lg" onClick={() => setPage('shop')}>عرض جميع المنتجات</Btn>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: `linear-gradient(135deg, ${C.orange}, #cc5500)`, padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontWeight: '900', fontSize: '36px', marginBottom: '12px' }}>ابدأ رحلتك الرياضية</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '28px' }}>أفضل الملابس الرياضية بأسعار تنافسية</p>
        <Btn size="lg" style={{ background: '#fff', color: C.orange }} onClick={() => setPage('shop')}>تسوق الآن</Btn>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: C.text, fontWeight: '900', fontSize: '32px', marginBottom: '8px' }}>{title}</h2>
      {subtitle && <p style={{ color: C.textSub, fontSize: '15px' }}>{subtitle}</p>}
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: '#080808', borderTop: `1px solid ${C.border}`, padding: '50px 20px 28px' }} dir="rtl">
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '36px', height: '36px', background: C.orange, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff', fontSize: '18px' }}>S</div>
            <span style={{ color: C.text, fontWeight: '900' }}>Santiago Sports Store</span>
          </div>
          <p style={{ color: C.textSub, fontSize: '14px', lineHeight: '1.8' }}>متجرك الرياضي لأفضل الملابس والاحذية الرياضية.</p>
        </div>
        <div>
          <h4 style={{ color: C.text, fontWeight: '700', marginBottom: '14px' }}>روابط</h4>
          {[['home', 'الرئيسية'], ['shop', 'المتجر'], ['contact', 'اتصل بنا']].map(([id, l]) => (
            <button key={id} onClick={() => setPage(id)} style={{ display: 'block', background: 'none', border: 'none', color: C.textSub, cursor: 'pointer', padding: '4px 0', fontSize: '14px', fontFamily: 'inherit' }}>{l}</button>
          ))}
        </div>
        <div>
          <h4 style={{ color: C.text, fontWeight: '700', marginBottom: '14px' }}>تواصل معنا</h4>
          <p style={{ color: C.textSub, fontSize: '13px', lineHeight: '2' }}>
            info@santiago-sports.com<br />
            +972 50 000 0000<br />
            السبت - الخميس | 9 - 21
          </p>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <p style={{ color: C.textMuted, fontSize: '13px' }}>2025 Santiago Sports Store. جميع الحقوق محفوظة.</p>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['Visa', 'Mastercard', 'PayPal'].map(p => (
            <span key={p} style={{ color: C.textMuted, fontSize: '11px', background: C.bgCard, border: `1px solid ${C.border}`, padding: '3px 8px', borderRadius: '4px' }}>{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

const C = { orange: '#ff6b00', orangeLight: 'rgba(255,107,0,0.12)', bg: '#0d0d0d', bgCard: '#161616', bgPanel: '#1a1a1a', border: 'rgba(255,107,0,0.15)', text: '#fff', textSub: '#a0a0a0', textMuted: '#555' };
