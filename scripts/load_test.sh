#!/bin/bash
# ==============================================================================
# load_test.sh — GrafanaOps Normal Traffic Load Simulator
# ==============================================================================
# Sends concurrent requests to the /products endpoint to simulate real user traffic.
# Visual Result in Grafana:
#   - Request Rate increases
#   - Active requests rise
#   - Error rate stays at 0%
#   - Health score stays HIGH (HEALTHY)
# ==============================================================================

TARGET_URL="${1:-http://localhost:8000/products}"
CONCURRENCY="${2:-5}"
TOTAL_REQUESTS="${3:-150}"

echo "=========================================================="
echo " Starting Load Test Simulation"
echo " Target URL:       ${TARGET_URL}"
echo " Concurrency:      ${CONCURRENCY}"
echo " Total Requests:   ${TOTAL_REQUESTS}"
echo "=========================================================="

start_time=$(date +%s)
completed=0
success_count=0

send_request() {
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL")
  if [ "$status" -eq 200 ]; then
    return 0
  else
    return 1
  fi
}

# Run requests in parallel batches matching concurrency
for ((i=1; i<=TOTAL_REQUESTS; i++)); do
  send_request &
  # Throttle background processes to CONCURRENCY
  if (( i % CONCURRENCY == 0 )); then
    wait
    echo -ne " -> Processed ${i}/${TOTAL_REQUESTS} requests...\r"
  fi
done

wait
end_time=$(date +%s)
duration=$((end_time - start_time))
if [ "$duration" -eq 0 ]; then duration=1; fi
rps=$((TOTAL_REQUESTS / duration))

echo ""
echo "=========================================================="
echo " Load Test Completed in ${duration}s (~${rps} req/sec)"
echo " Check Grafana at http://localhost:3000"
echo " Dashboard: GrafanaOps — Application Health"
echo "=========================================================="
