import asyncio
import collections
import math
import os
import time
from typing import Deque, Tuple

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse
import psutil
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
    Histogram,
    generate_latest,
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="GrafanaOps E-Commerce API",
    description="Simulated production e-commerce service with real-time Prometheus telemetry",
    version="1.0.0",
)

# Enable CORS for local frontend development and container access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# PROMETHEUS METRICS DEFINITIONS
# ---------------------------------------------------------
REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total number of HTTP requests processed",
    ["method", "endpoint", "status"],
)

REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint"],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0],
)

ACTIVE_REQUESTS = Gauge(
    "http_active_requests",
    "Number of active HTTP requests currently being processed",
    ["method", "endpoint"],
)

CPU_USAGE = Gauge(
    "app_cpu_usage_percent",
    "Application and system CPU usage percentage",
)

MEMORY_USAGE_BYTES = Gauge(
    "app_memory_usage_bytes",
    "Resident Set Size memory consumed by the process in bytes",
)

MEMORY_USAGE_PERCENT = Gauge(
    "app_memory_usage_percent",
    "System memory utilization percentage",
)

APP_AVAILABILITY = Gauge(
    "app_up",
    "Application availability heartbeat (1 = UP, 0 = DOWN)",
)

HEALTH_SCORE = Gauge(
    "app_health_score",
    "Computed rule-based health score (0 = Critical to 100 = Healthy)",
)

INCIDENT_STATUS = Gauge(
    "app_incident_status",
    "Incident correlation state (0=NORMAL, 1=TRAFFIC_SURGE, 2=APPLICATION_ERROR, 3=HIGH_LATENCY, 4=HIGH_CPU)",
)

# Pre-set availability heartbeat
APP_AVAILABILITY.set(1.0)

# Process handle for resource tracking
PROCESS = psutil.Process(os.getpid())

# Rolling window buffer for real-time health score calculation: (timestamp, status_code, duration)
# Keeps up to 500 recent transactions within the last 30-60 seconds.
RECENT_REQUESTS: Deque[Tuple[float, int, float]] = collections.deque(maxlen=1000)

# Initialize psutil CPU reading
psutil.cpu_percent(interval=None)


def calculate_health_and_incident(cpu_pct: float, mem_pct: float) -> Tuple[float, int]:
    """
    Computes a deterministic, rule-based health score (0-100) and
    incident status code based on actual metrics observed over a sliding window.
    """
    now = time.time()
    cutoff = now - 30.0  # 30-second sliding window

    # Filter out entries older than 30s
    recent = [req for req in RECENT_REQUESTS if req[0] >= cutoff]

    total_reqs = len(recent)
    error_count = sum(1 for req in recent if req[1] >= 500)
    error_rate = (error_count / total_reqs) if total_reqs > 0 else 0.0
    avg_latency = (sum(req[2] for req in recent) / total_reqs) if total_reqs > 0 else 0.0
    req_rate = total_reqs / 30.0

    # Base score
    score = 100.0

    # Penalties
    # 1. Error penalty: Up to 60 points deduction
    error_penalty = min(error_rate * 80.0, 60.0)

    # 2. Latency penalty: Up to 25 points deduction for avg latency above 0.3s
    latency_penalty = min(max(0.0, avg_latency - 0.3) * 15.0, 25.0)

    # 3. CPU penalty: Up to 15 points deduction if CPU > 70%
    cpu_penalty = min(max(0.0, cpu_pct - 70.0) * 0.5, 15.0)

    # 4. Memory penalty: Up to 10 points deduction if Memory > 80%
    mem_penalty = min(max(0.0, mem_pct - 80.0) * 0.5, 10.0)

    score = max(0.0, min(100.0, score - (error_penalty + latency_penalty + cpu_penalty + mem_penalty)))

    # Incident Correlation Logic
    incident_code = 0  # 0: NORMAL
    if error_rate >= 0.05 and total_reqs >= 5:
        # High error rate detected (>5%)
        incident_code = 2  # APPLICATION ERROR DETECTED
    elif (req_rate >= 8.0 or total_reqs >= 25) and (cpu_pct >= 35.0 or avg_latency >= 0.25) and error_rate < 0.05:
        # High request rate accompanied by load or latency
        incident_code = 1  # TRAFFIC SURGE DETECTED
    elif avg_latency >= 1.0 and error_rate < 0.05:
        # High response latency without heavy errors
        incident_code = 3  # HIGH LATENCY DETECTED
    elif cpu_pct >= 75.0 and error_rate < 0.05:
        # High CPU utilization
        incident_code = 4  # HIGH CPU DETECTED

    return round(score, 1), incident_code


