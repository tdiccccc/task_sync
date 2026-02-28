# CLAUDE.md

このファイルは、このリポジトリで作業する際にClaude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト概要

タスクの進捗、作業時間を追跡し、自動レポートを提供するSlackおよびBacklog連携機能を備えたタスク管理システムです。時間=コストをチームメンバーに可視化し、データ駆動型のパフォーマンス評価を可能にすることを目的としています。

**技術スタック:**

- フロントエンド: Nuxt 3 (SPAモード), TypeScript, Zodによるランタイムバリデーション
- バックエンド: Laravel 12 + オニオンアーキテクチャ
- データベース: MySQL (Docker), SQLite (開発デフォルト)
- API: OpenAPI仕様ベース
- コンテナ: Docker + devcontainer

## 開発コマンド

### バックエンド (Laravel)

```bash
# /workspace/backend ディレクトリから実行

# 初期セットアップ
composer setup

# 全サービス起動 (Laravelサーバー、キュー、ログ、Vite)
composer dev

# テスト実行
composer test
# または
php artisan test

# データベース操作
php artisan migrate
php artisan migrate:fresh    # 全テーブル削除後に再マイグレーション
php artisan db:seed

# コード整形
./vendor/bin/pint

# 単一テストファイル実行
php artisan test --filter=TestClassName
```

### フロントエンド (Nuxt 3)

```bash
# /workspace/frontend ディレクトリから実行

# 依存関係インストール
npm install

# 開発サーバー起動 (http://localhost:5173)
npm run dev

# プロダクションビルド
npm run build

# プロダクションビルドのプレビュー
npm run preview
```

### Docker

```bash
# /workspace ディレクトリから実行

# コンテナ起動
docker compose up -d

# コンテナ停止
docker compose down

# バックエンドはポート8200で動作
# フロントエンド開発サーバーはポート5173で動作
```

## アーキテクチャ

このプロジェクトは**オニオンアーキテクチャ**に従い、明確なレイヤー分離を行っています:

### バックエンドレイヤー構造

| レイヤー              | ディレクトリ              | 責務                                                      | 依存関係             |
| ------------------ | ---------------------- | -------------------------------------------------------- | -------------------- |
| **Domain**         | `app/Domains`          | ビジネスロジック、エンティティ、ドメインサービス、リポジトリインターフェース | なし (コアレイヤー)    |
| **Application**    | `app/Application`      | ユースケース、アプリケーションサービス、トランザクション管理             | Domainレイヤーのみ    |
| **Infrastructure** | `app/Infrastructure`   | リポジトリ実装、外部APIクライアント、技術的詳細                      | Application + Domain |
| **Presentation**   | `app/Http/Controllers` | HTTPリクエスト処理、レスポンス生成、OpenAPI仕様                    | 全レイヤー           |

**重要な原則**: 依存関係は内側を向く。Domainレイヤーは外部依存を持たない。InfrastructureとPresentationは内側のレイヤーに依存し、その逆はない。

### オートロード名前空間

バックエンドはcomposer.jsonで定義されたカスタムPSR-4名前空間を使用します:

- `App\` → `app/`
- `Domains\` → `app/Domains/`
- `Application\` → `app/Application/`
- `Infrastructure\` → `app/Infrastructure/`

これらのディレクトリに新しいクラスを作成する際は、適切な名前空間を使用してください。

### フロントエンド構造

- `app/app.vue` - メインアプリケーションコンポーネント
- `src/schemas/` - ランタイムバリデーション用のZodスキーマ (現在空)
- Nuxt 3 SPAモード (SSR無効)

### 型安全性とAPIスキーマ

- フロントエンドはZodをランタイムバリデーションに使用
- API契約は`backend/openapi/openapi.yaml`のOpenAPIで定義
- OpenAPI仕様を通じてフロントエンドとバックエンド間で型を同期
- フロントエンドはスキーマ生成ツールを持つ: `ts-json-schema-generator`, `zod-to-json-schema`

## 開発ワークフロー

1. **バックエンド開発**:
   - `app/Domains`でドメインエンティティとビジネスロジックを定義
   - `app/Application`でユースケースを実装
   - `app/Infrastructure`でリポジトリ実装を作成
   - `app/Http/Controllers`でコントローラーを追加
   - `backend/openapi/openapi.yaml`でOpenAPI仕様を更新

2. **フロントエンド開発**:
   - APIバリデーション用に`src/schemas/`でZodスキーマを作成
   - 標準的なNuxt 3構造でコンポーネントを構築
   - ランタイム型安全性にZodを使用

3. **テスト**:
   - バックエンドテストは`tests/Feature`と`tests/Unit`に配置
   - `php artisan test`または`composer test`で実行

## 外部連携

システムは以下と連携します:

- **Slack**: 自動進捗通知
- **Backlog**: タスク同期

外部APIクライアントは`app/Infrastructure`に実装してください。

## データベース

- 開発デフォルト: SQLite (`database/database.sqlite`)
- プロダクション: MySQL (Docker経由、ポート3306)
- マイグレーション: `database/migrations/`
- シーダー: `database/seeders/`
- ファクトリー: `database/factories/`

`.env`のデータベース設定:

- SQLite: `DB_CONNECTION=sqlite` (デフォルト)
- MySQL: `DB_CONNECTION=mysql`に変更し、ホスト/認証情報を設定

## 会話ガイドライン

- 常に日本語で会話する
