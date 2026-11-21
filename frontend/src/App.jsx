import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './services/AuthContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import InfoPage from './pages/InfoPage.jsx';
import Loading from './components/Loading.jsx';

function StoreLayout() {
  return <><Header /><Outlet /><Footer /></>;
}

function RequireUser({ admin = false, children }) {
  const { user, authLoading } = useAuth();
  const location = useLocation();
  if (authLoading) return <main className="container page-shell"><Loading label="Checking your account..." /></main>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/cart" element={<RequireUser><CartPage /></RequireUser>} />
        <Route path="/checkout" element={<RequireUser><CheckoutPage /></RequireUser>} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage register />} />
        <Route path="/admin" element={<RequireUser admin><AdminPage /></RequireUser>} />
        <Route path="/about" element={<InfoPage />} />
        <Route path="/contact" element={<InfoPage />} />
        <Route path="*" element={<main className="container page-shell not-found"><h1>That page has wandered off.</h1><p>Let's get you back to good time.</p><a className="button-dark" href="/">Back home</a></main>} />
      </Route>
    </Routes>
  );
}
