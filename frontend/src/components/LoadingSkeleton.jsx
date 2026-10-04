import React from 'react';

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="product-grid skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card">
          <div className="skeleton-image shimmer"></div>
          <div className="skeleton-body">
            <div className="skeleton-line shimmer short"></div>
            <div className="skeleton-line shimmer medium"></div>
            <div className="skeleton-line shimmer long"></div>
            <div className="skeleton-footer">
              <div className="skeleton-line shimmer price"></div>
              <div className="skeleton-btn shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
