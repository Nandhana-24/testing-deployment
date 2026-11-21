import { useCallback, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api.js';
import Loading from '../components/Loading.jsx';
import { ErrorMessage } from '../components/Feedback.jsx';

const blankProduct = { name: '', brand: '', category: 'Automatic', price: '', description: '', imageUrl: '', stock: 0, rating: 4.5 };

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [form, setForm] = useState(blankProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadProducts = useCallback(async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  }, []);

  const loadOrders = useCallback(async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
  }, []);

  useEffect(() => {
    loadProducts().catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  }, [loadProducts]);

  const switchTab = async (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'orders') {
      try { await loadOrders(); } catch (err) { setError(getErrorMessage(err)); }
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), rating: Number(form.rating) };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      await loadProducts();
      setForm(blankProduct);
      setEditingId(null);
      setNotice(editingId ? 'Watch updated.' : 'Watch added to the collection.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({ name: product.name, brand: product.brand, category: product.category, price: product.price, description: product.description, imageUrl: product.imageUrl, stock: product.stock, rating: product.rating });
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}" from the catalog?`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      await loadProducts();
      setNotice('Watch removed.');
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <main className="container page-shell"><Loading label="Loading dashboard..." /></main>;
  return (
    <main className="container page-shell admin-page">
      <div className="page-intro compact-intro"><span className="eyebrow">WATCHHUB CONTROL ROOM</span><h1>Admin <em>dashboard.</em></h1></div>
      <div className="admin-tabs"><button className={activeTab === 'products' ? 'active' : ''} onClick={() => switchTab('products')}>Products & stock</button><button className={activeTab === 'orders' ? 'active' : ''} onClick={() => switchTab('orders')}>Orders <span>{orders.length || ''}</span></button></div>
      <ErrorMessage>{error}</ErrorMessage>
      {notice && <div className="alert alert-success">{notice}</div>}
      {activeTab === 'products' ? <>
        <form className="admin-form" onSubmit={saveProduct}>
          <div className="admin-form-heading"><div><span className="eyebrow">{editingId ? 'UPDATE YOUR CATALOG' : 'GROW THE COLLECTION'}</span><h2>{editingId ? 'Edit watch' : 'Add a watch'}</h2></div>
            {editingId && <button className="text-link" type="button" onClick={() => { setEditingId(null); setForm(blankProduct); }}>Cancel edit</button>}
          </div>
          <div className="admin-fields">
            <label>Product name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength="120" required /></label>
            <label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} maxLength="80" required /></label>
            <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Automatic', 'Chronograph', 'Classic', 'Minimal', 'Sport'].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label>Price (USD)<input type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
            <label>Stock<input type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></label>
            <label>Rating<input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} required /></label>
            <label className="wide-field">Image URL<input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} maxLength="1000" required /></label>
            <label className="wide-field">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength="1000" rows="2" required /></label>
          </div>
          <button className="button-dark" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Add watch'} <span>→</span></button>
        </form>
        <div className="admin-table-wrap"><table className="table admin-table"><thead><tr><th>Watch</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>
          {products.map((product) => <tr key={product.id}><td><div className="admin-product"><img src={product.imageUrl} alt="" /><span><strong>{product.name}</strong><small>{product.brand}</small></span></div></td><td>{product.category}</td><td>${Number(product.price).toFixed(2)}</td><td><span className={product.stock < 5 ? 'low-stock' : ''}>{product.stock}</span></td><td><button className="table-action" onClick={() => editProduct(product)}>Edit</button><button className="table-action danger-action" onClick={() => deleteProduct(product)}>Delete</button></td></tr>)}
        </tbody></table></div>
      </> : <div className="admin-table-wrap order-table-wrap"><table className="table admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>
        {orders.map((order) => <tr key={order.id}><td>#{order.id}</td><td>{order.customerName}<small className="table-subtext">{order.email}</small></td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td>{new Date(order.createdAt).toLocaleDateString()}</td><td>${Number(order.total).toFixed(2)}</td><td><span className="order-status">{order.status}</span></td></tr>)}
        {!orders.length && <tr><td colSpan="6" className="no-orders">No orders yet.</td></tr>}
      </tbody></table></div>}
    </main>
  );
}