def update_system_metrics():
    """Update CPU, memory, health score, and incident status metrics."""
    try:
        proc_cpu = PROCESS.cpu_percent(interval=None)
        sys_cpu = psutil.cpu_percent(interval=None)
        cpu_pct = min(100.0, max(proc_cpu, sys_cpu))
        mem_info = PROCESS.memory_info()
        mem_pct = psutil.virtual_memory().percent

        CPU_USAGE.set(cpu_pct)
        MEMORY_USAGE_BYTES.set(mem_info.rss)
        MEMORY_USAGE_PERCENT.set(mem_pct)
        APP_AVAILABILITY.set(1.0)

        health_score, incident_code = calculate_health_and_incident(cpu_pct, mem_pct)
        HEALTH_SCORE.set(health_score)
        INCIDENT_STATUS.set(incident_code)
    except Exception:
        pass


# ---------------------------------------------------------
# HTTP TELEMETRY MIDDLEWARE
# ---------------------------------------------------------
@app.middleware("http")
async def prometheus_telemetry_middleware(request: Request, call_next):
    # Normalize path to prevent label cardinality explosion
    path = request.url.path
    method = request.method

    # Determine route endpoint label
    # Group standard endpoints, default to root or path
    endpoint = path
    if path.startswith("/products"):
        endpoint = "/products"
    elif path.startswith("/error"):
        endpoint = "/error"
    elif path.startswith("/slow"):
        endpoint = "/slow"
    elif path.startswith("/cpu-stress"):
        endpoint = "/cpu-stress"
    elif path.startswith("/health"):
        endpoint = "/health"
    elif path == "/":
        endpoint = "/"
    elif path == "/metrics":
        endpoint = "/metrics"

    ACTIVE_REQUESTS.labels(method=method, endpoint=endpoint).inc()
    start_time = time.time()
    status_code = 500

    try:
        response = await call_next(request)
        status_code = response.status_code
        return response
    except Exception as exc:
        status_code = 500
        raise exc
    finally:
        duration = time.time() - start_time
        ACTIVE_REQUESTS.labels(method=method, endpoint=endpoint).dec()
        REQUEST_COUNT.labels(method=method, endpoint=endpoint, status=str(status_code)).inc()
        REQUEST_LATENCY.labels(method=method, endpoint=endpoint).observe(duration)

        # Do not include /metrics or OPTIONS preflight requests in rolling health score window
        if endpoint != "/metrics" and method != "OPTIONS":
            RECENT_REQUESTS.append((start_time, status_code, duration))

        update_system_metrics()


# ---------------------------------------------------------
# APPLICATION ENDPOINTS
# ---------------------------------------------------------
@app.get("/")
def read_root():
    """Simple application welcome response."""
    return {
        "service": "GrafanaOps E-Commerce API",
        "version": "1.0.0",
        "status": "running",
        "description": "Simulated production e-commerce API instrumented with Prometheus and Grafana",
    }


