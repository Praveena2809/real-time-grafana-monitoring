import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state-card">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Unable to load products</h3>
      <p className="error-desc">
        The store is temporarily unavailable. The backend service may be undergoing maintenance or recovering from an incident.
      </p>
      {message && <div className="error-details">Technical details: {message}</div>}
      <div className="error-actions">
        <button className="btn-primary" onClick={onRetry}>
          🔄 Try Again
        </button>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          📈 Check System Health in Grafana
        </a>
      </div>
    </div>
  );
}
