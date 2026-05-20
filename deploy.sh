#!/bin/bash
# Deploy script — run this on your VPS to pull latest and restart

set -e

APP_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Pulling latest code..."
git -C "$APP_DIR" pull origin main

echo "==> Installing dependencies..."
npm --prefix "$APP_DIR" install --omit=dev

echo "==> Restarting app with PM2..."
if pm2 list | grep -q 'purim-karaoke'; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start "$APP_DIR/ecosystem.config.js"
fi

pm2 save
echo "==> Done. App is running."
