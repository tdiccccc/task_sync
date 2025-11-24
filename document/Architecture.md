# アーキテクチャ図

## システム全体構成

```mermaid
graph TB
    subgraph External["外部サービス"]
        Slack[Slack]
        Backlog[Backlog]
    end

    subgraph Frontend["フロントエンド Nuxt3 SPA"]
        Vue[Vue Components]
        Zod[Zod Schemas]
        Vue --> Zod
    end

    subgraph Backend["バックエンド Laravel 12"]
        subgraph Presentation["プレゼンテーション層"]
            Controllers[Controllers]
            OpenAPI[OpenAPI Spec]
        end

        subgraph Application["アプリケーション層"]
            UseCases[Use Cases]
            Services[Application Services]
        end

        subgraph Domain["ドメイン層"]
            Entities[Entities]
            DomainServices[Domain Services]
            Repositories[Repository Interfaces]
        end

        subgraph Infrastructure["インフラストラクチャ層"]
            RepoImpl[Repository Implementations]
            ExternalAPI[External API Clients]
            DB[(Database)]
        end
    end

    Vue -->|HTTP/JSON| Controllers
    Controllers --> UseCases
    UseCases --> Services
    Services --> Entities
    Services --> Repositories
    Repositories --> RepoImpl
    RepoImpl --> DB
    ExternalAPI --> Slack
    ExternalAPI --> Backlog
    Services --> ExternalAPI
```

## オニオンアーキテクチャ

```mermaid
graph LR
    subgraph Outer["外側 Infrastructure"]
        subgraph Middle["中間 Application"]
            subgraph Inner["内側 Domain"]
                Core[Entities / Domain Services]
            end
            App[Use Cases / Application Services]
        end
        Infra[Controllers / Repositories / External APIs]
    end

    Infra --> App --> Core
```

## データフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as Frontend Nuxt3
    participant B as Backend Laravel
    participant S as Slack
    participant BL as Backlog

    U->>F: タスク操作
    F->>F: Zodバリデーション
    F->>B: API リクエスト
    B->>B: ビジネスロジック実行
    B->>BL: タスク同期
    B->>S: 進捗通知
    B->>F: レスポンス
    F->>U: 画面更新
```

## ディレクトリとレイヤーの対応

| レイヤー | ディレクトリ | 責務 |
|---------|-------------|------|
| Presentation | `app/Http/Controllers` | HTTPリクエスト処理、レスポンス生成 |
| Application | `app/Application` | ユースケース実装、トランザクション管理 |
| Domain | `app/Domains` | ビジネスロジック、エンティティ、ドメインサービス |
| Infrastructure | `app/Infrastructure` | DB実装、外部API連携、技術的詳細 |
