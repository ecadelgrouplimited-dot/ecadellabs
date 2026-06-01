#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# ECADEL LABS — Local build + push to VPS
# Builds on your fast local machine, ships compiled output to VPS.
# VPS never runs npm build — build time drops from 10+ min to ~30 sec.
#
# Usage:  ./deploy-local.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

VPS_HOST="root@72.62.185.212"
VPS_DIR="/var/www/ecadellabs"
PROCESS="ecadellabs"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ECADEL LABS — Local Build → VPS Deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Build locally ──────────────────────────────────
echo "› Building locally (fast)..."
npm run build

# Stage static assets into standalone bundle (required)
cp -r public .next/standalone/public 2>/dev/null || true
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true

echo "✓ Local build complete"

# ── 2. Push code + built artifacts ────────────────────
echo "› Pushing to VPS..."

# Push the git commit first (so VPS has latest code)
git push origin main 2>/dev/null || true

# Stop the app on VPS to allow file replacement
ssh "$VPS_HOST" "pm2 stop $PROCESS 2>/dev/null || true"

# Rsync the standalone build — this replaces the VPS build
rsync -az --delete \
  --exclude="prisma/ecadellabs.db" \
  --exclude="prisma/*.db-journal" \
  --exclude="prisma/*.db-wal" \
  --exclude=".env.local" \
  --exclude="node_modules/.cache" \
  .next/standalone/ "$VPS_HOST:$VPS_DIR/.next/standalone/"

# Rsync static files separately (needed by standalone)
rsync -az .next/static/ "$VPS_HOST:$VPS_DIR/.next/static/"

# Rsync public folder
rsync -az --delete public/ "$VPS_HOST:$VPS_DIR/public/"

# Push Prisma schema (in case of schema changes — don't overwrite DB)
rsync -az prisma/schema.prisma "$VPS_HOST:$VPS_DIR/prisma/schema.prisma"

echo "✓ Files synced to VPS"

# ── 3. Run DB migration + restart on VPS ──────────────
echo "› Finalising on VPS..."
ssh "$VPS_HOST" "
  cd $VPS_DIR
  npx prisma generate
  npx prisma db push --accept-data-loss
  PORT=3001 pm2 restart $PROCESS 2>/dev/null || \
    PORT=3001 pm2 start .next/standalone/server.js --name $PROCESS --env production
  pm2 save
"

echo ""
echo "✓ Deployed — ecadellabs.cloud is live"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
