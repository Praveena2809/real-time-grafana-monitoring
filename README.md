# GrafanaOps — Real-Time DevOps Incident Monitoring & Alerting

A production-grade local DevOps monitoring, observability, and incident-management system centered around **Grafana**, powered by **Prometheus** metrics collection, and instrumenting a simulated e-commerce **FastAPI** web service.

---

## 1. Project Overview

GrafanaOps provides end-to-end visibility into application health, performance degradation, and live incidents. The system simulates real-world production conditions—including traffic spikes, HTTP 500 error cascades, and backend latency bottlenecks—visualizes telemetry in real-time, calculates a deterministic Application Health Score, and triggers native Grafana alerts that automatically transition between **NORMAL**, **FIRING**, and **RESOLVED** states.

### Key Capabilities:
- **Real-Time Telemetry Collection**: Captures HTTP throughput, latency histograms, error rates, and container resource utilization.
- **Rule-Based Health Scoring**: Calculates an application health index (0–100) dynamically based on error rate, latency, and hardware constraints.
- **Deterministic Incident Correlation**: Classifies active issues (e.g., `TRAFFIC SURGE DETECTED`, `APPLICATION ERROR DETECTED`, `HIGH LATENCY DETECTED`) without black-box AI.
- **Native Grafana Alerting**: Zero external notification dependencies; Grafana evaluates and displays alert life cycles directly within dashboards.
- **Automated Provisioning**: Datasources, dashboards, and alert rules load automatically upon boot via Docker Compose.

---

## 2. Architecture

```text
       FastAPI Application (:8000)
                   │
                   ▼
     Prometheus Telemetry Metrics (/metrics)
                   │  (scraped every 2s)
                   ▼
         Prometheus TSDB (:9090)
                   │  (queried via PromQL)
                   ▼
           GRAFANA (:3000)
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
Application    Incident         Native
Health Dash    Overview      Alert Engine
```

1. **FastAPI Application (`app:8000`)**: Processes e-commerce traffic, exposes REST endpoints (`/`, `/health`, `/products`, `/error`, `/slow`, `/cpu-stress`), and generates custom Prometheus telemetry at `/metrics`.
2. **Prometheus (`prometheus:9090`)**: Scrapes the FastAPI application every 2 seconds, stores metrics in a time-series database (TSDB), and evaluates scrape health (`up == 1`).
3. **Grafana (`grafana:3000`)**: Queries Prometheus via PromQL to power interactive operational dashboards, track health scoring, correlate incidents, and evaluate alert rules.

---

## 3. Technology Stack

| Technology | Role in GrafanaOps |
| :--- | :--- |
| **Python 3 / FastAPI** | Simulated microservice application handling user and synthetic traffic |
| **prometheus-client** | Python instrumentation library exporting telemetry to `/metrics` |
| **psutil** | Process and system hardware telemetry library (CPU & Memory) |
| **Prometheus** | Metrics aggregation, scraping engine, and time-series database |
| **Grafana** | Central observability dashboard, incident correlation, and alerting engine |
| **Docker & Docker Compose** | Multi-container orchestration, networking, and volume persistence |

---

## 4. Project Structure

```text
grafanaops/
├── app/
│   ├── main.py              # FastAPI service, middleware & telemetry definitions
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Minimal Python 3.11 container image
├── prometheus/
│   └── prometheus.yml       # Scrape configuration (targets app:8000 every 2s)
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── datasource.yml    # Auto-registers Prometheus datasource
│   │   ├── dashboards/
│   │   │   └── dashboard.yml     # Auto-loads dashboards on container start
│   │   └── alerting/
│   │       └── alert_rules.yaml  # Provisions unified Grafana alert rules
│   └── dashboards/
│       ├── application-health.json   # Primary operational monitoring dashboard
│       └── incident-overview.json    # Diagnostic and incident correlation dashboard
├── scripts/
│   ├── load_test.sh         # Simulates normal traffic load against /products
│   ├── generate_errors.sh   # Simulates application failure against /error (triggers alert)
│   ├── generate_latency.sh  # Simulates backend delay against /slow (triggers alert)
│   └── generate_cpu_load.sh # Simulates heavy CPU load against /cpu-stress
├── docker-compose.yml       # Container composition, networks, and volumes
├── .gitignore               # Git hygiene rules
└── README.md                # Comprehensive project documentation
```

---

## 5. Prerequisites

Before running the project, ensure you have installed:
- **Docker**: Version 24.0+ or Docker Desktop
- **Docker Compose**: Version 2.20+
- **curl**: For executing incident simulation scripts
- **bash**: macOS or Linux terminal environment

