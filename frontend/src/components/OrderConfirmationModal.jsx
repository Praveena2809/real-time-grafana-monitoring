import React from 'react';

export default function OrderConfirmationModal({ isOpen, onClose, orderDetails }) {
  if (!isOpen || !orderDetails) return null;

  const formatINR = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-badge">✓</div>
        <h2 className="modal-title">Order Placed Successfully!</h2>
        <div className="order-id-badge">Order ID: #{orderDetails.orderId}</div>

        <div className="simulation-notice">
          <strong>ℹ️ Simulated Order Notice:</strong>
          <p>
            This is a simulated order for demonstration purposes. No real payment, financial transaction, or physical shipment will occur.
          </p>
        </div>

        <div className="order-summary-box">
          <div className="summary-line">
            <span>Items Ordered:</span>
            <strong>{orderDetails.totalItems} items</strong>
          </div>
          <div className="summary-line">
            <span>Total Value:</span>
            <strong>{formatINR(orderDetails.totalINR)}</strong>
          </div>
          <div className="summary-line">
            <span>Telemetry Status:</span>
            <span className="telemetry-ok">✓ Recorded in Prometheus</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Continue Shopping
          </button>
          <a
            href="http://localhost:3000/d/grafanaops-app-health"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            📊 View Metrics in Grafana
          </a>
        </div>
      </div>
    </div>
  );
}
