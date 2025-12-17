import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export function Header() {
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <header role="banner" className="header">
      <nav role="navigation" aria-label="Main navigation" className="header-nav">
        <Link to="/" className="logo" aria-label="Visual Testing Store - Home">
          <Store aria-hidden="true" size={28} />
          <span>Visual Testing Store</span>
        </Link>

        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'light' ? (
              <Moon aria-hidden="true" size={20} />
            ) : (
              <Sun aria-hidden="true" size={20} />
            )}
          </button>

          <Link
            to="/cart"
            className="cart-link"
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <ShoppingCart aria-hidden="true" size={24} />
            {totalItems > 0 && (
              <span className="cart-badge" aria-hidden="true" data-testid="cart-badge">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
