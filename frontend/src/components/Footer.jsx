import React from 'react';

export default function Footer({ onOpenAbout }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand-section">
          <div className="brand">
            <span className="brand-icon">🛒</span>
            <span className="brand-title">GrafanaShop</span>
          </div>
          <p className="footer-tagline">
            Simulated production e-commerce storefront instrumented with Prometheus & Grafana.
          </p>
          <div className="telemetry-badge">
            <span className="pulse-dot"></span>
            <span>Real-time Telemetry Enabled</span>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>DevOps Stack</h4>
          <ul>
            <li>
              <a href="http://localhost:8000" target="_blank" rel="noopener noreferrer">
                FastAPI Root (:8000)
              </a>
            </li>
            <li>
              <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
                API Swagger Docs
              </a>
            </li>
            <li>
              <a href="http://localhost:8000/metrics" target="_blank" rel="noopener noreferrer">
                Raw Metrics (/metrics)
              </a>
            </li>
            <li>
              <a href="http://localhost:9090" target="_blank" rel="noopener noreferrer">
                Prometheus UI (:9090)
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Grafana Dashboards</h4>
          <ul>
            <li>
              <a href="http://localhost:3000/d/grafanaops-app-health" target="_blank" rel="noopener noreferrer">
                Application Health Dashboard
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/d/grafanaops-incident-overview" target="_blank" rel="noopener noreferrer">
                Incident Overview Dashboard
              </a>
            </li>
            <li>
              <a href="http://localhost:3000/alerting/list" target="_blank" rel="noopener noreferrer">
                Grafana Alert Rules
              </a>
            </li>
            <li>
              <button className="text-link-btn" onClick={onOpenAbout}>
                System Architecture
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 GrafanaOps Project — Built for DevOps Mini Project Demonstration.</p>
        <p className="footer-disclaimer">All transactions are simulated. Powered by Prometheus & Grafana.</p>
      </div>
    </footer>
  );
}
