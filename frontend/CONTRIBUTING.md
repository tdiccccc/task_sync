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
├── app/              # メインアプリケーション
│   └── app.vue       # ルートコンポーネント
├── src/
│   ├── openapi/      # OpenAPI 生成スクリプト・設定
│   └── schemas/      # Zod スキーマ（ランタイムバリデーション用）
├── public/           # 静的ファイル
├── nuxt.config.ts    # Nuxt 設定
├── eslint.config.mjs # ESLint 設定
├── .prettierrc       # Prettier 設定
└── .stylelintrc.json # Stylelint 設定
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
