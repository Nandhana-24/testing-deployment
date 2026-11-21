import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../services/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
import { ErrorMessage } from '../components/Feedback.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { user, refreshCart } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(null);
    setError('');
    setLoading(true);
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!user) return navigate('/login', { state: { from: `/products/${id}` } });
    try {
      await api.post('/cart/add', { productId: product.id, quantity });
      await refreshCart();
      setNotice('Added to your cart.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <main className="container page-shell"><Loading /></main>;
  if (!product) return <main className="container page-shell"><ErrorMessage>{error || 'Watch not found.'}</ErrorMessage><Link to="/shop" className="text-link">Back to the collection</Link></main>;
  return (
    <main className="container page-shell">
      <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link><span>/</span>{product.name}</div>
      <section className="product-detail">
        <div className="detail-image"><img src={product.imageUrl} alt={product.name} /></div>
        <div className="detail-copy">
          <span className="eyebrow">{product.brand} · {product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-rating"><span>★ {Number(product.rating).toFixed(1)}</span> <span>·</span> <span>Thoughtfully made</span></div>
          <div className="detail-price">${Number(product.price).toFixed(2)}</div>
          <p className="detail-description">{product.description}</p>
          <div className={`stock-message ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>{product.stock > 0 ? `${product.stock} in stock — ready to ship` : 'Currently out of stock'}</div>
          <div className="buy-row">
            <div className="quantity-control"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)}>−</button><span>{quantity}</span><button aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => value + 1)}>+</button></div>
            <button className="button-dark add-detail" onClick={addToCart} disabled={product.stock === 0}>Add to cart <span>→</span></button>
          </div>
          <ErrorMessage>{error}</ErrorMessage>
          {notice && <div className="alert alert-success">{notice} <Link to="/cart">View cart</Link></div>}
          <div className="detail-promise"><span>◇</span> Complimentary shipping on orders over $250</div>
          <div className="detail-promise"><span>↺</span> 30-day returns, no questions asked</div>
        </div>
      </section>
    </main>
  );
}
