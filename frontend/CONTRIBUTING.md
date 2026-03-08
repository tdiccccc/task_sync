# Contributing Guide（フロントエンド）

このドキュメントは、フロントエンド開発に参加する開発者向けのガイドです。

## 開発環境セットアップ

### 前提条件

- Node.js 20 以上
- npm

### 初期セットアップ

```bash
cd frontend
npm install
npm run dev
```

開発サーバーが `http://localhost:5173` で起動します。

## 開発コマンド

| コマンド                   | 説明                                       |
| -------------------------- | ------------------------------------------ |
| `npm run dev`              | 開発サーバー起動                           |
| `npm run build`            | プロダクションビルド                       |
| `npm run preview`          | ビルドプレビュー                           |
| `npm run lint`             | ESLint + Prettier + Stylelint 一括チェック |
| `npm run format`           | ESLint + Prettier 自動フォーマット         |
| `npm run format:stylelint` | Stylelint 自動フォーマット                 |
| `npm run generate:openapi` | Zod スキーマから OpenAPI 仕様を生成        |

## 技術スタック

- **Nuxt 3**（SPA モード、SSR 無効）
- **Vue 3** + **Vue Router**
- **TypeScript**
- **Zod** — ランタイムバリデーション
- **Reka UI** — ヘッドレスUIコンポーネント
- **Tailwind CSS** — ユーティリティファーストCSS

## UI設計思想: ヘッドレスコンポーネント

本プロジェクトでは**ヘッドレスコンポーネント**の設計思想を採用しています。

### 基本原則

1. **ロジックと見た目の分離** — コンポーネントの振る舞い（状態管理・アクセシビリティ・キーボード操作）はReka UIが担い、見た目はTailwind CSSで定義する
2. **スタイルの自由度** — ヘッドレスコンポーネントはスタイルを持たないため、デザイン変更がロジックに影響しない
3. **アクセシビリティの担保** — WAI-ARIA準拠のインタラクションをReka UIが提供する

### コンポーネントの作り方

```
UIコンポーネント = Reka UI（振る舞い） + Tailwind CSS（見た目）
```

- **共通UIパーツ**: `app/components/ui/` に Reka UI をラップしたコンポーネントとして配置する
- **機能コンポーネント**: `app/components/<feature>/` に機能単位で配置する
- **ロジックの再利用**: `app/composables/` に切り出す

### 実装例

```vue
<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTrigger } from 'reka-ui'
</script>

<template>
  <DialogRoot>
    <DialogTrigger class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
      開く
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/50" />
      <DialogContent class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
        <p>ダイアログの内容</p>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
```

### やるべきこと・避けるべきこと

| やるべきこと | 避けるべきこと |
|---|---|
| Reka UI のプリミティブを活用する | 独自にアクセシビリティ対応を実装する |
| Tailwind CSS のユーティリティで装飾する | scoped CSS でコンポーネント固有スタイルを書く |
| `components/ui/` に共通部品をまとめる | ページコンポーネントに直接 Reka UI を大量に記述する |
| composable でロジックを分離する | テンプレート内にビジネスロジックを書く |

## コーディング規約

### ESLint + Prettier

ESLint と Prettier が統合されています（`eslint.config.mjs` / `.prettierrc`）。

主な Prettier 設定:

| 設定       | 値               |
| ---------- | ---------------- |
| セミコロン | なし             |
| クォート   | シングルクォート |
| printWidth | 100              |
| tabWidth   | 2                |
| 末尾カンマ | es5              |
| インデント | スペース         |
| 改行コード | LF               |

### Stylelint

CSS / SCSS / Vue ファイルのスタイルは Stylelint でチェックします（`.stylelintrc.json`）。

- `stylelint-config-standard` と `stylelint-config-recommended-vue` を継承

### コミット前のチェック

コミット前に必ず以下を実行してください:

```bash
npm run lint
```

## ディレクトリ構成

```
frontend/
├── app/                # メインアプリケーション
│   ├── app.vue         # ルートコンポーネント
│   ├── components/
│   │   ├── ui/         # Reka UI ラッパー（共通UI部品）
│   │   └── <feature>/  # 機能単位のコンポーネント
│   ├── composables/    # ロジックの再利用
│   ├── layouts/        # レイアウト
│   └── pages/          # ページコンポーネント
├── src/
│   ├── openapi/        # OpenAPI 生成スクリプト・設定
│   └── schemas/        # Zod スキーマ（ランタイムバリデーション用）
├── public/             # 静的ファイル
├── nuxt.config.ts      # Nuxt 設定
├── eslint.config.mjs   # ESLint 設定
├── .prettierrc         # Prettier 設定
└── .stylelintrc.json   # Stylelint 設定
```

## ブランチ・コミット規約

### ブランチ名

```
feat/#<issue番号>/<説明>
```

例: `feat/#4/add-laravel-sanctum-spa`

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に従います。

```
feat: 新機能の追加
fix: バグ修正
chore: ビルド・設定の変更
docs: ドキュメントのみの変更
refactor: リファクタリング
test: テストの追加・修正
```

例:

```
feat(frontend): ログイン画面の実装
chore(frontend): ESLint設定の更新
```