---

## 6. Running the Project

Start the entire stack with a single command:

```bash
docker compose up --build -d
```

To view real-time logs from all services:

```bash
docker compose logs -f
```

To stop all services:

```bash
docker compose down
```

---

## 7. Accessing Services

Once started, all services are accessible via localhost:

| Service | URL | Credentials |
| :--- | :--- | :--- |
| **FastAPI Application** | [http://localhost:8000](http://localhost:8000) | None |
| **FastAPI Swagger Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | None |
| **Prometheus Metrics** | [http://localhost:8000/metrics](http://localhost:8000/metrics) | None |
| **Prometheus Web UI** | [http://localhost:9090](http://localhost:9090) | None |
| **Grafana UI** | [http://localhost:3000](http://localhost:3000) | `admin` / `admin` |

---

## 8. Telemetry Metrics

GrafanaOps exposes real, dynamic Prometheus metrics from the FastAPI middleware:

| Metric Name | Type | Labels | Description |
| :--- | :--- | :--- | :--- |
| `http_requests_total` | Counter | `method`, `endpoint`, `status` | Cumulative count of HTTP requests handled. |
| `http_request_duration_seconds` | Histogram | `method`, `endpoint` | Request latency distribution in seconds across buckets `[0.01s - 10.0s]`. |
| `http_active_requests` | Gauge | `method`, `endpoint` | Current count of in-flight, concurrent HTTP requests. |
| `app_cpu_usage_percent` | Gauge | None | System and application CPU utilization (0.0% – 100.0%). |
| `app_memory_usage_bytes` | Gauge | None | Resident Set Size (RSS) memory consumption in bytes. |
| `app_memory_usage_percent` | Gauge | None | Total host memory usage percentage. |
| `app_up` | Gauge | None | Application process availability heartbeat (1 = UP, 0 = DOWN). |
| `app_health_score` | Gauge | None | Rule-based application health index (0.0 – 100.0). |
| `app_incident_status` | Gauge | None | Correlated incident status code (0=Normal, 1=Surge, 2=Error, 3=Latency, 4=CPU). |

---

## 9. Application Health Score Formula

The **Application Health Score** is a deterministic, rule-based index from **0 to 100** computed in real time using a 30-second sliding transaction window:

$$\text{Health Score} = 100 - (\text{Error Penalty} + \text{Latency Penalty} + \text{CPU Penalty} + \text{Memory Penalty})$$

### Deductions:
1. **HTTP Error Rate Penalty** ($\le 60\text{ pts}$):
   $$\text{Error Penalty} = \min\left(\frac{\text{5xx Requests}}{\text{Total Requests}} \times 80, 60\right)$$
2. **Latency Penalty** ($\le 25\text{ pts}$):
   $$\text{Latency Penalty} = \min\left(\max(0, \text{Avg Latency} - 0.3s) \times 15, 25\right)$$
3. **CPU Load Penalty** ($\le 15\text{ pts}$):
   $$\text{CPU Penalty} = \min\left(\max(0, \text{CPU \%} - 70\%) \times 0.5, 15\right)$$
4. **Memory Pressure Penalty** ($\le 10\text{ pts}$):
   $$\text{Memory Penalty} = \min\left(\max(0, \text{Memory \%} - 80\%) \times 0.5, 10\right)$$

### Score Thresholds:
- **80 – 100**: `HEALTHY` (Green)
- **50 – 79**: `DEGRADED` (Yellow/Orange)
- **0 – 49**: `CRITICAL` (Red)

---

## 10. Grafana Dashboards

Both dashboards are automatically provisioned and accessible under the `GrafanaOps` folder:

### 1. `GrafanaOps — Application Health` (`/d/grafanaops-app-health`)
The primary executive and operational health screen:
- **Health Score Banner**: Real-time 0–100 score with visual thresholds.
- **Application Status**: Immediate indicator (`UP` or `DOWN`).
- **Active In-Flight Requests**: Gauge of concurrent client sessions.
- **Request Rate (Throughput)**: Time series graph of requests per second.
- **Error Rate (% 5xx)**: Time series highlighting 5xx responses with 5% threshold line.
- **Response Latency**: Visualizes average latency and p95 percentile.
- **System Resources**: Real-time CPU and Memory utilization graphs.
- **Active Alerts List**: Direct view of Grafana alerting states.

### 2. `GrafanaOps — Incident Overview` (`/d/grafanaops-incident-overview`)
The diagnostics and root-cause analysis screen:
- **Deterministic Incident Correlation Banner**: Dynamic indicator displaying:
  - `SYSTEM NORMAL` (Green)
  - `TRAFFIC SURGE DETECTED` (Orange)
  - `APPLICATION ERROR DETECTED` (Red)
  - `HIGH LATENCY DETECTED` (Orange/Purple)
  - `HIGH CPU DETECTED` (Red)
- **Side-by-side Telemetry Breakdown**: Correlate throughput spikes with latency and error spikes.
- **Resource Gauges**: Hardware utilization meters.
- **Alert State Monitor**: Tracks which specific alert conditions are triggering.

---

## 11. Grafana Alerting

Three production alerts are provisioned in Grafana's Unified Alerting engine:

| Alert Name | Condition (PromQL) | Threshold | Duration (`for`) | Severity |
| :--- | :--- | :--- | :--- | :--- |
| **High HTTP Error Rate** | `(sum(rate(http_requests_total{status=~"5.."}[30s])) / sum(rate(http_requests_total[30s]))) * 100` | `> 5%` | 5s | Critical |
| **High Response Latency** | `sum(rate(http_request_duration_seconds_sum[30s])) / sum(rate(http_request_duration_seconds_count[30s]))` | `> 1.0s` | 5s | Warning |
| **High CPU Usage** | `app_cpu_usage_percent` | `> 75%` | 5s | Warning |

Alerts visibly transition through states in Grafana UI at [http://localhost:3000/alerting/list](http://localhost:3000/alerting/list):
$$\text{NORMAL} \xrightarrow{\text{condition met for 5s}} \text{FIRING} \xrightarrow{\text{simulation stopped}} \text{RESOLVED}$$

---

## 12. Incident Simulation & Recovery

Executable test scripts are provided in `scripts/`. Make them executable first:

```bash
chmod +x scripts/*.sh
```

### Scenario A: Normal Traffic Load
Simulates healthy user browsing:

```bash
./scripts/load_test.sh
```
- **Observed Behavior**: Request rate increases to ~50-100 req/s. Health score remains `HEALTHY` (95-100). No alerts fire.

### Scenario B: Application Failure (HTTP 500 Spike)
Simulates a database failure or unhandled exception:

```bash
./scripts/generate_errors.sh
```
- **Observed Behavior**:
  1. Error rate spikes to 100%.
  2. Health score drops to `< 45` (`CRITICAL`).
  3. Incident banner changes to `APPLICATION ERROR DETECTED`.
  4. Alert **High HTTP Error Rate** changes to `FIRING`.
- **Recovery**: When the script ends, the 30s sliding window clears. Error rate returns to 0%, health score rises to 100, and alert transitions to `RESOLVED`.

### Scenario C: Backend Bottleneck (High Latency)
Simulates slow external dependencies or connection timeouts:

```bash
./scripts/generate_latency.sh
```
- **Observed Behavior**:
  1. Average latency spikes to `> 2.0s`.
  2. In-flight active requests climb.
  3. Health score drops to `DEGRADED`.
  4. Incident banner switches to `HIGH LATENCY DETECTED`.
  5. Alert **High Response Latency** transitions to `FIRING`.
- **Recovery**: Latency immediately drops to sub-10ms when traffic ceases; alert transitions to `RESOLVED`.

### Scenario D: High CPU Stress
Simulates compute-heavy tasks:

```bash
./scripts/generate_cpu_load.sh
```
- **Observed Behavior**: CPU utilization spikes `> 80%`. Alert **High CPU Usage** fires. Returns to normal once compute finishes.

---

## 13. Troubleshooting

### 1. Prometheus Target shows `DOWN`
- Check if the application container is healthy: `docker ps`
- Test connectivity from the Prometheus container:
  ```bash
  docker compose exec prometheus wget -qO- http://app:8000/health
  ```
- Ensure port 8000 is not blocked or conflicting with another process.

### 2. Grafana cannot connect to Prometheus
- Verify the datasource URL in Grafana is `http://prometheus:9090` (using Docker internal DNS, **not** `localhost`).
- Test connectivity from Grafana container:
  ```bash
  docker compose exec grafana nc -zv prometheus 9090
  ```

### 3. Dashboard shows "No Data"
- Generate some initial requests: `curl http://localhost:8000/products`
- Verify the time range in the top right of Grafana is set to `Last 5 minutes` with auto-refresh set to `2s`.

### 4. Alerts do not fire
- Ensure the simulation script ran for at least 5–10 seconds (alerts have a short evaluation period of 5s).
- Inspect the alert rule state directly at [http://localhost:3000/alerting/list](http://localhost:3000/alerting/list).
