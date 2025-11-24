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

echo "🎉 Devcontainer setup completed!"
