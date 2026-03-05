# Contributing Guide（バックエンド）

このドキュメントは、バックエンド開発に参加する開発者向けのガイドです。

## 開発環境セットアップ

### 前提条件

- PHP 8.2 以上
- Composer
- Docker（devcontainer 推奨）

### 初期セットアップ

```bash
cd backend
composer setup
```

`composer setup` は以下を実行します:

1. `composer install`（依存パッケージのインストール）
2. `.env.example` → `.env` のコピー
3. `php artisan key:generate`（アプリケーションキーの生成）
4. `php artisan migrate`（データベースマイグレーション）

### データベース

開発デフォルトは SQLite（`database/database.sqlite`）です。

MySQL を使用する場合:

```bash
# プロジェクトルートで Docker コンテナを起動
docker compose up -d

# .env を編集
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

## 開発コマンド

| コマンド                                  | 説明                                                   |
| ----------------------------------------- | ------------------------------------------------------ |
| `composer dev`                            | 全サービス起動（Laravel サーバー、キュー、ログ、Vite） |
| `composer test`                           | テスト実行                                             |
| `php artisan test --filter=TestClassName` | 単一テストファイル実行                                 |
| `composer fix`                            | コードフォーマット自動修正（php-cs-fixer）             |
| `composer fix:check`                      | フォーマット差分確認（dry-run）                        |
| `php artisan migrate`                     | マイグレーション実行                                   |
| `php artisan migrate:fresh`               | 全テーブル削除後に再マイグレーション                   |
| `php artisan db:seed`                     | シーダー実行                                           |

## アーキテクチャ

本プロジェクトはオニオンアーキテクチャを採用しています。
レイヤー構造、各レイヤーの責務・責務違反、依存方向の詳細は [Architecture.md](../document/Architecture.md) を参照してください。

### PSR-4 名前空間マッピング

| 名前空間          | ディレクトリ          |
| ----------------- | --------------------- |
| `App\`            | `app/`                |
| `Domains\`        | `app/Domains/`        |
| `Application\`    | `app/Application/`    |
| `Infrastructure\` | `app/Infrastructure/` |

新しいクラスを作成する際は、レイヤーに応じた適切なディレクトリと名前空間を使用してください。

## コーディング規約

### コードフォーマット

- [php-cs-fixer](https://cs.symfony.com/) を使用（設定: `.php-cs-fixer.dist.php`）
- コミット前に必ず `composer fix` を実行してください
- `composer fix:check` でフォーマット違反の差分を確認できます（CI 向け）

主なルール:
- PSR-12 準拠
- `declare(strict_types=1)` 必須
- 未使用 import の自動削除、アルファベット順ソート
- trailing comma（配列・引数・パラメータ）
- クラス要素の順序統一（trait → 定数 → プロパティ → コンストラクタ → メソッド）

### テスト

- テストは `tests/Feature/` と `tests/Unit/` に配置
- PHPUnit を使用（テスト時は SQLite in-memory で実行）
- `composer test` で全テストを実行

## API 開発フロー

1. `openapi/openapi.yaml` で API 仕様を定義
2. `composer generate:requests` で FormRequest クラスを自動生成
3. コントローラーで生成された FormRequest を使用

詳細は [openapi/README.md](openapi/README.md) を参照してください。

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
feat(backend): Laravel Sanctum SPA認証の初期セットアップ
chore(backend): .gitignoreに学習ドキュメントディレクトリの除外を追加
```
