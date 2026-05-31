#!/bin/bash

echo "=== SYSTEM ==="
sw_vers
echo

echo "=== MEMORY PRESSURE ==="
memory_pressure | head -20
echo

echo "=== TOP CPU PROCESSES ==="
ps aux | sort -nrk 3 | head -15
echo

echo "=== TOP MEMORY PROCESSES ==="
ps aux | sort -nrk 4 | head -15
echo

echo "=== ZED PROCESS ==="
pgrep -fl Zed || echo "Zed not running"
echo

echo "=== ZED CRASH REPORTS (last 10) ==="
ls -lt ~/Library/Logs/DiagnosticReports 2>/dev/null | grep Zed | head
echo

echo "=== RECENT ZED LOGS ==="
log show --last 30m --predicate 'process == "Zed"' --style compact 2>/dev/null | tail -50
echo

echo "=== PROJECT SIZE ==="
find . -type f 2>/dev/null | wc -l
du -sh .
echo

echo "=== LARGE DIRECTORIES ==="
du -sh ./* 2>/dev/null | sort -hr | head -20
echo

echo "=== NODE PROCESSES ==="
ps aux | grep -E 'node|vite|next|webpack' | grep -v grep
echo

echo "=== OPEN FILES (ZED) ==="
ZED_PID=$(pgrep -x Zed | head -1)
if [ -n "$ZED_PID" ]; then
  lsof -p "$ZED_PID" | wc -l
fi
