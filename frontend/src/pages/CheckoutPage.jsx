import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../services/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
import { EmptyState, ErrorMessage } from '../components/Feedback.jsx';

export default function CheckoutPage() {
  const { user, refreshCart } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({ customerName: user?.name || '', email: user?.email || '', phone: '', address: '' });

  useEffect(() => {
    api.get(`/cart/${encodeURIComponent(user.email)}`)
      .then(({ data }) => setItems(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user.email]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/orders', form);
      setOrder(data);
      setItems([]);
      await refreshCart();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main className="container page-shell"><Loading label="Preparing checkout..." /></main>;
  if (order) return <main className="container page-shell confirmation-page">
    <div className="confirmation-icon">✓</div><span className="eyebrow">ORDER CONFIRMED</span><h1>Thank you, {order.customerName.split(' ')[0]}.</h1>
    <p>Your order <strong>#{order.id}</strong> is confirmed. We’ll send updates to {order.email}.</p>
    <div className="confirmation-total"><span>Order total</span><strong>${Number(order.total).toFixed(2)}</strong></div>
    <Link className="button-dark" to="/shop">Continue exploring</Link>
  </main>;
  if (!items.length) return <main className="container page-shell"><EmptyState title="Nothing to check out yet." action={<Link className="button-dark" to="/shop">Explore watches</Link>}>Add a timepiece to your cart first.</EmptyState></main>;

  const total = items.reduce((sum, item) => sum + Number(item.lineTotal), 0);
  const shipping = total >= 250 ? 0 : 12;
  return (
    <main className="container page-shell">
      <div className="page-intro compact-intro"><span className="eyebrow">ALMOST THERE</span><h1>Checkout.</h1></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit}>
          <span className="eyebrow">DELIVERY DETAILS</span><h2>Where should we send it?</h2>
          <ErrorMessage>{error}</ErrorMessage>
          <label htmlFor="customerName">Full name</label><input id="customerName" name="customerName" value={form.customerName} onChange={change} maxLength="100" required />
          <label htmlFor="email">Email address</label><input id="email" name="email" type="email" value={form.email} onChange={change} maxLength="180" required />
          <label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" value={form.phone} onChange={change} maxLength="30" required />
          <label htmlFor="address">Delivery address</label><textarea id="address" name="address" rows="3" value={form.address} onChange={change} maxLength="500" required />
          <button type="submit" className="button-dark place-order" disabled={submitting}>{submitting ? 'Placing your order...' : 'Place order'} <span>→</span></button>
        </form>
        <aside className="order-summary checkout-summary"><span className="eyebrow">ORDER SUMMARY</span><h2>Your selection.</h2>
          {items.map((item) => <div className="checkout-line" key={item.id}><span>{item.name} <small>× {item.quantity}</small></span><strong>${Number(item.lineTotal).toFixed(2)}</strong></div>)}
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="summary-total"><span>Total</span><strong>${(total + shipping).toFixed(2)}</strong></div>
          <Link className="back-to-cart" to="/cart">← Back to cart</Link>
        </aside>
      </div>
    </main>
  );
}
