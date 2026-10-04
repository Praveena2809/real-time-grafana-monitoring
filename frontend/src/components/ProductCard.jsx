import React, { useState } from 'react';
import { ProductImage } from '../assets/productImages';

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Convert USD to INR representation (₹ ~83 per USD for realistic Indian/college context)
  const inrPrice = Math.round(product.price * 83);
  const formattedINR = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inrPrice);

  return (
    <article className="product-card">
      {/* Product Image Container */}
      <div className="product-media">
        <ProductImage id={product.id} category={product.category} name={product.name} />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </div>

      {/* Product Information */}
      <div className="product-body">
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <div className="product-rating">
            <span className="star">★</span>
            <span className="rating-value">{product.rating || '4.8'}</span>
            <span className="reviews">({product.reviews || '85'})</span>
          </div>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-desc">
          {product.description || 'Engineered for high performance and reliability.'}
        </p>

        <div className="product-footer">
          <div className="price-block">
            <span className="price-main">{formattedINR}</span>
            <span className="price-sub">(${product.price.toFixed(2)})</span>
          </div>

          <button
            className={`btn-add-cart ${added ? 'added' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? '✓ Added' : '+ Add'}
          </button>
        </div>

        <div className="product-stock">
          <span className="stock-dot"></span>
          <span>In Stock ({product.stock} available)</span>
        </div>
      </div>
    </article>
  );
}
