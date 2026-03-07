import { useState, useEffect, useContext, createContext, useReducer } from "react";

// ============================================================
// CONTEXT & STATE MANAGEMENT
// ============================================================
const StoreContext = createContext();

const initialState = {
  products: [
    { id: 1, name: "سماعات لاسلكية برو", nameEn: "Pro Wireless Headphones", price: 299, originalPrice: 399, category: "إلكترونيات", rating: 4.8, reviews: 124, stock: 15, image: "🎧", badge: "خصم", description: "سماعات لاسلكية عالية الجودة مع تقنية إلغاء الضوضاء النشطة وبطارية تدوم 30 ساعة", isFeatured: true, isNew: false, isBestSeller: true },
    { id: 2, name: "ساعة ذكية سبورت", nameEn: "Sport Smart Watch", price: 199, originalPrice: 249, category: "إلكترونيات", rating: 4.6, reviews: 89, stock: 8, image: "⌚", badge: "جديد", description: "ساعة ذكية رياضية مع تتبع النشاط البدني ومراقبة معدل ضربات القلب", isFeatured: true, isNew: true, isBestSeller: false },
    { id: 3, name: "حقيبة جلد فاخرة", nameEn: "Luxury Leather Bag", price: 459, originalPrice: 599, category: "أزياء", rating: 4.9, reviews: 203, stock: 5, image: "👜", badge: "مميز", description: "حقيبة من الجلد الطبيعي الفاخر مثالية للعمل والسفر", isFeatured: true, isNew: false, isBestSeller: true },
    { id: 4, name: "كاميرا ديجيتال 4K", nameEn: "4K Digital Camera", price: 899, originalPrice: 1099, category: "إلكترونيات", rating: 4.7, reviews: 67, stock: 3, image: "📷", badge: "خصم", description: "كاميرا رقمية احترافية بدقة 4K مع عدسات متعددة وتثبيت صورة متقدم", isFeatured: false, isNew: false, isBestSeller: true },
    { id: 5, name: "عطر شرقي ملكي", nameEn: "Royal Oriental Perfume", price: 189, originalPrice: 220, category: "عطور", rating: 4.5, reviews: 156, stock: 20, image: "🌹", badge: "جديد", description: "عطر شرقي فاخر بمزيج من العود والورد يدوم طوال اليوم", isFeatured: true, isNew: true, isBestSeller: false },
    { id: 6, name: "لابتوب ألترا سليم", nameEn: "Ultra Slim Laptop", price: 2499, originalPrice: 2999, category: "إلكترونيات", rating: 4.8, reviews: 45, stock: 7, image: "💻", badge: "خصم", description: "لابتوب رفيع وخفيف الوزن بمعالج متطور وشاشة OLED مذهلة", isFeatured: true, isNew: false, isBestSeller: true },
    { id: 7, name: "حذاء رياضي إير", nameEn: "Air Sports Shoes", price: 349, originalPrice: 420, category: "أحذية", rating: 4.4, reviews: 312, stock: 25, image: "👟", badge: "خصم", description: "حذاء رياضي مريح بتقنية وسادة هوائية للجري واليوميات", isFeatured: false, isNew: false, isBestSeller: true },
    { id: 8, name: "مكيف هواء ذكي", nameEn: "Smart Air Conditioner", price: 1599, originalPrice: 1899, category: "منزل", rating: 4.6, reviews: 78, stock: 4, image: "❄️", badge: "مميز", description: "مكيف هواء ذكي يمكن التحكم به عبر التطبيق مع خاصية توفير الطاقة", isFeatured: false, isNew: true, isBestSeller: false },
    { id: 9, name: "طقم أدوات مطبخ", nameEn: "Kitchen Tools Set", price: 129, originalPrice: 159, category: "منزل", rating: 4.3, reviews: 234, stock: 30, image: "🍳", badge: null, description: "طقم أدوات مطبخية متكامل من الستانلس ستيل عالي الجودة", isFeatured: false, isNew: false, isBestSeller: false },
    { id: 10, name: "نظارات شمسية عصرية", nameEn: "Modern Sunglasses", price: 89, originalPrice: 119, category: "إكسسوارات", rating: 4.5, reviews: 167, stock: 18, image: "🕶️", badge: "خصم", description: "نظارات شمسية أنيقة بحماية UV400 وإطار عصري خفيف الوزن", isFeatured: false, isNew: true, isBestSeller: false },
    { id: 11, name: "تلفزيون OLED 65", nameEn: "65 OLED TV", price: 3999, originalPrice: 4799, category: "إلكترونيات", rating: 4.9, reviews: 34, stock: 2, image: "📺", badge: "خصم", description: "تلفزيون OLED بحجم 65 بوصة بدقة 8K وتقنية HDR المتقدمة", isFeatured: true, isNew: false, isBestSeller: false },
    { id: 12, name: "مجموعة عناية بالبشرة", nameEn: "Skincare Collection", price: 249, originalPrice: 320, category: "جمال", rating: 4.7, reviews: 289, stock: 12, image: "✨", badge: "جديد", description: "مجموعة متكاملة للعناية بالبشرة من المكونات الطبيعية الفاخرة", isFeatured: false, isNew: true, isBestSeller: true },
  ],
  categories: [
    { id: 1, name: "إلكترونيات", icon: "📱", count: 5 },
    { id: 2, name: "أزياء", icon: "👗", count: 1 },
    { id: 3, name: "عطور", icon: "🌺", count: 1 },
    { id: 4, name: "أحذية", icon: "👠", count: 1 },
    { id: 5, name: "منزل", icon: "🏠", count: 2 },
    { id: 6, name: "إكسسوارات", icon: "💎", count: 1 },
    { id: 7, name: "جمال", icon: "💄", count: 1 },
  ],
  cart: [],
  wishlist: [],
  orders: [
    { id: "ORD-001", date: "2025-01-15", status: "تم التوصيل", total: 598, items: 2 },
    { id: "ORD-002", date: "2025-02-03", status: "قيد الشحن", total: 299, items: 1 },
    { id: "ORD-003", date: "2025-02-20", status: "قيد المعالجة", total: 1348, items: 3 },
  ],
  users: [
    { id: 1, name: "أحمد محمد", email: "ahmed@example.com", orders: 5, status: "نشط", joined: "2024-01-10" },
    { id: 2, name: "سارة علي", email: "sara@example.com", orders: 12, status: "نشط", joined: "2024-02-15" },
    { id: 3, name: "محمود حسن", email: "mahmoud@example.com", orders: 3, status: "محظور", joined: "2024-03-20" },
    { id: 4, name: "فاطمة أحمد", email: "fatima@example.com", orders: 8, status: "نشط", joined: "2024-04-05" },
  ],
  coupons: [
    { id: 1, code: "SAVE20", discount: 20, type: "نسبة", used: 45, active: true },
    { id: 2, code: "FLAT50", discount: 50, type: "مبلغ", used: 12, active: true },
    { id: 3, code: "NEWUSER", discount: 15, type: "نسبة", used: 89, active: false },
  ],
  currentUser: null,
  isLoggedIn: false,
  isAdmin: false,
};

function storeReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find(i => i.id === action.product.id);
      if (existing) {
        return { ...state, cart: state.cart.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, cart: [...state.cart, { ...action.product, qty: 1 }] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter(i => i.id !== action.id) };
    case "UPDATE_QTY":
      return { ...state, cart: state.cart.map(i => i.id === action.id ? { ...i, qty: action.qty } : i).filter(i => i.qty > 0) };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "TOGGLE_WISHLIST": {
      const inWishlist = state.wishlist.includes(action.id);
      return { ...state, wishlist: inWishlist ? state.wishlist.filter(id => id !== action.id) : [...state.wishlist, action.id] };
    }
    case "LOGIN":
      return { ...state, isLoggedIn: true, currentUser: action.user, isAdmin: action.user.isAdmin || false };
    case "LOGOUT":
      return { ...state, isLoggedIn: false, currentUser: null, isAdmin: false };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, { ...action.product, id: Date.now(), reviews: 0, isFeatured: false, isNew: true, isBestSeller: false }] };
    case "UPDATE_PRODUCT":
      return { ...state, products: state.products.map(p => p.id === action.product.id ? action.product : p) };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, { ...action.category, id: Date.now(), count: 0 }] };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter(c => c.id !== action.id) };
    case "PLACE_ORDER": {
      const newOrder = { id: `ORD-${String(Date.now()).slice(-4)}`, date: new Date().toISOString().split("T")[0], status: "قيد المعالجة", total: action.total, items: state.cart.length };
      return { ...state, orders: [...state.orders, newOrder], cart: [] };
    }
    case "UPDATE_USER_STATUS":
      return { ...state, users: state.users.map(u => u.id === action.id ? { ...u, status: action.status } : u) };
    case "TOGGLE_COUPON":
      return { ...state, coupons: state.coupons.map(c => c.id === action.id ? { ...c, active: !c.active } : c) };
    default:
      return state;
  }
}

// ============================================================
// ICONS
// ============================================================
const Icons = {
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Cart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  Heart: ({ filled }) => <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Star: ({ filled }) => <svg viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2" className="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polyline points="9 18 15 12 9 6"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Package: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Tag: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  Truck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Headphones: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
};

