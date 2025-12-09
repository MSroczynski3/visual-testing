import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          setProducts(result.data || []);
        }
      } catch {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main role="main" className="main-content">
        <div className="loading" role="status" aria-live="polite">
          <span>Loading products...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main role="main" className="main-content">
        <div className="error" role="alert">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main role="main" className="main-content">
      <section aria-labelledby="products-heading">
        <h1 id="products-heading" className="page-title">
          Our Products
        </h1>
        <div className="product-grid" role="list">
          {products.map((product) => (
            <div key={product.id} role="listitem">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <p className="no-products">No products available</p>
        )}
      </section>
    </main>
  );
}
