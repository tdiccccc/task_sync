#!/bin/bash

# ZodスキーマからOpenAPI仕様とFormRequestを一括生成するスクリプト

set -e

WORKSPACE_DIR="/workspace"

echo "🎯 API自動生成を開始します..."
echo ""

# Step 1: Zod → OpenAPI仕様生成 (frontend)
echo "📝 Step 1: Zodスキーマ → OpenAPI仕様を生成中..."
cd "${WORKSPACE_DIR}/frontend"
npm run generate:openapi
echo "✅ OpenAPI仕様の生成完了: backend/openapi/openapi.yaml"
echo ""

# Step 2: OpenAPI仕様 → FormRequest生成 (backend)
echo "🔧 Step 2: OpenAPI仕様 → FormRequestを生成中..."
cd "${WORKSPACE_DIR}/backend"
bash openapi/generate-requests.sh
echo "✅ FormRequestの生成完了: backend/app/Http/Requests/"
echo ""

echo "🎉 すべての自動生成が完了しました！"
echo ""
echo "📦 生成されたファイル:"
echo "  - backend/openapi/openapi.yaml (OpenAPI仕様)"
echo "  - backend/app/Http/Requests/*.php (FormRequest)"
