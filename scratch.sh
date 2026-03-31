#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# prod_secrets.sh — Add Mark Tool env vars to studio-chat in the prod namespace
#
# Prerequisites:
#   - kubectl --context cen configured with prod namespace access
#   - GEMINI_API_KEY for prod must be provided as first argument
#
# Usage:
#   ./prod_secrets.sh <PROD_GEMINI_API_KEY>
#
# What this does:
#   1. Adds 3 secrets to studio-chat-secrets (SAM2 token, Gemini key, Azure SAS)
#   2. Adds 5 env vars to the studio-chat deployment
#      - 3 from secrets (SAM2_API_BEARER_TOKEN, GEMINI_API_KEY, AZURE_STORAGE_SAS_TOKEN)
#      - 2 hardcoded (AZURE_STORAGE_CONNECTION_STRING, CDN_BASE_URL)
#   3. This will trigger a rolling restart of the studio-chat pods
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

NAMESPACE="prod"
SECRET_NAME="studio-chat-secrets"
DEPLOYMENT="studio-chat"

# ── Validate args ────────────────────────────────────────────────────────────

if [ $# -lt 1 ]; then
    echo "Usage: $0 <PROD_GEMINI_API_KEY>"
    echo ""
    echo "Example: $0 AIzaSy..."
    exit 1
fi

PROD_GEMINI_API_KEY="$1"

# ── Values ───────────────────────────────────────────────────────────────────

# SAM2 bearer token — same across dev and prod (single Cloud Run service)
SAM2_API_BEARER_TOKEN="SsxT95u774DNcTiBK0hVzAfLodEpeHIQXmB534B3"

# Azure prod storage — dashprodstore (content.dashtoon.ai CDN)
AZURE_STORAGE_CONNECTION_STRING="https://dashprodstore.blob.core.windows.net/"
AZURE_STORAGE_SAS_TOKEN="sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2030-06-30T21:36:20Z&st=2024-06-30T13:36:20Z&spr=https,http&sig=ewQCKuZEeC7A6vnlFxSDxDwVU7zunyCwB4tfE6880HA%3D"
CDN_BASE_URL="https://content.dashtoon.ai"

# ── Step 1: Add secrets ──────────────────────────────────────────────────────

echo "Adding secrets to ${SECRET_NAME} in namespace ${NAMESPACE}..."

SAM2_B64=$(echo -n "$SAM2_API_BEARER_TOKEN" | base64 -w0)
GEMINI_B64=$(echo -n "$PROD_GEMINI_API_KEY" | base64 -w0)
SAS_B64=$(echo -n "$AZURE_STORAGE_SAS_TOKEN" | base64 -w0)

kubectl --context cen patch secret "$SECRET_NAME" -n "$NAMESPACE" --type merge \
    -p "{\"data\":{\"SAM2_API_BEARER_TOKEN\":\"$SAM2_B64\",\"GEMINI_API_KEY\":\"$GEMINI_B64\",\"AZURE_STORAGE_SAS_TOKEN\":\"$SAS_B64\"}}"

echo "✓ Secrets added"

# ── Step 2: Add env vars to deployment ───────────────────────────────────────

echo "Patching deployment ${DEPLOYMENT} in namespace ${NAMESPACE}..."

kubectl --context cen patch deployment "$DEPLOYMENT" -n "$NAMESPACE" --type=json -p="[
  {\"op\":\"add\",\"path\":\"/spec/template/spec/containers/0/env/-\",\"value\":{\"name\":\"SAM2_API_BEARER_TOKEN\",\"valueFrom\":{\"secretKeyRef\":{\"name\":\"$SECRET_NAME\",\"key\":\"SAM2_API_BEARER_TOKEN\"}}}},
  {\"op\":\"add\",\"path\":\"/spec/template/spec/containers/0/env/-\",\"value\":{\"name\":\"GEMINI_API_KEY\",\"valueFrom\":{\"secretKeyRef\":{\"name\":\"$SECRET_NAME\",\"key\":\"GEMINI_API_KEY\"}}}},
  {\"op\":\"add\",\"path\":\"/spec/template/spec/containers/0/env/-\",\"value\":{\"name\":\"AZURE_STORAGE_SAS_TOKEN\",\"valueFrom\":{\"secretKeyRef\":{\"name\":\"$SECRET_NAME\",\"key\":\"AZURE_STORAGE_SAS_TOKEN\"}}}},
  {\"op\":\"add\",\"path\":\"/spec/template/spec/containers/0/env/-\",\"value\":{\"name\":\"AZURE_STORAGE_CONNECTION_STRING\",\"value\":\"$AZURE_STORAGE_CONNECTION_STRING\"}},
  {\"op\":\"add\",\"path\":\"/spec/template/spec/containers/0/env/-\",\"value\":{\"name\":\"CDN_BASE_URL\",\"value\":\"$CDN_BASE_URL\"}}
]"

echo "✓ Deployment patched"

# ── Step 3: Verify ───────────────────────────────────────────────────────────

echo ""
echo "Verifying env vars on ${DEPLOYMENT}..."
kubectl --context cen get deployment "$DEPLOYMENT" -n "$NAMESPACE" \
    -o jsonpath='{range .spec.template.spec.containers[0].env[*]}{.name}{"\n"}{end}' \
    | grep -E "SAM2|GEMINI|AZURE|CDN" \
    | while read -r name; do echo "  ✓ $name"; done

echo ""
echo "Done. Rolling restart in progress — monitor with:"
echo "  kubectl --context cen rollout status deployment/$DEPLOYMENT -n $NAMESPACE"