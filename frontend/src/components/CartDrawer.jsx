import React from 'react';
import { ProductImage } from '../assets/productImages';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSimulateCheckout,
}) {
  if (!isOpen) return null;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalUSD = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const subtotalINR = Math.round(subtotalUSD * 83);
  const estimatedTaxINR = Math.round(subtotalINR * 0.08); // 8% estimated tax
  const totalINR = subtotalINR + estimatedTaxINR;

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="cart-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <span className="cart-icon">🛒</span>
            <h2>Your Shopping Cart</h2>
            <span className="cart-badge">{totalItems}</span>
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Cart Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-cart-icon">🛍️</div>
              <h3>Your cart is empty</h3>
              <p>Explore our catalog of developer gear and add products to start shopping.</p>
              <button className="btn-primary" onClick={onClose}>
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="cart-item-list">
              {cartItems.map((item) => {
                const itemINR = Math.round(item.price * 83);
                return (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item-thumb">
                      <ProductImage id={item.id} category={item.category} name={item.name} />
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-title-row">
                        <h4 className="cart-item-title">{item.name}</h4>
                        <button
                          className="cart-remove-btn"
                          onClick={() => onRemoveItem(item.id)}
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="cart-item-category">{item.category}</div>

                      <div className="cart-item-controls-row">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            –
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-price">
                          <span className="price-primary">
                            {formatINR(itemINR * item.quantity)}
                          </span>
                          <span className="price-unit">
                            ({formatINR(itemINR)} each)
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Cart Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatINR(subtotalINR)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE (DevOps Express)</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax (8%)</span>
                <span>{formatINR(estimatedTaxINR)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-amount">{formatINR(totalINR)}</span>
              </div>
            </div>

            <button
              className="btn-checkout"
              onClick={onSimulateCheckout}
              aria-label="Simulate Checkout"
            >
              Simulate Checkout →
            </button>

            <p className="checkout-note">
              🔒 Safe & simulated. No real transaction or credit card required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