// ============================================================
// STAR RATING
// ============================================================
function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Icons.Star key={i} filled={i < Math.round(rating)} />
      ))}
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, setPage }) {
  const { state, dispatch } = useContext(StoreContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = state.cart.reduce((a, b) => a + b.qty, 0);
  const cartTotal = state.cart.reduce((a, b) => a + b.price * b.qty, 0);

  const navLinks = [
    { label: "الرئيسية", id: "home" },
    { label: "المنتجات", id: "products" },
    { label: "الفئات", id: "categories" },
    { label: "العروض", id: "offers" },
    { label: "اتصل بنا", id: "contact" },
  ];

  return (
    <>
      <nav style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderBottom: "1px solid rgba(99,102,241,0.3)" }} className="fixed top-0 left-0 right-0 z-50 shadow-2xl">
        {/* Top bar */}
        <div style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)" }} className="text-white text-xs py-1.5 text-center">
          🎉 احصل على شحن مجاني على الطلبات التي تزيد عن 200 ريال | استخدم الكود: <strong>FREESHIP</strong>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16" dir="rtl">
            {/* Logo */}
            <button onClick={() => setPage("home")} className="flex items-center gap-2 group">
              <div style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }} className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>
              <div className="text-right">
                <div className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "Georgia, serif", letterSpacing: "0.05em" }}>Santiago Store</div>
                <div className="text-purple-300 text-xs">متجر سانتياغو</div>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => setPage(link.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${page === link.id ? "text-white bg-indigo-600" : "text-gray-300 hover:text-white hover:bg-white/10"}`}>
                  {link.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => setPage("search")} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Icons.Search />
              </button>
              <button onClick={() => state.isLoggedIn ? setPage("account") : setPage("login")}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all hidden md:flex">
                <Icons.User />
              </button>
              {state.isAdmin && (
                <button onClick={() => setPage("admin")}
                  className="hidden md:flex px-3 py-1.5 text-xs font-medium rounded-lg transition-all text-yellow-300 border border-yellow-300/30 hover:bg-yellow-300/10">
                  لوحة التحكم
                </button>
              )}
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                <Icons.Cart />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
                )}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">
                <Icons.Menu />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 border-t border-white/10 pt-4" dir="rtl">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => { setPage(link.id); setMenuOpen(false); }}
                  className={`block w-full text-right px-4 py-2.5 rounded-lg mb-1 text-sm transition-all ${page === link.id ? "text-white bg-indigo-600" : "text-gray-300 hover:text-white hover:bg-white/10"}`}>
                  {link.label}
                </button>
              ))}
              <div className="flex gap-2 mt-3 px-4">
                <button onClick={() => { state.isLoggedIn ? setPage("account") : setPage("login"); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm rounded-lg border border-indigo-500 text-indigo-300 hover:bg-indigo-500/20 transition-all">
                  {state.isLoggedIn ? "حسابي" : "تسجيل الدخول"}
                </button>
                {state.isAdmin && (
                  <button onClick={() => { setPage("admin"); setMenuOpen(false); }}
                    className="flex-1 py-2 text-sm rounded-lg border border-yellow-500 text-yellow-300 hover:bg-yellow-500/20 transition-all">
                    لوحة التحكم
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div style={{ background: "#0f172a", borderLeft: "1px solid rgba(99,102,241,0.3)", width: "380px", maxWidth: "90vw" }} className="flex flex-col h-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-white font-bold text-lg">سلة التسوق ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
                <Icons.X />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {state.cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-400">سلتك فارغة</p>
                  <button onClick={() => { setCartOpen(false); setPage("products"); }}
                    className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    تصفح المنتجات
                  </button>
                </div>
              ) : state.cart.map(item => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="text-4xl flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg" style={{ background: "rgba(99,102,241,0.1)" }}>{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-indigo-400 font-bold mt-1">{item.price} ر.س</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty - 1 })}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:opacity-80"
                        style={{ background: "rgba(99,102,241,0.3)" }}>
                        <Icons.Minus />
                      </button>
                      <span className="text-white font-bold w-6 text-center">{item.qty}</span>
                      <button onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty + 1 })}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:opacity-80"
                        style={{ background: "rgba(99,102,241,0.3)" }}>
                        <Icons.Plus />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: item.id })} className="text-red-400 hover:text-red-300 p-1 self-start">
                    <Icons.Trash />
                  </button>
                </div>
              ))}
            </div>
            {state.cart.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-400">المجموع:</span>
                  <span className="text-white font-bold text-xl">{cartTotal.toFixed(0)} ر.س</span>
                </div>
                <button onClick={() => { setCartOpen(false); setPage("checkout"); }}
                  className="w-full py-3 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  إتمام الشراء
                </button>
                <button onClick={() => setCartOpen(false)}
                  className="w-full py-2.5 mt-2 rounded-xl text-gray-300 text-sm hover:text-white hover:bg-white/10 transition-all">
                  مواصلة التسوق
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// PRODUCT CARD
// ============================================================
function ProductCard({ product, setPage, setSelectedProduct }) {
  const { state, dispatch } = useContext(StoreContext);
  const inWishlist = state.wishlist.includes(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(99,102,241,0.2)" }}>
      {/* Image Area */}
      <div onClick={() => { setSelectedProduct(product); setPage("product"); }}
        className="relative h-48 flex items-center justify-center text-7xl"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))" }}>
        {product.image}
        {product.badge && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: product.badge === "خصم" ? "#ef4444" : product.badge === "جديد" ? "#10b981" : "#f59e0b" }}>
            {product.badge === "خصم" ? `-${discount}%` : product.badge}
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_WISHLIST", id: product.id }); }}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 ${inWishlist ? "text-red-400" : "text-gray-300 hover:text-red-400"}`}
          style={{ background: "rgba(15,23,42,0.8)" }}>
          <Icons.Heart filled={inWishlist} />
        </button>
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium text-orange-300" style={{ background: "rgba(234,88,12,0.2)" }}>
            آخر {product.stock} قطع!
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4" dir="rtl">
        <p className="text-xs text-indigo-400 mb-1">{product.category}</p>
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-gray-400 text-xs">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-lg">{product.price} ر.س</span>
            {product.originalPrice && (
              <span className="text-gray-500 text-sm line-through mr-2">{product.originalPrice}</span>
            )}
          </div>
          <button onClick={() => dispatch({ type: "ADD_TO_CART", product })}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 shadow-md"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            أضف
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ setPage, setSelectedProduct }) {
  const { state, dispatch } = useContext(StoreContext);
  const [heroSlide, setHeroSlide] = useState(0);

  const slides = [
    { bg: "from-indigo-900 to-purple-900", title: "أحدث المنتجات التقنية", subtitle: "اكتشف عالماً من الإلكترونيات المتطورة", btn: "تسوق الآن", icon: "💻" },
    { bg: "from-rose-900 to-pink-900", title: "عروض الموسم الكبرى", subtitle: "خصومات تصل حتى 50% على الأزياء الفاخرة", btn: "استفد من العروض", icon: "👗" },
    { bg: "from-amber-900 to-orange-900", title: "مجموعة العطور الشرقية", subtitle: "روائح مميزة تأخذك إلى عالم مختلف", btn: "اكتشف العطور", icon: "🌹" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div dir="rtl">
      {/* Hero Slider */}
      <div className={`relative min-h-screen flex items-center bg-gradient-to-br ${slides[heroSlide].bg} transition-all duration-1000`} style={{ paddingTop: "80px" }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "#6366f1" }} />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: "#a855f7" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-indigo-200 mb-6" style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
                ✨ Santiago Store — متجرك المفضل
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                {slides[heroSlide].title}
              </h1>
              <p className="text-xl text-gray-300 mb-8">{slides[heroSlide].subtitle}</p>
              <div className="flex gap-4 flex-wrap">
                <button onClick={() => setPage("products")}
                  className="px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 shadow-xl hover:shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  {slides[heroSlide].btn}
                </button>
                <button onClick={() => setPage("offers")}
                  className="px-8 py-4 rounded-2xl font-bold text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all">
                  العروض الحصرية
                </button>
              </div>
              <div className="flex gap-8 mt-10">
                {[{ n: "500+", l: "منتج" }, { n: "10K+", l: "عميل سعيد" }, { n: "99%", l: "رضا العملاء" }].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-white">{s.n}</div>
                    <div className="text-gray-400 text-sm">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[12rem] leading-none">{slides[heroSlide].icon}</div>
            </div>
          </div>
        </div>
        {/* Slider controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setHeroSlide(i)}
              className={`rounded-full transition-all ${i === heroSlide ? "w-8 h-3 bg-white" : "w-3 h-3 bg-white/30"}`} />
          ))}
        </div>
        <button onClick={() => setHeroSlide((heroSlide - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white hover:bg-white/10 transition-all"
          style={{ background: "rgba(0,0,0,0.3)" }}>
          <Icons.ChevronLeft />
        </button>
        <button onClick={() => setHeroSlide((heroSlide + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white hover:bg-white/10 transition-all"
          style={{ background: "rgba(0,0,0,0.3)" }}>
          <Icons.ChevronRight />
        </button>
      </div>

      {/* Features */}
      <div style={{ background: "#0f172a" }} className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🚚", title: "شحن مجاني", desc: "على الطلبات فوق 200 ر.س" },
              { icon: "🔄", title: "إرجاع سهل", desc: "خلال 30 يوم من الاستلام" },
              { icon: "🔒", title: "دفع آمن", desc: "حماية كاملة لبياناتك" },
              { icon: "💬", title: "دعم 24/7", desc: "نحن هنا لمساعدتك دائماً" },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-2xl text-center transition-all hover:-translate-y-1"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <div className="text-3xl mb-2">{f.icon}</div>
                <div className="text-white font-bold text-sm">{f.title}</div>
                <div className="text-gray-400 text-xs mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ background: "#0f172a" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white mb-2 text-center">تصفح الفئات</h2>
          <p className="text-gray-400 text-center mb-10">اكتشف مجموعتنا الواسعة من الفئات</p>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
            {state.categories.map(cat => (
              <button key={cat.id} onClick={() => setPage("products")}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all hover:-translate-y-1 group"
                style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-white text-xs font-medium text-center">{cat.name}</span>
                <span className="text-gray-500 text-xs">{cat.count} منتج</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <Section title="المنتجات المميزة" subtitle="اختيارات رائعة بجودة استثنائية" bg="#0a0f1e">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {state.products.filter(p => p.isFeatured).slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} />
          ))}
        </div>
      </Section>

      {/* New Arrivals */}
      <Section title="الوصولات الجديدة" subtitle="أحدث المنتجات وصلت للتو" bg="#0f172a">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {state.products.filter(p => p.isNew).slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => setPage("products")} className="px-8 py-3 rounded-xl text-white font-medium border border-indigo-500/50 hover:bg-indigo-500/20 transition-all">
            عرض جميع المنتجات ←
          </button>
        </div>
      </Section>

      {/* Best Sellers */}
      <Section title="الأكثر مبيعاً" subtitle="المنتجات التي يعشقها عملاؤنا" bg="#0a0f1e">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {state.products.filter(p => p.isBestSeller).slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} />
          ))}
        </div>
      </Section>

      {/* Special Offers Banner */}
      <div className="py-16" style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h2 className="text-4xl font-black text-white mb-3">عروض حصرية لفترة محدودة!</h2>
          <p className="text-indigo-200 text-xl mb-8">خصومات تصل حتى 50% على المنتجات المختارة</p>
          <div className="flex gap-4 justify-center">
            <div className="text-center p-4 rounded-2xl" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="text-4xl font-black text-white">24</div>
              <div className="text-indigo-300 text-sm">ساعة</div>
            </div>
            <div className="text-center p-4 rounded-2xl" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="text-4xl font-black text-white">35</div>
              <div className="text-indigo-300 text-sm">دقيقة</div>
            </div>
            <div className="text-center p-4 rounded-2xl" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="text-4xl font-black text-white">12</div>
              <div className="text-indigo-300 text-sm">ثانية</div>
            </div>
          </div>
          <button onClick={() => setPage("offers")}
            className="mt-8 px-10 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 shadow-2xl"
            style={{ background: "linear-gradient(135deg, #ef4444, #ec4899)" }}>
            احصل على العروض الآن
          </button>
        </div>
      </div>

      {/* Reviews */}
      <Section title="آراء عملائنا" subtitle="تجارب حقيقية من عملاء حقيقيين" bg="#0f172a">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "أحمد محمد", text: "تجربة تسوق رائعة! المنتجات أفضل بكثير مما توقعت والتوصيل سريع جداً", rating: 5, avatar: "👨‍💼" },
            { name: "سارة علي", text: "خدمة عملاء ممتازة وجودة المنتجات عالية جداً. سأتسوق هنا دائماً!", rating: 5, avatar: "👩‍💼" },
            { name: "محمود حسن", text: "أسعار منافسة ومنتجات أصيلة. شحن سريع وتغليف احترافي. أنصح الجميع", rating: 4, avatar: "👨‍🦰" },
          ].map((r, i) => (
            <div key={i} className="p-6 rounded-2xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{r.avatar}</div>
                <div>
                  <div className="text-white font-bold">{r.name}</div>
                  <StarRating rating={r.rating} />
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <Footer setPage={setPage} />
    </div>
  );
}

