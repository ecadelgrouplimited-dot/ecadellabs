#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# WARNING: This script builds on the VPS — it may hang for 40+ minutes.
# Use deploy-local.sh from your LOCAL machine instead (builds in ~30 seconds).
# This file is kept as an emergency-only fallback.
# ─────────────────────────────────────────────────────────────────────────────
set -e

PROJECT_DIR="/var/www/ecadellabs"
PROCESS_NAME="ecadellabs"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ECADEL LABS — VPS Build (use deploy-local.sh)"
echo "  WARNING: This may take 10–40 min on VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$PROJECT_DIR"

# ── 1. Pull latest code ───────────────────────────────
echo "› Pulling latest from main..."
git checkout -- package-lock.json 2>/dev/null || true
git pull origin main

# ── 2. Install deps ───────────────────────────────────
echo "› Installing dependencies..."
npm install --production=false

# ── 3. Database ───────────────────────────────────────
echo "› Generating Prisma client..."
npx prisma generate

echo "› Syncing database schema..."
npx prisma db push --accept-data-loss

# ── 4. Free RAM before build ──────────────────────────
# Stopping the app frees ~150-200MB which the build needs
echo "› Stopping app to free memory for build..."
pm2 stop "$PROCESS_NAME" 2>/dev/null || true

# ── 5. Build with explicit memory ceiling ─────────────
echo "› Building Next.js app (this may take 2–5 minutes)..."
export NODE_OPTIONS="--max-old-space-size=1536"
npm run build
unset NODE_OPTIONS

# Copy public + static assets into standalone (required for standalone mode)
echo "› Copying static assets into standalone bundle..."
cp -r public .next/standalone/public 2>/dev/null || true
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true

# ── 6. Restart ────────────────────────────────────────
echo "› Starting PM2 process..."
# standalone output: run .next/standalone/server.js directly (much lower memory)
pm2 restart "$PROCESS_NAME" 2>/dev/null || \
  PORT=3001 pm2 start .next/standalone/server.js --name "$PROCESS_NAME" --env production

pm2 save

echo ""
echo "✓ Deployment complete — ecadellabs.cloud is live"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
