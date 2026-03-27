#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

MODEL="minimax/minimax-m2.5"

MAX_ROUNDS=3
ROUND=1

run_agent() {
  local label="$1"
  local prompt="$2"
  local logfile="$3"
  echo "$label"
  pi -p "$prompt" --provider openrouter --model "$MODEL" 2>&1 | tee "$logfile"
}

verify() {
  local logfile="$1"
  run_agent "🔍 Verifier..." "$(cat .pi/agents/verifier.md)" "$logfile"
}

echo "=== GILDED ROSE ADVERSARIAL KATA ==="
echo "Model: $MODEL"
echo ""

while [ $ROUND -le $MAX_ROUNDS ]; do
  echo "══════ ROUND $ROUND/$MAX_ROUNDS ══════"

  # --- Test Writer ---
  TW_PROMPT=$(cat .pi/agents/test-writer.md)
  if [ $ROUND -gt 1 ]; then
    TW_PROMPT="$TW_PROMPT

Round $ROUND: tests already exist. Read current tests first.
Only add tests for coverage gaps. Do not rewrite existing tests."
  fi
  run_agent "🧪 Test Writer..." "$TW_PROMPT" "/tmp/kata-r${ROUND}-tests.log"

  # --- Verify after test writing ---
  verify "/tmp/kata-r${ROUND}-verify-tests.log"

  # --- Implementer gets structured failure summary ---
  VERIFY_OUTPUT=$(cat "/tmp/kata-r${ROUND}-verify-tests.log" | tail -30)

  IMPL_PROMPT="$(cat .pi/agents/implementer.md)

Current test results from verifier:
\`\`\`
$VERIFY_OUTPUT
\`\`\`"
  run_agent "🔧 Implementer..." "$IMPL_PROMPT" "/tmp/kata-r${ROUND}-impl.log"

  # --- Verify after implementation ---
  verify "/tmp/kata-r${ROUND}-verify-impl.log"

  # --- Check if we're green ---
  RESULT=$(npm test 2>&1)
  if echo "$RESULT" | grep -q "Tests:.*passed" && ! echo "$RESULT" | grep -q "failed"; then
    echo "✅ All tests passing after round $ROUND"
    break
  else
    echo "$RESULT" | tail -5
    echo "❌ Still failing, continuing..."
  fi


  echo ""
  ROUND=$((ROUND + 1))
done

# --- Reviewer ---
echo ""
run_agent "📋 Reviewer..." "$(cat .pi/agents/reviewer.md)" "/tmp/kata-review.log"

echo ""
echo "=== DONE. Logs in /tmp/kata-*.log ==="