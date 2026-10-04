import React from 'react';
import ProductCard from './ProductCard';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';

export default function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  onAddToCart,
  searchQuery,
  onClearSearch,
}) {
  if (loading) {
    return <LoadingSkeleton count={6} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔎</div>
        <h3>No products found</h3>
        <p>
          {searchQuery
            ? `No products matched your search "${searchQuery}".`
            : 'No products are currently available in this category.'}
        </p>
        {searchQuery && (
          <button className="btn-secondary" onClick={onClearSearch}>
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
