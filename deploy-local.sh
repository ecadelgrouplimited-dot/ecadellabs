#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# ECADEL LABS — Local build + push to VPS
# Builds on your fast local machine (~30 sec), ships to VPS.
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
echo "› Building locally..."
npm run build
echo "✓ Build complete"

# ── 2. Push to GitHub ─────────────────────────────────
git push origin main 2>/dev/null || true

# ── 3. Stop app on VPS ────────────────────────────────
ssh "$VPS_HOST" "pm2 stop $PROCESS 2>/dev/null || true"

# ── 4. Rsync .next build ──────────────────────────────
# IMPORTANT: exclude *.node native binaries — they are platform-specific.
# The VPS has its own compiled binaries in node_modules/ which npm start uses.
echo "› Syncing build to VPS..."
rsync -az --delete \
  --exclude="prisma/ecadellabs.db" \
  --exclude="prisma/*.db-journal" \
  --exclude="prisma/*.db-wal" \
  --exclude=".env.local" \
  --exclude="**/*.node" \
  .next/ "$VPS_HOST:$VPS_DIR/.next/"

rsync -az --delete public/ "$VPS_HOST:$VPS_DIR/public/"
rsync -az prisma/schema.prisma "$VPS_HOST:$VPS_DIR/prisma/schema.prisma"
echo "✓ Files synced"

# ── 5. On VPS: DB sync + restart ──────────────────────
echo "› Finalising on VPS..."
ssh "$VPS_HOST" "
  set -e
  cd $VPS_DIR

  # Sync DB schema if changed
  npx prisma generate
  npx prisma db push --accept-data-loss

  # Start/restart using npm start
  # This uses the VPS's own node_modules/ (Linux-compiled binaries stay intact)
  pm2 restart $PROCESS 2>/dev/null || \
    PORT=3001 pm2 start npm --name $PROCESS -- start
  pm2 save

  sleep 5
  STATUS=\$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/)
  echo \"Site check: HTTP \$STATUS\"
"

echo ""
echo "✓ Deployed — ecadellabs.cloud is live"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
