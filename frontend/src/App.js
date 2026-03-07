import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ContactPage from './pages/ContactPage';

function AppRoutes() {
  const [page, setPage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);

  const isProductPage = page.startsWith('product-');
  const productId = isProductPage ? page.replace('product-', '') : null;
  const noNavPages = ['login', 'register', 'admin'];
  const showNav = !noNavPages.includes(page);

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      {showNav && <Navbar page={page} setPage={setPage} setCartOpen={setCartOpen} />}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} setPage={setPage} />

      {page === 'home' && <HomePage setPage={setPage} />}
      {page === 'shop' && <ShopPage setPage={setPage} />}
      {isProductPage && <ProductPage productId={productId} setPage={setPage} />}
      {page === 'login' && <LoginPage setPage={setPage} />}
      {page === 'register' && <RegisterPage setPage={setPage} />}
      {page === 'checkout' && <CheckoutPage setPage={setPage} />}
      {page === 'dashboard' && <UserDashboard setPage={setPage} />}
      {page === 'admin' && <AdminDashboard setPage={setPage} />}
      {page === 'contact' && <ContactPage />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}
