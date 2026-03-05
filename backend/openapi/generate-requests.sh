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

# devcontainer内の場合、ホスト側パスを解決する
# Docker socket共有方式ではホストパスでマウントする必要がある
resolve_host_path() {
    local container_path="$1"
    local mount_info
    mount_info=$(awk '$5 == "/workspace"' /proc/self/mountinfo 2>/dev/null)
    if [ -n "$mount_info" ]; then
        local fs_root fs_type mount_source
        fs_root=$(echo "$mount_info" | awk '{print $4}')
        # "- fstype source options" の部分を解析
        mount_source=$(echo "$mount_info" | sed 's/.*- [^ ]* //' | awk '{print $1}')
        # /run/host_mark/Users -> /Users (macOS Docker Desktop)
        local host_prefix
        host_prefix=$(echo "$mount_source" | sed 's|/run/host_mark||')
        local host_workspace="${host_prefix}${fs_root}"
        echo "${container_path/\/workspace/$host_workspace}"
    else
        echo "$container_path"
    fi
}

MOUNT_PATH=$(resolve_host_path "$BACKEND_DIR")

# FormRequestを生成（Docker経由）
cd "$BACKEND_DIR"
docker run --rm \
  -v "${MOUNT_PATH}:/local" \
  -w /local \
  openapitools/openapi-generator-cli:v${VERSION} \
  generate \
  -i /local/openapi/openapi.yaml \
  -g php \
  -o /local \
  -c /local/openapi/config.json \
  -t /local/openapi/templates \
  --global-property models

echo "✅ FormRequestの生成が完了しました: backend/app/Http/Requests/"
