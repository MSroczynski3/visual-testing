import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card" aria-labelledby={`product-name-${product.id}`}>
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img
            src={product.image_url || 'https://picsum.photos/seed/placeholder/400/300'}
            alt=""
            className="product-image"
            loading="lazy"
          />
        </div>
        <div className="product-card-content">
          <h2 id={`product-name-${product.id}`} className="product-name">
            {product.name}
          </h2>
          <p className="product-description">
            {product.description?.slice(0, 80)}
            {product.description && product.description.length > 80 ? '...' : ''}
          </p>
          <p className="product-price" aria-label={`Price: ${product.price} dollars`}>
            ${product.price.toFixed(2)}
          </p>
          <span className="view-details-link">View details</span>
        </div>
      </Link>
    </article>
  );
}
