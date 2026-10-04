import React from 'react';

export default function Navbar({ cartCount, onOpenCart, onOpenAbout, onScrollToProducts, backendOnline }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="brand" onClick={onScrollToProducts} role="button" tabIndex={0}>
          <div className="brand-icon">🛒</div>
          <div className="brand-text">
            <span className="brand-title">GrafanaShop</span>
            <span className="brand-subtitle">DevOps Workspace Gear</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button className="nav-link" onClick={onScrollToProducts}>
            Products
          </button>
          <button className="nav-link" onClick={onScrollToProducts}>
            Categories
          </button>
          <button className="nav-link" onClick={onOpenAbout}>
            About System
          </button>
        </nav>

        {/* Right actions: Backend status & Cart */}
        <div className="navbar-actions">
          {/* Live Telemetry Health Indicator */}
          <div className={`system-badge ${backendOnline ? 'online' : 'offline'}`} title={`FastAPI Backend: ${backendOnline ? 'Healthy' : 'Disconnected'}`}>
            <span className="status-dot"></span>
            <span className="status-label">{backendOnline ? 'API Healthy' : 'API Offline'}</span>
          </div>

          {/* Cart Button */}
          <button className="cart-btn" onClick={onOpenCart} aria-label="Open Shopping Cart">
            <span className="cart-btn-icon">🛍️</span>
            <span className="cart-btn-text">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
