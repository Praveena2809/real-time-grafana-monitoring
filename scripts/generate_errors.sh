#!/bin/bash
# ==============================================================================
# generate_errors.sh — GrafanaOps HTTP 500 Incident Simulator
# ==============================================================================
# Sends repeated failing requests to /error to trigger the High Error Rate Alert.
# Visual Result in Grafana:
#   - HTTP Error Rate spikes above 5% (to 100%)
#   - Application Health Score drops from 100 to DEGRADED (<50)
#   - Incident Banner switches to: "APPLICATION ERROR DETECTED"
#   - Grafana Alert "High HTTP Error Rate" transitions: NORMAL -> FIRING
# When stopped, natural recovery occurs:
#   - Error rate drops back to 0%
#   - Health Score recovers to HEALTHY
#   - Alert transitions: FIRING -> RESOLVED
# ==============================================================================

TARGET_URL="${1:-http://localhost:8000/error}"
TOTAL_REQUESTS="${2:-50}"
DELAY="${3:-0.2}"

echo "=========================================================="
echo " Simulating Application Failure Incident (HTTP 500)"
echo " Target Endpoint:  ${TARGET_URL}"
echo " Total Requests:   ${TOTAL_REQUESTS}"
echo " Delay per req:    ${DELAY}s"
echo " Press Ctrl+C at any time to halt and test recovery."
echo "=========================================================="

error_count=0

for ((i=1; i<=TOTAL_REQUESTS; i++)); do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL")
  if [ "$status" -eq 500 ]; then
    ((error_count++))
    echo "[!] Request #$i -> HTTP $status (Simulated Server Error)"
  else
    echo "[-] Request #$i -> HTTP $status"
  fi
  sleep "$DELAY"
done

echo "=========================================================="
echo " Error simulation batch finished: ${error_count}/${TOTAL_REQUESTS} failed."
echo " Open Grafana Alerts: http://localhost:3000/alerting/list"
echo " Check Dashboard: http://localhost:3000/d/grafanaops-incident-overview"
echo " Observe recovery over the next 30 seconds."
echo "=========================================================="