function Section({ title, subtitle, children, bg }) {
  return (
    <div style={{ background: bg }} className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">{title}</h2>
          <p className="text-gray-400">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "#020617", borderTop: "1px solid rgba(99,102,241,0.2)" }} className="py-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }} className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">S</div>
              <span className="text-white font-bold">Santiago Store</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">متجرك المفضل للتسوق الإلكتروني. نقدم أفضل المنتجات بأعلى جودة وأسعار تنافسية.</p>
            <div className="flex gap-3 mt-4">
              {["📘", "📸", "🐦", "▶️"].map((s, i) => (
                <button key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all hover:opacity-80" style={{ background: "rgba(99,102,241,0.2)" }}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
            <div className="space-y-2">
              {["الرئيسية", "المنتجات", "الفئات", "العروض", "اتصل بنا"].map((l, i) => (
                <button key={i} onClick={() => setPage(["home", "products", "categories", "offers", "contact"][i])}
                  className="block text-gray-400 text-sm hover:text-indigo-400 transition-colors">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">خدمة العملاء</h4>
            <div className="space-y-2">
              {["سياسة الإرجاع", "الشحن والتوصيل", "طرق الدفع", "الأسئلة الشائعة", "تواصل معنا"].map((l, i) => (
                <p key={i} className="text-gray-400 text-sm hover:text-indigo-400 transition-colors cursor-pointer">{l}</p>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p>📞 +966 12 345 6789</p>
              <p>📧 info@santiago-store.com</p>
              <p>📍 الرياض، المملكة العربية السعودية</p>
              <p>🕐 السبت - الخميس: 9ص - 9م</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Santiago Store. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            {["فيزا 💳", "ماستركارد 💳", "Apple Pay 📱", "PayPal 💰"].map((p, i) => (
              <span key={i} className="text-xs text-gray-500">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// PRODUCTS PAGE
// ============================================================
function ProductsPage({ setPage, setSelectedProduct }) {
  const { state } = useContext(StoreContext);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("الكل");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("default");
  const [minRating, setMinRating] = useState(0);

  const cats = ["الكل", ...state.categories.map(c => c.name)];

  let filtered = state.products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === "الكل" || p.category === selectedCat;
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchRating = p.rating >= minRating;
    return matchSearch && matchCat && matchPrice && matchRating;
  });

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sortBy === "newest") filtered = [...filtered].filter(p => p.isNew);

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: "80px" }} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">جميع المنتجات</h1>
          <p className="text-gray-400">{filtered.length} منتج متاح</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث عن منتج..."
            className="w-full pl-5 pr-12 py-4 rounded-2xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500 text-right"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }} />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="rounded-2xl p-5 space-y-6 sticky top-24" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <div>
                <h3 className="text-white font-bold mb-3">الفئات</h3>
                <div className="space-y-1.5">
                  {cats.map(cat => (
                    <button key={cat} onClick={() => setSelectedCat(cat)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-sm transition-all ${selectedCat === cat ? "text-white font-medium" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                      style={selectedCat === cat ? { background: "rgba(99,102,241,0.3)" } : {}}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3">نطاق السعر</h3>
                <input type="range" min="0" max="5000" value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])}
                  className="w-full accent-indigo-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 ر.س</span>
                  <span>{priceRange[1]} ر.س</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3">التقييم الأدنى</h3>
                <div className="space-y-1.5">
                  {[0, 3, 4, 4.5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-2 ${minRating === r ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                      style={minRating === r ? { background: "rgba(99,102,241,0.3)" } : {}}>
                      {r === 0 ? "الكل" : <><span>⭐</span><span>{r}+ نجوم</span></>}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3">الترتيب</h3>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-white text-sm outline-none"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <option value="default">افتراضي</option>
                  <option value="price-asc">السعر: الأقل أولاً</option>
                  <option value="price-desc">السعر: الأعلى أولاً</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="newest">الأحدث</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-400 text-xl">لم يتم العثور على منتجات</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PRODUCT DETAIL PAGE
// ============================================================
function ProductDetailPage({ product, setPage }) {
  const { state, dispatch } = useContext(StoreContext);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const related = state.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const inWishlist = state.wishlist.includes(product.id);

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: "80px" }} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <button onClick={() => setPage("products")} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <Icons.ChevronRight /> العودة للمنتجات
        </button>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="rounded-3xl h-96 flex items-center justify-center text-9xl mb-4"
              style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))", border: "1px solid rgba(99,102,241,0.2)" }}>
              {product.image}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-2xl h-20 flex items-center justify-center text-3xl cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  {product.image}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="inline-flex px-3 py-1 rounded-full text-sm text-indigo-300 mb-3" style={{ background: "rgba(99,102,241,0.2)" }}>{product.category}</span>
            <h1 className="text-4xl font-black text-white mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} />
              <span className="text-gray-400 text-sm">({product.reviews} تقييم)</span>
              <span className="text-green-400 text-sm">✓ متوفر في المخزن</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-black" style={{ color: "#a855f7" }}>{product.price} ر.س</span>
              {product.originalPrice && (
                <div>
                  <span className="text-gray-500 text-xl line-through">{product.originalPrice} ر.س</span>
                  <span className="mr-2 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: "#ef4444" }}>
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>

            {/* Qty */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400">الكمية:</span>
              <div className="flex items-center gap-2 rounded-xl p-1" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-indigo-600 transition-all"><Icons.Minus /></button>
                <span className="text-white font-bold w-8 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-indigo-600 transition-all"><Icons.Plus /></button>
              </div>
              <span className="text-gray-500 text-sm">{product.stock} قطعة متبقية</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-6">
              <button onClick={() => { for (let i = 0; i < qty; i++) dispatch({ type: "ADD_TO_CART", product }); }}
                className="flex-1 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90 shadow-xl"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                أضف إلى السلة
              </button>
              <button onClick={() => dispatch({ type: "TOGGLE_WISHLIST", id: product.id })}
                className={`p-4 rounded-2xl border-2 transition-all ${inWishlist ? "text-red-400 border-red-400/50" : "text-gray-400 border-gray-600 hover:border-red-400 hover:text-red-400"}`}>
                <Icons.Heart filled={inWishlist} />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2"><span>🚚</span><span>شحن مجاني على الطلبات فوق 200 ر.س</span></div>
              <div className="flex items-center gap-2"><span>🔄</span><span>إمكانية الإرجاع خلال 30 يوم</span></div>
              <div className="flex items-center gap-2"><span>✅</span><span>ضمان أصالة المنتج</span></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-0">
            {["description", "reviews", "shipping"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${activeTab === tab ? "text-white border-indigo-500" : "text-gray-400 border-transparent hover:text-white"}`}>
                {tab === "description" ? "الوصف" : tab === "reviews" ? "التقييمات" : "الشحن"}
              </button>
            ))}
          </div>
          {activeTab === "description" && (
            <div className="text-gray-300 leading-relaxed">
              <p>{product.description}</p>
              <ul className="mt-4 space-y-2">
                {["مصنوع من أعلى جودة مواد", "ضمان المصنع لمدة سنة كاملة", "متوفر بألوان متعددة", "سهل التركيب والاستخدام"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2"><span className="text-green-400">✓</span>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {[4.9, 5, 4.5].map((r, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-medium">عميل مميز</span>
                    <StarRating rating={r} />
                  </div>
                  <p className="text-gray-400 text-sm">منتج رائع جداً، يستحق السعر تماماً. التوصيل كان سريعاً والتغليف احترافي.</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "shipping" && (
            <div className="text-gray-300 space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.08)" }}>
                <span className="text-2xl">🚚</span>
                <div><div className="text-white font-bold">الشحن العادي</div><div className="text-sm">3-5 أيام عمل | مجاني فوق 200 ر.س</div></div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.08)" }}>
                <span className="text-2xl">⚡</span>
                <div><div className="text-white font-bold">الشحن السريع</div><div className="text-sm">1-2 أيام عمل | 35 ر.س</div></div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">منتجات ذات صلة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={() => {}} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// CHECKOUT PAGE
// ============================================================
function CheckoutPage({ setPage }) {
  const { state, dispatch } = useContext(StoreContext);
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("cash");
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = state.cart.reduce((a, b) => a + b.price * b.qty, 0);
  const shipping = subtotal > 200 ? 0 : 35;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    const found = state.coupons.find(c => c.code === coupon.toUpperCase() && c.active);
    if (found) setDiscount(found.type === "نسبة" ? Math.round(subtotal * found.discount / 100) : found.discount);
  };

  const placeOrder = () => {
    dispatch({ type: "PLACE_ORDER", total });
    setStep(3);
  };

  if (state.cart.length === 0 && step !== 3) {
    return (
      <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: "80px" }} dir="rtl" className="flex items-center justify-center">
        <div className="text-center"><div className="text-6xl mb-4">🛒</div><p className="text-gray-400 text-xl">سلتك فارغة</p>
          <button onClick={() => setPage("products")} className="mt-4 px-6 py-3 rounded-xl text-white font-medium" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>تسوق الآن</button></div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: "80px" }} dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-8">إتمام الشراء</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {["معلومات الشحن", "طريقة الدفع", "تم الطلب"].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > i + 1 ? "text-white" : step === i + 1 ? "text-white" : "text-gray-500"}`}
                style={{ background: step > i + 1 ? "#10b981" : step === i + 1 ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.1)" }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-sm hidden md:block ${step === i + 1 ? "text-white" : "text-gray-500"}`}>{s}</span>
              {i < 2 && <div className="flex-1 h-0.5 mx-2" style={{ background: step > i + 1 ? "#10b981" : "rgba(255,255,255,0.1)" }} />}
            </div>
          ))}
        </div>

        {step === 3 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6" style={{ background: "rgba(16,185,129,0.2)" }}>✅</div>
            <h2 className="text-4xl font-black text-white mb-3">تم تأكيد طلبك!</h2>
            <p className="text-gray-400 text-lg mb-2">شكراً لتسوقك معنا في Santiago Store</p>
            <p className="text-indigo-400">ستصلك رسالة تأكيد على هاتفك قريباً</p>
            <button onClick={() => setPage("home")} className="mt-8 px-8 py-4 rounded-2xl text-white font-bold text-lg" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              العودة للرئيسية
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {step === 1 ? (
                <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <h2 className="text-xl font-bold text-white">معلومات الشحن</h2>
                  {[["name", "الاسم الكامل", "text"], ["phone", "رقم الهاتف", "tel"], ["address", "العنوان", "text"], ["city", "المدينة", "text"], ["notes", "ملاحظات إضافية", "text"]].map(([key, label, type]) => (
                    <div key={key}>
                      <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={label}
                        className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }} />
                    </div>
                  ))}
                  <button onClick={() => setStep(2)} disabled={!form.name || !form.phone || !form.address}
                    className="w-full py-4 rounded-xl text-white font-bold text-lg mt-2 disabled:opacity-50 transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                    التالي: طريقة الدفع
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <h2 className="text-xl font-bold text-white">طريقة الدفع</h2>
                  {[["cash", "💵", "الدفع عند الاستلام", "ادفع نقداً عند وصول طلبك"], ["card", "💳", "بطاقة ائتمانية / خصم", "فيزا، ماستركارد، مدى"]].map(([val, icon, title, desc]) => (
                    <button key={val} onClick={() => setPayment(val)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-right ${payment === val ? "ring-2 ring-indigo-500" : ""}`}
                      style={{ background: payment === val ? "rgba(99,102,241,0.2)" : "rgba(0,0,0,0.2)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <span className="text-3xl">{icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-bold">{title}</div>
                        <div className="text-gray-400 text-sm">{desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${payment === val ? "border-indigo-500 bg-indigo-500" : "border-gray-500"}`} />
                    </button>
                  ))}
                  {payment === "card" && (
                    <div className="space-y-3 mt-4">
                      {[["رقم البطاقة", "0000 0000 0000 0000"], ["اسم حامل البطاقة", ""], ["تاريخ الانتهاء", "MM/YY"]].map(([l, ph], i) => (
                        <input key={i} placeholder={ph || l} className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none text-right"
                          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }} />
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-gray-300 border border-gray-600 hover:bg-white/5 transition-all">السابق</button>
                    <button onClick={placeOrder} className="flex-1 py-3 rounded-xl text-white font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>تأكيد الطلب</button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="rounded-2xl p-5 sticky top-24" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <h3 className="text-white font-bold text-lg mb-4">ملخص الطلب</h3>
                <div className="space-y-3 mb-4">
                  {state.cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">{item.name} × {item.qty}</span>
                      <span className="text-white text-sm">{item.price * item.qty} ر.س</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mb-4">
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="كود الخصم"
                    className="flex-1 px-3 py-2 rounded-xl text-white text-sm placeholder-gray-600 outline-none text-right"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }} />
                  <button onClick={applyCoupon} className="px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: "rgba(99,102,241,0.4)" }}>تطبيق</button>
                </div>
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">المجموع الفرعي</span><span className="text-white">{subtotal} ر.س</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">الشحن</span><span className={shipping === 0 ? "text-green-400" : "text-white"}>{shipping === 0 ? "مجاني" : shipping + " ر.س"}</span></div>
                  {discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-400">الخصم</span><span className="text-green-400">-{discount} ر.س</span></div>}
                  <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2 mt-2">
                    <span className="text-white">الإجمالي</span>
                    <span style={{ color: "#a855f7" }}>{total} ر.س</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// AUTH PAGES
// ============================================================
function LoginPage({ setPage }) {
  const { dispatch } = useContext(StoreContext);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.email || !form.password) { setError("يرجى تعبئة جميع الحقول"); return; }
    const isAdmin = form.email === "admin@santiago.com";
    dispatch({ type: "LOGIN", user: { name: form.name || "أحمد محمد", email: form.email, isAdmin } });
    setPage(isAdmin ? "admin" : "home");
  };

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh" }} className="flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-3xl text-white font-black mb-4 shadow-xl"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>S</div>
          <h1 className="text-3xl font-black text-white">Santiago Store</h1>
          <p className="text-gray-400 mt-1">{isRegister ? "إنشاء حساب جديد" : "مرحباً بعودتك!"}</p>
        </div>

        <div className="rounded-3xl p-8" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-gray-400 text-sm mb-1 block">الاسم الكامل</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="أدخل اسمك الكامل"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }} />
              </div>
            )}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">البريد الإلكتروني</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)", direction: "ltr" }} />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">كلمة المرور</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }} />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button onClick={handleSubmit}
              className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 shadow-xl"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              {isRegister ? "إنشاء الحساب" : "تسجيل الدخول"}
            </button>
          </div>
          <div className="text-center mt-6">
            <span className="text-gray-400 text-sm">{isRegister ? "لديك حساب بالفعل؟" : "ليس لديك حساب؟"} </span>
            <button onClick={() => setIsRegister(!isRegister)} className="text-indigo-400 text-sm hover:text-indigo-300 font-medium">
              {isRegister ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </button>
          </div>
          <div className="mt-4 p-3 rounded-xl text-xs text-gray-500 text-center" style={{ background: "rgba(0,0,0,0.2)" }}>
            💡 للوصول كمسؤول: admin@santiago.com
          </div>
        </div>
        <div className="text-center mt-6">
          <button onClick={() => setPage("home")} className="text-gray-500 text-sm hover:text-gray-400 transition-colors">العودة للرئيسية</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ACCOUNT PAGE
// ============================================================
function AccountPage({ setPage }) {
  const { state, dispatch } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState("overview");

  if (!state.isLoggedIn) { setPage("login"); return null; }

  const tabs = [
    { id: "overview", label: "نظرة عامة", icon: "👤" },
    { id: "orders", label: "طلباتي", icon: "📦" },
    { id: "wishlist", label: "المفضلة", icon: "❤️" },
    { id: "profile", label: "تعديل الملف", icon: "✏️" },
  ];

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: "80px" }} dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-8 flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="rounded-2xl p-5" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>👤</div>
                <div className="text-white font-bold">{state.currentUser?.name}</div>
                <div className="text-gray-400 text-sm">{state.currentUser?.email}</div>
              </div>
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                    style={activeTab === tab.id ? { background: "rgba(99,102,241,0.3)" } : {}}>
                    <span>{tab.icon}</span><span>{tab.label}</span>
                  </button>
                ))}
                <button onClick={() => { dispatch({ type: "LOGOUT" }); setPage("home"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all mt-4">
                  <Icons.Logout /><span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-black text-white mb-6">مرحباً، {state.currentUser?.name}!</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[["📦", state.orders.length, "طلب"], ["❤️", state.wishlist.length, "مفضلة"], ["⭐", "4.8", "تقييم"]].map(([icon, num, label], i) => (
                    <div key={i} className="p-4 rounded-2xl text-center" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <div className="text-3xl mb-1">{icon}</div>
                      <div className="text-white font-black text-2xl">{num}</div>
                      <div className="text-gray-400 text-sm">{label}</div>
                    </div>
                  ))}
                </div>
                <h3 className="text-white font-bold mb-3">آخر الطلبات</h3>
                <div className="space-y-3">
                  {state.orders.slice(-3).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                      <div>
                        <div className="text-white font-medium">{order.id}</div>
                        <div className="text-gray-400 text-sm">{order.date}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "تم التوصيل" ? "text-green-400 bg-green-400/10" : order.status === "قيد الشحن" ? "text-blue-400 bg-blue-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
                        {order.status}
                      </span>
                      <span className="text-white font-bold">{order.total} ر.س</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-black text-white mb-6">طلباتي</h2>
                <div className="space-y-4">
                  {state.orders.map(order => (
                    <div key={order.id} className="p-5 rounded-2xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-white font-bold">{order.id}</div>
                          <div className="text-gray-400 text-sm">{order.date} • {order.items} منتجات</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "تم التوصيل" ? "text-green-400 bg-green-400/10" : order.status === "قيد الشحن" ? "text-blue-400 bg-blue-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/10 pt-3">
                        <span className="text-white font-black text-xl">{order.total} ر.س</span>
                        <button className="px-4 py-2 rounded-xl text-indigo-400 border border-indigo-500/50 text-sm hover:bg-indigo-500/10 transition-all">تتبع الطلب</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-black text-white mb-6">المفضلة ({state.wishlist.length})</h2>
                {state.wishlist.length === 0 ? (
                  <div className="text-center py-16"><div className="text-6xl mb-4">❤️</div><p className="text-gray-400">قائمة المفضلة فارغة</p></div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {state.products.filter(p => state.wishlist.includes(p.id)).map(p => (
                      <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={() => {}} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-black text-white mb-6">تعديل الملف الشخصي</h2>
                <div className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  {[["الاسم الكامل", state.currentUser?.name], ["البريد الإلكتروني", state.currentUser?.email], ["رقم الهاتف", "+966 50 000 0000"], ["العنوان", "الرياض، المملكة العربية السعودية"]].map(([label, val], i) => (
                    <div key={i}>
                      <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                      <input defaultValue={val} className="w-full px-4 py-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }} />
                    </div>
                  ))}
                  <button className="w-full py-3 rounded-xl text-white font-bold transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function AdminDashboard({ setPage }) {
  const { state, dispatch } = useContext(StoreContext);
  const [activeSection, setActiveSection] = useState("analytics");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: "", price: "", originalPrice: "", category: "إلكترونيات", stock: "", description: "", image: "📦", badge: "" });

  if (!state.isAdmin) { setPage("home"); return null; }

  const totalRevenue = state.orders.reduce((a, b) => a + b.total, 0);

  const sections = [
    { id: "analytics", label: "الإحصائيات", icon: <Icons.BarChart /> },
    { id: "products", label: "المنتجات", icon: <Icons.Package /> },
    { id: "categories", label: "الفئات", icon: <Icons.Grid /> },
    { id: "orders", label: "الطلبات", icon: <Icons.Truck /> },
    { id: "users", label: "المستخدمون", icon: <Icons.Users /> },
    { id: "coupons", label: "الكوبونات", icon: <Icons.Tag /> },
  ];

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: "", originalPrice: "", category: "إلكترونيات", stock: "", description: "", image: "📦", badge: "" });
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({ name: product.name, price: product.price, originalPrice: product.originalPrice || "", category: product.category, stock: product.stock, description: product.description, image: product.image, badge: product.badge || "" });
    setShowProductModal(true);
  };

  const saveProduct = () => {
    const data = { ...productForm, price: +productForm.price, originalPrice: productForm.originalPrice ? +productForm.originalPrice : null, stock: +productForm.stock };
    if (editingProduct) dispatch({ type: "UPDATE_PRODUCT", product: { ...editingProduct, ...data } });
    else dispatch({ type: "ADD_PRODUCT", product: data });
    setShowProductModal(false);
  };

  return (
    <div style={{ background: "#020617", minHeight: "100vh", paddingTop: "80px" }} dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 fixed right-0 top-16 bottom-0 overflow-y-auto p-4 flex-shrink-0" style={{ background: "#0f172a", borderLeft: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="py-4">
            <div className="flex items-center gap-2 px-3 py-2 mb-6 rounded-xl" style={{ background: "rgba(99,102,241,0.15)" }}>
              <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-black text-sm">⚡</div>
              <div><div className="text-white text-sm font-bold">لوحة التحكم</div><div className="text-gray-400 text-xs">مسؤول النظام</div></div>
            </div>
            <div className="space-y-1">
              {sections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeSection === s.id ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                  style={activeSection === s.id ? { background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(168,85,247,0.2))" } : {}}>
                  {s.icon}<span>{s.label}</span>
                </button>
              ))}
              <button onClick={() => setPage("home")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all mt-6">
                <Icons.Home /><span>عودة للمتجر</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 mr-64 p-6">
          {/* Analytics */}
          {activeSection === "analytics" && (
            <div>
              <h1 className="text-3xl font-black text-white mb-6">الإحصائيات والتقارير</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "إجمالي الطلبات", value: state.orders.length, icon: "📦", color: "#6366f1" },
                  { label: "إجمالي العملاء", value: state.users.length, icon: "👥", color: "#10b981" },
                  { label: "إجمالي الإيرادات", value: `${totalRevenue} ر.س`, icon: "💰", color: "#f59e0b" },
                  { label: "المنتجات", value: state.products.length, icon: "🛍️", color: "#8b5cf6" },
                ].map((stat, i) => (
                  <div key={i} className="p-5 rounded-2xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-3xl">{stat.icon}</div>
                      <span className="text-xs px-2 py-1 rounded-full text-green-400" style={{ background: "rgba(16,185,129,0.1)" }}>↑ 12%</span>
                    </div>
                    <div className="text-white font-black text-2xl">{stat.value}</div>
                    <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Charts simulation */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <h3 className="text-white font-bold mb-4">المبيعات الأسبوعية</h3>
                  <div className="flex items-end gap-2 h-40">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%`, background: "linear-gradient(to top, #6366f1, #8b5cf6)" }} />
                        <div className="text-gray-500 text-xs">{["س", "ح", "ن", "ث", "أ", "خ", "ج"][i]}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 rounded-2xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <h3 className="text-white font-bold mb-4">الأكثر مبيعاً</h3>
                  <div className="space-y-3">
                    {state.products.filter(p => p.isBestSeller).slice(0, 4).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-4">{i + 1}</span>
                        <span className="text-xl">{p.image}</span>
                        <span className="text-white text-sm flex-1 truncate">{p.name}</span>
                        <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                          <div className="h-full rounded-full" style={{ width: `${85 - i * 15}%`, background: "linear-gradient(to right,#6366f1,#8b5cf6)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Management */}
          {activeSection === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-white">إدارة المنتجات</h1>
                <button onClick={openAddModal} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  <Icons.Plus /><span>إضافة منتج</span>
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
                <table className="w-full">
                  <thead style={{ background: "rgba(99,102,241,0.15)" }}>
                    <tr>
                      {["المنتج", "الفئة", "السعر", "المخزون", "التقييم", "إجراءات"].map(h => (
                        <th key={h} className="text-right px-4 py-3 text-gray-300 font-medium text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.products.map((p, i) => (
                      <tr key={p.id} style={{ background: i % 2 === 0 ? "rgba(99,102,241,0.05)" : "transparent", borderTop: "1px solid rgba(99,102,241,0.1)" }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{p.image}</span>
                            <span className="text-white text-sm font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{p.category}</td>
                        <td className="px-4 py-3 text-white font-bold text-sm">{p.price} ر.س</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 5 ? "text-green-400 bg-green-400/10" : p.stock > 0 ? "text-yellow-400 bg-yellow-400/10" : "text-red-400 bg-red-400/10"}`}>
                            {p.stock > 0 ? p.stock : "نفذ"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-yellow-400 text-sm">⭐ {p.rating}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEditModal(p)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-all"><Icons.Edit /></button>
                            <button onClick={() => dispatch({ type: "DELETE_PRODUCT", id: p.id })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-all"><Icons.Trash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories Management */}
          {activeSection === "categories" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-white">إدارة الفئات</h1>
                <button onClick={() => dispatch({ type: "ADD_CATEGORY", category: { name: "فئة جديدة", icon: "📦" } })}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  <Icons.Plus /><span>إضافة فئة</span>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {state.categories.map(cat => (
                  <div key={cat.id} className="p-5 rounded-2xl flex items-center justify-between" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <div className="text-white font-bold">{cat.name}</div>
                        <div className="text-gray-400 text-sm">{cat.count} منتج</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-400/10"><Icons.Edit /></button>
                      <button onClick={() => dispatch({ type: "DELETE_CATEGORY", id: cat.id })} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10"><Icons.Trash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {activeSection === "orders" && (
            <div>
              <h1 className="text-3xl font-black text-white mb-6">إدارة الطلبات</h1>
              <div className="space-y-3">
                {state.orders.map(order => (
                  <div key={order.id} className="p-5 rounded-2xl flex items-center justify-between" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <div>
                      <div className="text-white font-bold">{order.id}</div>
                      <div className="text-gray-400 text-sm">{order.date} • {order.items} منتجات</div>
                    </div>
                    <select defaultValue={order.status} className="px-3 py-2 rounded-xl text-white text-sm outline-none"
                      style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <option>قيد المعالجة</option>
                      <option>قيد الشحن</option>
                      <option>تم التوصيل</option>
                      <option>ملغي</option>
                    </select>
                    <span className="text-white font-black text-xl">{order.total} ر.س</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {activeSection === "users" && (
            <div>
              <h1 className="text-3xl font-black text-white mb-6">إدارة المستخدمين</h1>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
                <table className="w-full">
                  <thead style={{ background: "rgba(99,102,241,0.15)" }}>
                    <tr>
                      {["المستخدم", "البريد", "الطلبات", "تاريخ الانضمام", "الحالة", "إجراءات"].map(h => (
                        <th key={h} className="text-right px-4 py-3 text-gray-300 font-medium text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.users.map((user, i) => (
                      <tr key={user.id} style={{ background: i % 2 === 0 ? "rgba(99,102,241,0.05)" : "transparent", borderTop: "1px solid rgba(99,102,241,0.1)" }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>👤</div>
                            <span className="text-white text-sm">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{user.email}</td>
                        <td className="px-4 py-3 text-white text-sm">{user.orders}</td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{user.joined}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === "نشط" ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => dispatch({ type: "UPDATE_USER_STATUS", id: user.id, status: user.status === "نشط" ? "محظور" : "نشط" })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${user.status === "نشط" ? "text-red-400 bg-red-400/10 hover:bg-red-400/20" : "text-green-400 bg-green-400/10 hover:bg-green-400/20"}`}>
                            {user.status === "نشط" ? "حظر" : "تفعيل"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Coupons */}
          {activeSection === "coupons" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-white">الكوبونات والخصومات</h1>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  <Icons.Plus /><span>إضافة كوبون</span>
                </button>
              </div>
              <div className="space-y-4">
                {state.coupons.map(coupon => (
                  <div key={coupon.id} className="p-5 rounded-2xl flex items-center justify-between" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🎟️</span>
                      <div>
                        <div className="text-white font-bold font-mono text-lg">{coupon.code}</div>
                        <div className="text-gray-400 text-sm">خصم {coupon.discount}{coupon.type === "نسبة" ? "%" : " ر.س"} • استُخدم {coupon.used} مرة</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${coupon.active ? "text-green-400 bg-green-400/10" : "text-gray-400 bg-gray-400/10"}`}>
                        {coupon.active ? "نشط" : "غير نشط"}
                      </span>
                      <button onClick={() => dispatch({ type: "TOGGLE_COUPON", id: coupon.id })}
                        className="px-4 py-2 rounded-xl text-sm text-indigo-300 border border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
                        {coupon.active ? "إيقاف" : "تفعيل"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
          <div className="relative w-full max-w-lg rounded-3xl p-6 z-10 max-h-screen overflow-y-auto" style={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)" }}>
            <h2 className="text-2xl font-black text-white mb-6">{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
            <div className="space-y-4">
              {[["name", "اسم المنتج", "text"], ["price", "السعر (ر.س)", "number"], ["originalPrice", "السعر الأصلي (اختياري)", "number"], ["stock", "الكمية في المخزن", "number"], ["image", "رمز المنتج (emoji)", "text"], ["badge", "الشارة (اختياري)", "text"]].map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                  <input type={type} value={productForm[key]} onChange={e => setProductForm({ ...productForm, [key]: e.target.value })} placeholder={label}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }} />
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">الفئة</label>
                <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white outline-none text-right"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  {state.categories.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">الوصف</label>
                <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={3} placeholder="وصف المنتج"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 text-right resize-none"
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(99,102,241,0.2)" }} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowProductModal(false)} className="flex-1 py-3 rounded-xl text-gray-300 border border-gray-600 hover:bg-white/5 transition-all">إلغاء</button>
                <button onClick={saveProduct} className="flex-1 py-3 rounded-xl text-white font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  {editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SIMPLE PAGES
// ============================================================
function OffersPage({ setPage, setSelectedProduct }) {
  const { state } = useContext(StoreContext);
  const offers = state.products.filter(p => p.originalPrice);
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: "80px" }} dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-3">🔥 العروض الحصرية</h1>
          <p className="text-gray-400">خصومات مذهلة على أفضل المنتجات لفترة محدودة</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {offers.map(p => <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} />)}
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

function ContactPage({ setPage }) {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: "80px" }} dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-3">اتصل بنا</h1>
          <p className="text-gray-400">نحن هنا لمساعدتك في أي وقت</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[["الاسم", "text"], ["البريد الإلكتروني", "email"], ["رقم الهاتف", "tel"]].map(([l, t], i) => (
              <input key={i} type={t} placeholder={l} className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }} />
            ))}
            <textarea rows={5} placeholder="رسالتك..." className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 text-right resize-none"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }} />
            <button className="w-full py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition-all" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              إرسال الرسالة
            </button>
          </div>
          <div className="space-y-5">
            {[["📞", "الهاتف", "+966 12 345 6789"], ["📧", "البريد الإلكتروني", "info@santiago-store.com"], ["📍", "العنوان", "الرياض، المملكة العربية السعودية"], ["🕐", "أوقات العمل", "السبت - الخميس: 9ص - 9م"]].map(([icon, label, value], i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <span className="text-3xl">{icon}</span>
                <div><div className="text-gray-400 text-sm">{label}</div><div className="text-white font-medium">{value}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

function SearchPage({ setPage, setSelectedProduct }) {
  const { state } = useContext(StoreContext);
  const [query, setQuery] = useState("");
  const results = query.length > 1 ? state.products.filter(p => p.name.includes(query) || p.category.includes(query)) : [];

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", paddingTop: "80px" }} dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-6">البحث</h1>
        <div className="relative mb-8">
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث عن أي منتج..."
            className="w-full pl-5 pr-14 py-5 rounded-2xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500 text-right text-xl"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }} />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"><Icons.Search /></div>
        </div>
        {query.length > 1 && (
          <div>
            <p className="text-gray-400 mb-4">{results.length} نتيجة لـ "{query}"</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {results.map(p => <ProductCard key={p.id} product={p} setPage={setPage} setSelectedProduct={setSelectedProduct} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <div style={{ fontFamily: "'Noto Sans Arabic', 'Cairo', 'Segoe UI', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { direction: rtl; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #0f172a; }
          ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 3px; }
          select option { background: #1e293b; color: white; }
          .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        `}</style>
        {page !== "login" && <Navbar page={page} setPage={setPage} />}
        {page === "home" && <HomePage setPage={setPage} setSelectedProduct={setSelectedProduct} />}
        {page === "products" && <ProductsPage setPage={setPage} setSelectedProduct={setSelectedProduct} />}
        {page === "product" && selectedProduct && <ProductDetailPage product={selectedProduct} setPage={setPage} />}
        {page === "offers" && <OffersPage setPage={setPage} setSelectedProduct={setSelectedProduct} />}
        {page === "categories" && <ProductsPage setPage={setPage} setSelectedProduct={setSelectedProduct} />}
        {page === "contact" && <ContactPage setPage={setPage} />}
        {page === "search" && <SearchPage setPage={setPage} setSelectedProduct={setSelectedProduct} />}
        {page === "login" && <LoginPage setPage={setPage} />}
        {page === "account" && <AccountPage setPage={setPage} />}
        {page === "checkout" && <CheckoutPage setPage={setPage} />}
        {page === "admin" && <AdminDashboard setPage={setPage} />}
      </div>
    </StoreContext.Provider>
  );
}
