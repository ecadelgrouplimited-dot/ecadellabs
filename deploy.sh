#!/bin/bash
set -e

PROJECT_DIR="/var/www/ecadellabs"
PROCESS_NAME="ecadellabs"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ECADEL LABS — Deploying latest from GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$PROJECT_DIR"

echo "› Pulling latest from main..."
git checkout -- package-lock.json 2>/dev/null || true
git pull origin main

echo "› Installing dependencies..."
npm install --production=false

echo "› Generating Prisma client..."
npx prisma generate

echo "› Running database migrations..."
npx prisma migrate deploy

echo "› Building Next.js app..."
npm run build

echo "› Restarting PM2 process..."
pm2 restart "$PROCESS_NAME" || pm2 start npm --name "$PROCESS_NAME" -- start -- --port 3001

pm2 save

echo ""
echo "✓ Deployment complete — ecadellabs.cloud is live"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
