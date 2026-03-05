# .devcontainer/post-create.sh
#!/usr/bin/env bash
set -eux

echo "📦 Setup backend (Laravel)"
cd /workspace/backend
if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
fi
composer install
php artisan key:generate || true


echo "📦 Setup frontend (Vue)"
cd /workspace/frontend
if [ -f package.json ]; then
  npm install
fi

echo "🐳 Setup Docker CLI for Docker-in-Docker"
if ! command -v docker &> /dev/null; then
  sudo apt-get update
  sudo apt-get install -y docker.io
fi
# Docker socketのグループ権限を付与（newgrp不要で即時反映）
if [ -S /var/run/docker.sock ]; then
  DOCKER_GID=$(stat -c '%g' /var/run/docker.sock)
  if getent group "${DOCKER_GID}" > /dev/null 2>&1; then
    sudo usermod -aG "$(getent group "${DOCKER_GID}" | cut -d: -f1)" vscode || true
  else
    sudo groupadd -g "${DOCKER_GID}" docker-host || true
    sudo usermod -aG docker-host vscode || true
  fi
  sudo chmod 666 /var/run/docker.sock
fi

echo "🎉 Devcontainer setup completed!"
