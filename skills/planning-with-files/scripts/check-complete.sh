#!/bin/bash
# check-complete.sh — planning-with-files session check
# Called by the Stop hook to report task_plan.md phase completion status.

PLAN_FILE="${1:-task_plan.md}"

if [ ! -f "$PLAN_FILE" ]; then
  echo "[planning-with-files] No task_plan.md found — no active planning session."
  exit 0
fi

TOTAL=$(grep -c "### Phase" "$PLAN_FILE" || true)
COMPLETE=$(grep -cF "**Status:** complete" "$PLAN_FILE" || true)
IN_PROGRESS=$(grep -cF "**Status:** in_progress" "$PLAN_FILE" || true)
PENDING=$(grep -cF "**Status:** pending" "$PLAN_FILE" || true)

# Fallback to bracket syntax
if [ "$COMPLETE" -eq 0 ] && [ "$IN_PROGRESS" -eq 0 ] && [ "$PENDING" -eq 0 ]; then
  COMPLETE=$(grep -c "\[complete\]" "$PLAN_FILE" || true)
  IN_PROGRESS=$(grep -c "\[in_progress\]" "$PLAN_FILE" || true)
  PENDING=$(grep -c "\[pending\]" "$PLAN_FILE" || true)
fi

: "${TOTAL:=0}"
: "${COMPLETE:=0}"
: "${IN_PROGRESS:=0}"
: "${PENDING:=0}"

if [ "$COMPLETE" -eq "$TOTAL" ] && [ "$TOTAL" -gt 0 ]; then
  echo "[planning-with-files] ALL PHASES COMPLETE ($COMPLETE/$TOTAL)"
else
  echo "[planning-with-files] Task in progress ($COMPLETE/$TOTAL phases complete)"
  [ "$IN_PROGRESS" -gt 0 ] && echo "[planning-with-files] $IN_PROGRESS phase(s) still in progress."
  [ "$PENDING" -gt 0 ] && echo "[planning-with-files] $PENDING phase(s) pending."
fi

exit 0
