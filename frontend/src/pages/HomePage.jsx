import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useAuth } from '../services/AuthContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Loading from '../components/Loading.jsx';
import { ErrorMessage } from '../components/Feedback.jsx';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, refreshCart } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products')
      .then(({ data }) => setProducts(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

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
    <>
      <section className="hero-section">
        <div className="hero-shade" />
        <div className="container hero-content">
          <span className="hero-kicker">TIME, CONSIDERED.</span>
          <h1>Discover your<br /><em>perfect watch.</em></h1>
          <p>Thoughtful design. Exceptional craft. Timepieces that feel like they were made just for you.</p>
          <Link className="button-gold" to="/shop">Shop the collection <span>→</span></Link>
          <div className="hero-note"><span className="hero-line" /> A better kind of everyday</div>
        </div>
        <div className="hero-index">01 <span>/</span> 03</div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <div><span className="eyebrow">THE EDIT</span><h2>Time well spent.</h2><p>Meet the pieces our community keeps coming back to.</p></div>
          <Link className="text-link" to="/shop">Explore all watches <span>↗</span></Link>
        </div>
        <ErrorMessage>{error}</ErrorMessage>
        {loading ? <Loading /> : <div className="product-grid">
          {[...products].sort((a, b) => b.rating - a.rating).slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
        </div>}
      </section>

      <section className="story-strip">
        <div className="container story-inner">
          <span className="eyebrow">OUR POINT OF VIEW</span>
          <h2>Less, but better.<br /><em>Always.</em></h2>
          <p>We believe a great watch should be more than something you wear. It should be something you keep.</p>
          <Link className="button-outline-light" to="/about">Get to know us <span>→</span></Link>
        </div>
        <div className="story-image" role="img" aria-label="Detail of a timeless wristwatch" />
      </section>

      <section className="container section-block arrivals-block">
        <div className="section-heading">
          <div><span className="eyebrow">JUST LANDED</span><h2>New arrivals</h2><p>Fresh faces, built to stand the test of time.</p></div>
          <Link className="text-link" to="/shop">Shop new arrivals <span>↗</span></Link>
        </div>
        {!loading && <div className="product-grid">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
        </div>}
      </section>

      <section className="newsletter-band">
        <div className="container newsletter-inner"><div><span className="eyebrow">A NOTE FROM US</span><h2>Good things take time.</h2><p>Join our list for new releases, stories, and a little something for your first order.</p></div>
          <form onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); window.alert('Thanks for joining the WatchHub list.'); }} className="newsletter-form">
            <label className="visually-hidden" htmlFor="newsletter-email">Your email address</label>
            <input id="newsletter-email" type="email" placeholder="Your email address" required />
            <button type="submit">Sign me up <span>→</span></button>
          </form>
        </div>
      </section>
    </>
  );
}
