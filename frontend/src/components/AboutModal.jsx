import React from 'react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="about-modal" onClick={(e) => e.stopPropagation()}>
        <div className="about-header">
          <div className="about-title-row">
            <span className="about-icon">📐</span>
            <h2>About GrafanaShop & GrafanaOps</h2>
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="about-body">
          <p>
            <strong>GrafanaShop</strong> is the storefront tier of the <strong>GrafanaOps</strong> DevOps observability project.
            It provides a realistic customer-facing web application that drives genuine HTTP traffic, latency, and error profiles through the backend telemetry pipeline.
          </p>

          <div className="arch-flow">
            <div className="flow-step">
              <span className="step-tag">Frontend</span>
              <strong>GrafanaShop (React)</strong>
              <small>:5173</small>
            </div>
            <div className="flow-arrow">➔</div>
            <div className="flow-step">
              <span className="step-tag">Backend</span>
              <strong>FastAPI Service</strong>
              <small>:8000</small>
            </div>
            <div className="flow-arrow">➔</div>
            <div className="flow-step">
              <span className="step-tag">Scraper</span>
              <strong>Prometheus TSDB</strong>
              <small>:9090</small>
            </div>
            <div className="flow-arrow">➔</div>
            <div className="flow-step highlight">
              <span className="step-tag">Observability</span>
              <strong>Grafana Dashboards</strong>
              <small>:3000</small>
            </div>
          </div>

          <div className="about-metrics-list">
            <h4>Live Monitored Metrics:</h4>
            <ul>
              <li><code>http_requests_total</code> — Tracks requests by route, method & status</li>
              <li><code>http_request_duration_seconds</code> — Sub-second latency histogram</li>
              <li><code>http_active_requests</code> — Real-time in-flight request gauge</li>
              <li><code>app_health_score</code> — Dynamic 0–100 health index</li>
              <li><code>app_incident_status</code> — Deterministic incident correlation</li>
            </ul>
          </div>

          <div className="about-links">
            <a
              href="http://localhost:3000/d/grafanaops-app-health"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Open Application Health Dashboard
            </a>
            <a
              href="http://localhost:3000/d/grafanaops-incident-overview"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Open Incident Overview
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
