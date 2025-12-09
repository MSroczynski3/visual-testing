import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`);
        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          setProduct(result.data);
        }
      } catch {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <main role="main" className="main-content">
        <div className="loading" role="status" aria-live="polite">
          <span>Loading product...</span>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main role="main" className="main-content">
        <div className="error" role="alert">
          <p>{error || 'Product not found'}</p>
          <Link to="/" className="back-link">
            <ArrowLeft aria-hidden="true" size={18} />
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main role="main" className="main-content">
      <article className="product-detail" aria-labelledby="product-title">
        <Link to="/" className="back-link">
          <ArrowLeft aria-hidden="true" size={18} />
          Back to products
        </Link>

        <div className="product-detail-layout">
          <div className="product-detail-image-container">
            <img
              src={product.image_url || 'https://picsum.photos/seed/placeholder/400/300'}
              alt=""
              className="product-detail-image"
            />
          </div>

          <div className="product-detail-info">
            <h1 id="product-title" className="product-detail-name">
              {product.name}
            </h1>
            <p
              className="product-detail-price"
              aria-label={`Price: ${product.price} dollars`}
            >
              ${product.price.toFixed(2)}
            </p>
            <p className="product-detail-description">{product.description}</p>
            <button
              onClick={handleAddToCart}
              className="add-to-cart-button"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart aria-hidden="true" size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
