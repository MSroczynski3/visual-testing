import { CheckCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function SuccessBanner() {
  const { showSuccessBanner, dismissSuccessBanner } = useCart();

  if (!showSuccessBanner) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="success-banner"
    >
      <div className="success-banner-content">
        <CheckCircle aria-hidden="true" size={20} />
        <span>Item added to cart successfully!</span>
      </div>
      <button
        onClick={dismissSuccessBanner}
        className="success-banner-close"
        aria-label="Dismiss notification"
      >
        <X aria-hidden="true" size={18} />
      </button>
    </div>
  );
}
