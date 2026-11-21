import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../services/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
import { EmptyState, ErrorMessage } from '../components/Feedback.jsx';

export default function CartPage() {
  const { user, refreshCart } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCart = useCallback(async () => {
    if (!user) return;
    const { data } = await api.get(`/cart/${encodeURIComponent(user.email)}`);
    setItems(data);
  }, [user]);

  useEffect(() => {
    loadCart().catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  }, [loadCart]);

  const updateQuantity = async (item, quantity) => {
    try {
      if (quantity <= 0) await api.delete(`/cart/remove/${item.id}`);
      else await api.put('/cart/update', { cartItemId: item.id, quantity });
      await Promise.all([loadCart(), refreshCart()]);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.lineTotal), 0);
  const shipping = subtotal >= 250 ? 0 : 12;

  if (loading) return <main className="container page-shell"><Loading label="Loading your cart..." /></main>;
  return (
    <main className="container page-shell">
      <div className="page-intro compact-intro"><span className="eyebrow">YOUR SELECTION</span><h1>The cart.</h1></div>
      <ErrorMessage>{error}</ErrorMessage>
      {!items.length ? <EmptyState title="Your next favourite is waiting." action={<Link className="button-dark" to="/shop">Explore watches</Link>}>Your cart is empty for now.</EmptyState> :
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => <article className="cart-item" key={item.id}>
              <Link to={`/products/${item.productId}`} className="cart-thumb"><img src={item.imageUrl} alt={item.name} /></Link>
              <div className="cart-item-info"><span className="eyebrow">{item.brand}</span><Link to={`/products/${item.productId}`} className="product-name">{item.name}</Link><span className="cart-unit-price">${Number(item.price).toFixed(2)}</span>
                <button className="remove-link" onClick={() => updateQuantity(item, 0)}>Remove</button>
              </div>
              <div className="cart-quantity">
                <div className="quantity-control"><button aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item, item.quantity - 1)}>−</button><span>{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} disabled={item.quantity >= item.stock} onClick={() => updateQuantity(item, item.quantity + 1)}>+</button></div>
              </div>
              <strong className="cart-line-total">${Number(item.lineTotal).toFixed(2)}</strong>
            </article>)}
          </div>
          <aside className="order-summary">
            <span className="eyebrow">THE SUMMARY</span><h2>Almost yours.</h2>
            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-total"><span>Total</span><strong>${(subtotal + shipping).toFixed(2)}</strong></div>
            <Link to="/checkout" className="button-dark checkout-button">Proceed to checkout <span>→</span></Link>
            <p className="secure-note">Secure checkout · 30-day returns</p>
          </aside>
        </div>}
    </main>
  );
}
