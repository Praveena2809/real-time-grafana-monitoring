#!/bin/bash
# ==============================================================================
# generate_cpu_load.sh — GrafanaOps High CPU Incident Simulator
# ==============================================================================
# Sends concurrent requests to /cpu-stress to consume CPU and trigger High CPU Alert.
# Visual Result in Grafana:
#   - CPU Utilization spikes (> 75%)
#   - Application Health Score degrades
#   - Incident Banner switches to: "HIGH CPU DETECTED"
#   - Grafana Alert "High CPU Usage" transitions: NORMAL -> FIRING
# When stopped, natural recovery occurs:
#   - CPU drops back to normal (< 10%)
#   - Health Score recovers to HEALTHY
#   - Alert transitions: FIRING -> RESOLVED
# ==============================================================================

TARGET_URL="${1:-http://localhost:8000/cpu-stress?duration=3}"
CONCURRENCY="${2:-4}"
ROUNDS="${3:-5}"

echo "=========================================================="
echo " Simulating High CPU Load Incident"
echo " Target Endpoint:  ${TARGET_URL}"
echo " Concurrency:      ${CONCURRENCY} workers"
echo " Rounds:           ${ROUNDS}"
echo "=========================================================="

for ((r=1; r<=ROUNDS; r++)); do
  echo "-> Firing CPU load round $r of $ROUNDS..."
  for ((c=1; c<=CONCURRENCY; c++)); do
    curl -s "$TARGET_URL" > /dev/null &
  done
  wait
done

echo "=========================================================="
echo " CPU Stress simulation finished."
echo " Check Grafana at http://localhost:3000"
echo " Dashboard: http://localhost:3000/d/grafanaops-incident-overview"
echo "=========================================================="
