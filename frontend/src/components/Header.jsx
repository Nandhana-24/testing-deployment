import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';
import watchhubMark from '../assets/watchhub-mark.svg';

export default function Header() {
  const { user, cartCount, logout } = useAuth();
  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg container">
        <Link className="navbar-brand brand-mark" to="/" aria-label="WatchHub home">
          <img className="brand-icon" src={watchhubMark} alt="" /><span>WATCH<span className="brand-light">HUB</span></span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav mx-auto">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/shop">Shop</NavLink>
            <NavLink className="nav-link" to="/about">About</NavLink>
            <NavLink className="nav-link" to="/contact">Contact</NavLink>
            {user?.role === 'ADMIN' && <NavLink className="nav-link" to="/admin">Admin</NavLink>}
          </div>
          <div className="nav-actions">
            {user ? (
              <>
                <span className="nav-greeting">Hello, {user.name.split(' ')[0]}</span>
                <button className="nav-link-button" onClick={logout}>Logout</button>
              </>
            ) : <Link className="nav-login" to="/login">Login</Link>}
            <Link className="cart-link" to="/cart" aria-label="Shopping cart">
              <span className="cart-glyph">◷</span><span>Cart</span>{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
