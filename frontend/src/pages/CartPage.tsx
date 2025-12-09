import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main role="main" className="main-content">
        <section className="cart-empty" aria-labelledby="cart-title">
          <ShoppingBag aria-hidden="true" size={64} className="cart-empty-icon" />
          <h1 id="cart-title" className="page-title">
            Your Cart is Empty
          </h1>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="continue-shopping-link">
            <ArrowLeft aria-hidden="true" size={18} />
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main role="main" className="main-content">
      <section aria-labelledby="cart-heading">
        <div className="cart-header">
          <h1 id="cart-heading" className="page-title">
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="clear-cart-button"
            aria-label="Remove all items from cart"
          >
            Clear Cart
          </button>
        </div>

        <ul className="cart-items" role="list" aria-label="Cart items">
          {items.map((item) => (
            <li key={item.product.id} className="cart-item">
              <img
                src={item.product.image_url || 'https://picsum.photos/seed/placeholder/400/300'}
                alt=""
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2 className="cart-item-name">{item.product.name}</h2>
                <p className="cart-item-price">
                  ${item.product.price.toFixed(2)} x {item.quantity}
                </p>
                <p className="cart-item-subtotal">
                  Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="remove-item-button"
                aria-label={`Remove ${item.product.name} from cart`}
              >
                <Trash2 aria-hidden="true" size={20} />
              </button>
            </li>
          ))}
        </ul>

        <div className="cart-summary">
          <p className="cart-total" aria-live="polite">
            Total: <strong>${totalPrice.toFixed(2)}</strong>
          </p>
        </div>

        <Link to="/" className="back-link">
          <ArrowLeft aria-hidden="true" size={18} />
          Continue Shopping
        </Link>
      </section>
    </main>
  );
}
