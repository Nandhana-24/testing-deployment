import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
        {product.stock === 0 && <span className="stock-tag">Sold out</span>}
      </Link>
      <div className="product-card-body">
        <div className="product-card-top"><span className="eyebrow">{product.brand}</span><span className="rating">★ {Number(product.rating).toFixed(1)}</span></div>
        <Link to={`/products/${product.id}`} className="product-name">{product.name}</Link>
        <div className="product-card-bottom"><span className="price">${Number(product.price).toFixed(2)}</span><button className="quick-add" onClick={() => onAdd(product)} disabled={product.stock === 0} aria-label={`Add ${product.name} to cart`}>+</button></div>
        <Link className="details-link" to={`/products/${product.id}`}>View details <span>↗</span></Link>
      </div>
    </article>
  );
}
