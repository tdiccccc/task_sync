# ER図

## 概要

工数管理システムのエンティティ関連図

## ER図

```mermaid
erDiagram
    users {
        bigint id PK
        varchar name
        varchar email UK
        datetime email_verified_at
        varchar password
        varchar remember_token
        decimal hourly_rate
        boolean is_valid
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    roles {
        bigint id PK
        varchar name UK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    role_users {
        bigint id PK
        bigint user_id FK
        bigint role_id FK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    projects {
        bigint id PK
        varchar name
        decimal amount
        text description
        datetime started_at
        datetime ended_at
        boolean is_active
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    task_categories {
        bigint id PK
        bigint project_id FK
        varchar name
        text description
        varchar color
        int sort_order
        datetime created_at
        datetime updated_at
    }

    tasks {
        bigint id PK
        bigint project_id FK
        bigint task_category_id FK
        varchar name
        text description
        varchar status
        decimal estimated_hours
        bigint created_by FK
        bigint assigned_to FK
        date due_date
        datetime archived_at
        datetime created_at
        datetime updated_at
    }

    work_logs {
        bigint id PK
        bigint user_id FK
        bigint project_id FK
        bigint task_category_id FK
        bigint task_id FK
        date work_date
        int work_minutes
        text comment
        datetime created_at
        datetime updated_at
    }

    user_slack_accounts {
        bigint id PK
        bigint user_id FK
        varchar slack_user_id
        text slack_bot_token
        varchar slack_channel_id
        int notification_interval_minutes
        datetime last_notified_at
        boolean is_valid
        datetime created_at
        datetime updated_at
    }

    user_backlog_accounts {
        bigint id PK
        bigint user_id FK
        text api_key
        varchar backlog_user_id
        varchar backlog_space_key
        varchar backlog_project_key
        boolean is_valid
        datetime created_at
        datetime updated_at
    }

    %% Relations
    users ||--o{ role_users : "has"
    roles ||--o{ role_users : "has"
    users ||--o{ tasks : "created_by"
    users ||--o{ tasks : "assigned_to"
    users ||--o{ work_logs : "records"
    users ||--o| user_slack_accounts : "has"
    users ||--o| user_backlog_accounts : "has"
    projects ||--o{ task_categories : "contains"
    projects ||--o{ tasks : "contains"
    projects ||--o{ work_logs : "has"
    task_categories ||--o{ tasks : "categorizes"
    task_categories ||--o{ work_logs : "categorizes"
    tasks ||--o{ work_logs : "has"
```

## リレーション一覧

| 親テーブル      | 子テーブル            | カーディナリティ | 説明                     |
| --------------- | --------------------- | ---------------- | ------------------------ |
| users           | role_users            | 1:N              | ユーザーのロール割当     |
| roles           | role_users            | 1:N              | ロールのユーザー割当     |
| users           | tasks                 | 1:N              | タスク作成者/担当者      |
| users           | work_logs             | 1:N              | ユーザーの作業実績       |
| users           | user_slack_accounts   | 1:0..1           | Slack 連携情報           |
| users           | user_backlog_accounts | 1:0..1           | Backlog 連携情報         |
| projects        | task_categories       | 1:N              | 案件の作業分類           |
| projects        | tasks                 | 1:N              | 案件のタスク             |
| projects        | work_logs             | 1:N              | 案件の作業実績           |
| task_categories | tasks                 | 1:N              | カテゴリのタスク         |
| task_categories | work_logs             | 1:N              | カテゴリの作業実績       |
| tasks           | work_logs             | 1:N              | タスクの作業実績         |