@app.get("/health")
def read_health():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/products")
def read_products():
    """Return a list of fake e-commerce catalog products."""
    products = [
        {
            "id": 101,
            "name": "DevOps Mechanical Keyboard",
            "category": "Hardware",
            "price": 149.99,
            "stock": 42,
            "rating": 4.9,
            "reviews": 128,
            "badge": "Best Seller",
            "description": "Tactile hot-swappable mechanical switches with RGB per-key backlighting and sound-dampening foam.",
        },
        {
            "id": 102,
            "name": "Ultra-Wide 34-Inch Curved Monitor",
            "category": "Displays",
            "price": 599.00,
            "stock": 18,
            "rating": 4.8,
            "reviews": 94,
            "badge": "Featured",
            "description": "144Hz WQHD 3440x1440 curved IPS panel with USB-C 90W power delivery and HDR400.",
        },
        {
            "id": 103,
            "name": "Active Noise-Cancelling Headphones",
            "category": "Audio",
            "price": 249.50,
            "stock": 65,
            "rating": 4.7,
            "reviews": 210,
            "badge": "Popular",
            "description": "Premium 40mm neodymium drivers with hybrid active noise cancellation and 40h battery life.",
        },
        {
            "id": 104,
            "name": "Ergonomic Lumbar Desk Chair",
            "category": "Furniture",
            "price": 389.00,
            "stock": 12,
            "rating": 4.6,
            "reviews": 56,
            "badge": None,
            "description": "Breathable mesh backrest with 4D adjustable armrests and dynamic lumbar spinal support.",
        },
        {
            "id": 105,
            "name": "Thunderbolt 4 Multi-Port Dock",
            "category": "Accessories",
            "price": 199.99,
            "stock": 80,
            "rating": 4.9,
            "reviews": 142,
            "badge": "Staff Pick",
            "description": "Single-cable docking station supporting dual 4K 60Hz displays, Gigabit Ethernet, and SD card.",
        },
        {
            "id": 106,
            "name": "High-Precision Wireless Mouse",
            "category": "Hardware",
            "price": 79.99,
            "stock": 110,
            "rating": 4.7,
            "reviews": 315,
            "badge": None,
            "description": "Ultra-lightweight 58g ergonomic chassis with 26K DPI optical sensor and dual wireless connectivity.",
        },
        {
            "id": 107,
            "name": "Studio Broadcast Microphone & Boom",
            "category": "Audio",
            "price": 129.00,
            "stock": 35,
            "rating": 4.8,
            "reviews": 88,
            "badge": "New",
            "description": "Cardioid condenser USB-C microphone with internal shockmount and heavy-duty steel boom arm.",
        },
        {
            "id": 108,
            "name": "Monitor ScreenBar Light with Sensor",
            "category": "Accessories",
            "price": 69.50,
            "stock": 52,
            "rating": 4.9,
            "reviews": 174,
            "badge": None,
            "description": "Asymmetric optical design zero-screen-glare monitor lamp with auto-dimming ambient light sensor.",
        },
    ]
    return {
        "count": len(products),
        "products": products,
    }


@app.get("/error")
def simulate_error():
    """
    Intentionally return HTTP 500.
    Simulates internal application failure / unhandled exception.
    """
    raise HTTPException(
        status_code=500,
        detail="Simulated internal server error in payment/inventory backend",
    )


@app.get("/slow")
async def simulate_slow(delay: float = 2.0):
    """
    Intentionally delay response by specified seconds before returning.
    Simulates high response latency / backend bottleneck.
    """
    # Restrict delay range between 0.5s and 10s
    actual_delay = max(0.5, min(delay, 10.0))
    await asyncio.sleep(actual_delay)
    return {
        "status": "success",
        "message": f"Response completed successfully after {actual_delay:.2f} seconds artificial delay",
        "delay_seconds": actual_delay,
    }


@app.get("/cpu-stress")
def simulate_cpu_stress(duration: float = 3.0):
    """
    Intentionally consumes CPU cycles for specified duration.
    Simulates high CPU load spike.
    """
    stress_duration = max(1.0, min(duration, 30.0))
    end_time = time.time() + stress_duration
    x = 0
    while time.time() < end_time:
        for _ in range(50000):
            x += 1
            _ = math.sqrt(x) * math.sin(x)
        # Periodically refresh metrics during load
        update_system_metrics()

    update_system_metrics()
    return {
        "status": "success",
        "message": f"CPU stressed for {stress_duration:.2f} seconds",
        "iterations": x,
    }


@app.get("/metrics")
def expose_metrics():
    """Expose real-time Prometheus telemetry metrics."""
    update_system_metrics()
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST,
    )
