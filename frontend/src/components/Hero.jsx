import React from 'react';

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-pill">
          <span className="pill-dot"></span>
          <span>Simulated Production Storefront</span>
          <span className="pill-badge">v1.0</span>
        </div>

        <h1 className="hero-title">
          Everything You Need <br />
          <span className="hero-gradient-text">In One Place</span>
        </h1>

        <p className="hero-subtitle">
          Quality hardware and accessories for engineering teams. Every interaction sends
          real HTTP telemetry into our live Prometheus & Grafana monitoring stack.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={onExploreClick}>
            Explore Products ↓
          </button>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            📊 View in Grafana
          </a>
        </div>

        {/* Feature Highlights */}
        <div className="hero-features">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <div>
              <strong>Live Telemetry</strong>
              <p>Monitored via Prometheus</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <div>
              <strong>99.9% Monitored SLA</strong>
              <p>Automated Health Scoring</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔔</span>
            <div>
              <strong>Instant Incident Alerts</strong>
              <p>Grafana Alert Engine</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
