import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../services/AuthContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Loading from '../components/Loading.jsx';
import { EmptyState, ErrorMessage } from '../components/Feedback.jsx';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filters, setFilters] = useState({});
  const { user, refreshCart } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/products', { params: filters })
      .then(({ data }) => setProducts(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [filters]);

  const submitFilters = (event) => {
    event.preventDefault();
    setFilters({ search: search.trim(), category, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined });
  };

  const addToCart = async (product) => {
    if (!user) return navigate('/login', { state: { from: '/shop' } });
    try {
      await api.post('/cart/add', { productId: product.id, quantity: 1 });
      await refreshCart();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <main className="container page-shell">
      <div className="page-intro"><span className="eyebrow">THE WATCH EDIT</span><h1>Find your next <em>forever.</em></h1><p>Explore the collection, chosen for quality, character, and the long run.</p></div>
      <form className="filter-bar" onSubmit={submitFilters}>
        <div className="filter-search"><label htmlFor="shop-search">Search</label><input id="shop-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or brand" /></div>
        <div><label htmlFor="category-filter">Category</label><select id="category-filter" value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">All watches</option><option>Automatic</option><option>Chronograph</option><option>Classic</option><option>Minimal</option><option>Sport</option></select></div>
        <div className="price-filter"><label htmlFor="min-price">Price range</label><div><input id="min-price" type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="From $" /><input aria-label="Maximum price" type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="To $" /></div></div>
        <button className="button-dark filter-button" type="submit">Apply filters</button>
      </form>
      <ErrorMessage>{error}</ErrorMessage>
      <div className="results-caption">{loading ? 'Finding your watches…' : `${products.length} ${products.length === 1 ? 'timepiece' : 'timepieces'}`}</div>
      {loading ? <Loading /> : products.length ? <div className="product-grid shop-grid">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div> :
        error ? <div className="empty-state"><h2>We couldn’t load the collection.</h2><p>Please check your connection and try again.</p></div> :
          <EmptyState title="No watches found">Try a different search or clear a filter.</EmptyState>}
    </main>
  );
}
