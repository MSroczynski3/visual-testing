import { useState, useEffect, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return products;
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query) ?? false;
      return nameMatch || descMatch;
    });
  }, [products, searchQuery]);

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

        <div className="search-bar">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            className="search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid" role="list">
            {filteredProducts.map((product) => (
              <div key={product.id} role="listitem">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="no-results">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M8 8l6 6" />
              <path d="M14 8l-6 6" />
            </svg>
            <p className="no-results-text">
              No products found for "<strong>{searchQuery}</strong>"
            </p>
            <button
              type="button"
              className="clear-search-link"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          </div>
        ) : (
          <p className="no-products">No products available</p>
        )}
      </section>
    </main>
  );
}
