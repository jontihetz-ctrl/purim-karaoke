#!/bin/bash
# Run once on a fresh VPS (Ubuntu/Debian) to set up Node, PM2, Nginx, and the app.
# Usage: bash setup-vps.sh

set -e

REPO_URL="https://github.com/jontihetz-ctrl/purim-karaoke.git"
APP_DIR="$HOME/purim-karaoke"

echo "==> Installing Node.js 20 via nvm..."
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20

echo "==> Installing PM2..."
npm install -g pm2

echo "==> Installing Nginx..."
sudo apt-get update -y
sudo apt-get install -y nginx

echo "==> Cloning repository..."
git clone "$REPO_URL" "$APP_DIR"

echo "==> Installing app dependencies..."
npm --prefix "$APP_DIR" install --omit=dev

echo "==> Starting app with PM2..."
pm2 start "$APP_DIR/ecosystem.config.js"
pm2 save
pm2 startup | tail -1 | bash   # enable PM2 to start on boot

echo "==> Configuring Nginx..."
sudo cp "$APP_DIR/nginx.conf" /etc/nginx/sites-available/karaoke
sudo ln -sf /etc/nginx/sites-available/karaoke /etc/nginx/sites-enabled/karaoke
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "==> Setup complete!"
echo "    Edit /etc/nginx/sites-available/karaoke and replace YOUR_DOMAIN_OR_IP,"
echo "    then run: sudo nginx -t && sudo systemctl reload nginx"
echo "    App is accessible at http://YOUR_DOMAIN_OR_IP"
