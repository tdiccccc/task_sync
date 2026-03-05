#!/bin/bash

# OpenAPI仕様からLaravel FormRequestを自動生成するスクリプト
# Docker経由でopenapi-generator-cliを実行

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
VERSION="7.4.0"

echo "🚀 FormRequest自動生成を開始します..."

# Dockerコマンドが使用可能か確認
if ! command -v docker &> /dev/null; then
    echo "❌ Dockerが見つかりません"
    echo "Docker CLIをインストールするか、devcontainerを再起動してください"
    exit 1
fi

# FormRequestを生成（Docker経由）
cd "$BACKEND_DIR"
docker run --rm \
  -v "${BACKEND_DIR}:/workspace" \
  -w /workspace \
  openapitools/openapi-generator-cli:v${VERSION} \
  generate \
  -i /workspace/openapi/openapi.yaml \
  -g php \
  -o /workspace/app/Http \
  -c /workspace/openapi/config.json \
  -t /workspace/openapi/templates \
  --global-property models,supportingFiles

echo "✅ FormRequestの生成が完了しました: backend/app/Http/Requests/"
