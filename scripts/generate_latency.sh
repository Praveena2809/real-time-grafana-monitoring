#!/bin/bash
# ==============================================================================
# generate_latency.sh — GrafanaOps High Latency Incident Simulator
# ==============================================================================
# Sends requests to /slow with artificial delays to trigger High Latency Alert.
# Visual Result in Grafana:
#   - Response Latency graph spikes above 1.5s
#   - Active requests rise during the slow duration
#   - Health Score decreases to DEGRADED
#   - Incident Banner switches to: "HIGH LATENCY DETECTED"
#   - Grafana Alert "High Response Latency" transitions: NORMAL -> FIRING
# When stopped, natural recovery occurs:
#   - Latency returns to sub-second normal
#   - Health Score recovers to HEALTHY
#   - Alert transitions: FIRING -> RESOLVED
# ==============================================================================

TARGET_URL="${1:-http://localhost:8000/slow?delay=2}"
CONCURRENCY="${2:-4}"
TOTAL_REQUESTS="${3:-20}"

echo "=========================================================="
echo " Simulating High Response Latency Incident"
echo " Target Endpoint:  ${TARGET_URL}"
echo " Concurrency:      ${CONCURRENCY}"
echo " Total Requests:   ${TOTAL_REQUESTS}"
echo "=========================================================="

send_slow_request() {
  local req_num=$1
  start_ms=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1000000000))')
  status=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL")
  end_ms=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1000000000))')
  elapsed_s=$(awk "BEGIN {print ($end_ms - $start_ms)/1000000000}")
  echo "[-] Request #$req_num finished in ${elapsed_s}s (HTTP $status)"
}

for ((i=1; i<=TOTAL_REQUESTS; i++)); do
  send_slow_request "$i" &
  if (( i % CONCURRENCY == 0 )); then
    wait
  fi
done

wait

echo "=========================================================="
echo " Latency simulation finished."
echo " Check Grafana at http://localhost:3000"
echo " Dashboard: http://localhost:3000/d/grafanaops-incident-overview"
echo "=========================================================="
