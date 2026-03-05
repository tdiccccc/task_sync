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
| `./vendor/bin/pint`                       | コードフォーマット（Laravel Pint）                     |
| `php artisan migrate`                     | マイグレーション実行                                   |
| `php artisan migrate:fresh`               | 全テーブル削除後に再マイグレーション                   |
| `php artisan db:seed`                     | シーダー実行                                           |

## アーキテクチャ（オニオンアーキテクチャ）

### レイヤー構造

| レイヤー           | ディレクトリ            | 責務                                                                         | 依存先               |
| ------------------ | ----------------------- | ---------------------------------------------------------------------------- | -------------------- |
| **Domain**         | `app/Domains/`          | ビジネスロジック、エンティティ、ドメインサービス、リポジトリインターフェース | なし（コアレイヤー） |
| **Application**    | `app/Application/`      | ユースケース、アプリケーションサービス、トランザクション管理                 | Domain のみ          |
| **Infrastructure** | `app/Infrastructure/`   | リポジトリ実装、外部 API クライアント、技術的詳細                            | Domain のみ          |
| **Presentation**   | `app/Http/Controllers/` | HTTP リクエスト処理、レスポンス生成                                          | 全レイヤー           |

### [Presentation](app/Http)

#### 責務

- 認証/認可チェック
- リクエストデータ(Json)→PHPデータ型への変換
- PHPデータ型→レスポンスデータ(Json)への変換
- リクエストデータのバリデーション処理
- レスポンスデータのバリデーション処理
- Applicationの呼び出し
    - 原則 Controller 1 method につき Application 1 method とする
    - 1コントローラー1メソッド（\_\_invoke）とする
    ```php
        class GetListController {}
        class CreateController {}
        class UpdateController {}
        class DeleteController {}
    ```
    ```
    Controllers/
        Project/
            GetListController.php    ← 一覧取得
            CreateController.php     ← 案件作成
            UpdateController.php    ← 案件更新
            DeleteController.php     ← 案件削除
    ```

#### 責務違反

- Domainの呼び出し
- Infrastructureの呼び出し
- 他集約のPresentation呼び出し
- DB直接アクセス
- ビジネスロジック記述

### [Application](app/Application/)

#### UseCase (Command)

**責務**

- Infrastructureの呼び出し
- Domainの呼び出し
    - Entity, ValueObject の生成
    - Entity の公開メソッド実行
        - Domain Factory が存在する場合, Entity の createファクトリメソッドは呼び出し禁止
    - Domain Factory の実行
    - Domain Service の実行

**責務違反**

- Presentationの呼び出し
- 他集約のUseCase/QueryServiceの呼び出し
- 集約をまたいだデータの取得
- DB直接アクセス
- ビジネスロジック記述

### [Domain](app/Domains/)

#### Entity

- 一意にデータを識別できる最小単位
- Identifier を必ずメンバーに持つ
- 他集約のEntityやValueObjectをメンバーに持つ
- 他集約のEntityやValueObjectに関するバリデーションをconstructor内で行う。
- 完全イミュータブル

#### ValueObject

- 一意に識別する必要のないデータ
- Identifier は持たない
- Entity に属する場合もあるし、属さない場合もある。
- 値に関するバリデーションをconstructor内で行う。
- 完全イミュータブル

#### DomainService

- Entity に記載すると不自然な処理やビジネスロジックを記述する
    - e.x. Entity の存在チェック
- ドメイン貧血症になるため原則使用禁止。
    - 可能な限りEntityにビジネスロジックを持たせること

#### Factory

- Entity や ValueObject の生成ロジックを記述。
- 下記の場合にFactoryを検討する。
    - Entity/ValueObject 生成条件やロジックが複雑な場合
    - 生成条件を Entity/ValueObject に記述したいが不自然な場合
        - e.x. EntityId の採番処理

### [Infrastructure](app/Infrastructure/)

#### 責務

- DBアクセス
    - MySQL, Redis など
- 外部API/サービスへのアクセス
    - AWS S3
    - Slack API
- Email送信
    - SMTP通信
- Domainの呼び出し
    - Entity の永続化/復元
    - Entity の取得/削除

#### 責務違反

- Presentationの呼び出し
- Applicationの呼び出し
- 他集約のInfrastructure呼び出し

**重要**: 依存関係は常に内側を向きます。Domain レイヤーは外部依存を持ちません。

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

- [Laravel Pint](https://laravel.com/docs/pint) を使用（デフォルトルール）
- コミット前に必ず `./vendor/bin/pint` を実行してください

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
