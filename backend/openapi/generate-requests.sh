#!/bin/bash

# OpenAPI仕様からLaravel FormRequestを自動生成するスクリプト

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
JAR_PATH="${SCRIPT_DIR}/openapi-generator-cli.jar"
VERSION="7.4.0"

echo "🚀 FormRequest自動生成を開始します..."

# jarファイルが存在しない場合はダウンロード
if [ ! -f "$JAR_PATH" ]; then
    echo "📥 openapi-generator-cli.jar をダウンロード中..."
    curl -L "https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/${VERSION}/openapi-generator-cli-${VERSION}.jar" -o "$JAR_PATH"
    echo "✅ ダウンロード完了"
fi

# FormRequestを生成
cd "$BACKEND_DIR"
java -jar "$JAR_PATH" generate \
  -i openapi/openapi.yaml \
  -g php \
  -o app/Http \
  -c openapi/config.json \
  -t openapi/templates \
  --global-property models,supportingFiles

echo "✅ FormRequestの生成が完了しました: backend/app/Http/Requests/"
