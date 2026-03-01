#!/bin/bash
cd /data/data/com.termux/files/home/pwa-bbs/backend
export PYTHONPATH=.
echo "Starting backend on 8888..."
while true; do
  python -m uvicorn app.main:app --host 0.0.0.0 --port 8888
  echo "Backend crashed. Restarting in 1s..."
  sleep 1
done
