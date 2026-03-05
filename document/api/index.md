# API エンドポイント定義

## 概要

RESTful APIの原則に基づくバックエンドAPIエンドポイント定義

- ベースURL: `http://localhost:8200/api`
- 認証方式: Bearer Token (Laravel Sanctum)
- レスポンス形式: JSON

## 共通仕様

### HTTPステータスコード

| コード | 意味 | 使用ケース |
|--------|------|----------|
| 200 | OK | 成功（GET, PUT） |
| 201 | Created | リソース作成成功（POST） |
| 204 | No Content | 削除成功（DELETE） |
| 400 | Bad Request | バリデーションエラー |
| 401 | Unauthorized | 認証エラー |
| 403 | Forbidden | 権限エラー |
| 404 | Not Found | リソースが存在しない |
| 422 | Unprocessable Entity | バリデーションエラー（詳細） |
| 500 | Internal Server Error | サーバーエラー |

### エラーレスポンス形式

```json
{
  "message": "エラーメッセージ",
  "errors": {
    "field_name": ["エラー詳細1", "エラー詳細2"]
  }
}
```

### ページネーション

リスト取得APIは以下のクエリパラメータをサポート:

- `page`: ページ番号（デフォルト: 1）
- `per_page`: 1ページあたりの件数（デフォルト: 15, 最大: 100）

レスポンス形式:
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 73
  }
}
```

---

## 認証

### POST /api/login
ログイン

**リクエスト**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**レスポンス (200)**
```json
{
  "token": "1|abcdef...",
  "user": {
    "id": 1,
    "name": "山田太郎",
    "email": "user@example.com"
  }
}
```

### POST /api/logout
ログアウト（認証必須）

**レスポンス (204)**

### GET /api/user
ログイン中のユーザー情報取得（認証必須）

**レスポンス (200)**
```json
{
  "id": 1,
  "name": "山田太郎",
  "email": "user@example.com",
  "hourly_rate": 3000.00,
  "is_valid": true,
  "roles": ["admin"]
}
```

---

## プロジェクト管理

### GET /api/projects
プロジェクト一覧取得

**クエリパラメータ**
- `is_active`: 進行中フラグでフィルタ（true/false）
- `page`, `per_page`: ページネーション

**レスポンス (200)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "案件A",
      "amount": 1000000.00,
      "description": "案件Aの概要",
      "started_at": "2024-01-01T00:00:00Z",
      "ended_at": null,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": { ... }
}
```

### GET /api/projects/{id}
プロジェクト詳細取得

**レスポンス (200)**
```json
{
  "id": 1,
  "name": "案件A",
  "amount": 1000000.00,
  "description": "案件Aの概要",
  "started_at": "2024-01-01T00:00:00Z",
  "ended_at": null,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "total_hours": 120.5,
  "total_cost": 361500.00
}
```

### POST /api/projects
プロジェクト作成

**リクエスト**
```json
{
  "name": "案件A",
  "amount": 1000000.00,
  "description": "案件Aの概要",
  "started_at": "2024-01-01T00:00:00Z",
  "is_active": true
}
```

**レスポンス (201)**
```json
{
  "id": 1,
  "name": "案件A",
  ...
}
```

### PUT /api/projects/{id}
プロジェクト更新

**リクエスト**
```json
{
  "name": "案件A（更新）",
  "amount": 1200000.00,
  "is_active": false,
  "ended_at": "2024-12-31T00:00:00Z"
}
```

**レスポンス (200)**

### DELETE /api/projects/{id}
プロジェクト削除（ソフトデリート）

**レスポンス (204)**

---

## タスクカテゴリ管理

### GET /api/projects/{projectId}/categories
プロジェクト内のカテゴリ一覧取得

**レスポンス (200)**
```json
{
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "name": "要件定義",
      "description": "要件定義フェーズの作業",
      "color": "#FF5733",
      "sort_order": 1,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/projects/{projectId}/categories
カテゴリ作成

**リクエスト**
```json
{
  "name": "要件定義",
  "description": "要件定義フェーズの作業",
  "color": "#FF5733",
  "sort_order": 1
}
```

**レスポンス (201)**

### PUT /api/categories/{id}
カテゴリ更新

**リクエスト**
```json
{
  "name": "要件定義（更新）",
  "color": "#00FF00"
}
```

**レスポンス (200)**

### DELETE /api/categories/{id}
カテゴリ削除

**レスポンス (204)**

---

## タスク管理

### GET /api/tasks
タスク一覧取得

**クエリパラメータ**
- `project_id`: プロジェクトIDでフィルタ
- `assigned_to`: 担当者IDでフィルタ
- `status`: ステータスでフィルタ（open/in_progress/blocked/done）
- `page`, `per_page`: ページネーション

**レスポンス (200)**
```json
{
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "task_category_id": 1,
      "name": "データベース設計",
      "description": "ER図の作成",
      "status": "in_progress",
      "estimated_hours": 8.00,
      "created_by": 1,
      "assigned_to": 2,
      "due_date": "2024-01-15",
      "archived_at": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-05T00:00:00Z",
      "project": { "id": 1, "name": "案件A" },
      "category": { "id": 1, "name": "要件定義" },
      "assignee": { "id": 2, "name": "佐藤花子" }
    }
  ],
  "meta": { ... }
}
```

### GET /api/tasks/{id}
タスク詳細取得

**レスポンス (200)**
```json
{
  "id": 1,
  "project_id": 1,
  "task_category_id": 1,
  "name": "データベース設計",
  "description": "ER図の作成",
  "status": "in_progress",
  "estimated_hours": 8.00,
  "actual_hours": 6.50,
  "created_by": 1,
  "assigned_to": 2,
  "due_date": "2024-01-15",
  "work_logs": [
    {
      "id": 1,
      "work_date": "2024-01-05",
      "work_minutes": 240,
      "comment": "ER図作成中"
    }
  ]
}
```

### POST /api/tasks
タスク作成

**リクエスト**
```json
{
  "project_id": 1,
  "task_category_id": 1,
  "name": "データベース設計",
  "description": "ER図の作成",
  "status": "open",
  "estimated_hours": 8.00,
  "assigned_to": 2,
  "due_date": "2024-01-15"
}
```

**レスポンス (201)**

### PUT /api/tasks/{id}
タスク更新

**リクエスト**
```json
{
  "status": "in_progress",
  "assigned_to": 3
}
```

**レスポンス (200)**

### DELETE /api/tasks/{id}
タスク削除

**レスポンス (204)**

### PATCH /api/tasks/{id}/archive
タスクをアーカイブ

**レスポンス (200)**

---

## 作業ログ管理

### GET /api/work-logs
作業ログ一覧取得

**クエリパラメータ**
- `user_id`: ユーザーIDでフィルタ
- `project_id`: プロジェクトIDでフィルタ
- `task_id`: タスクIDでフィルタ
- `date_from`: 開始日でフィルタ（YYYY-MM-DD）
- `date_to`: 終了日でフィルタ（YYYY-MM-DD）
- `page`, `per_page`: ページネーション

**レスポンス (200)**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 2,
      "project_id": 1,
      "task_category_id": 1,
      "task_id": 1,
      "work_date": "2024-01-05",
      "work_minutes": 240,
      "comment": "ER図作成中",
      "created_at": "2024-01-05T18:00:00Z",
      "updated_at": "2024-01-05T18:00:00Z",
      "user": { "id": 2, "name": "佐藤花子" },
      "project": { "id": 1, "name": "案件A" },
      "task": { "id": 1, "name": "データベース設計" }
    }
  ],
  "meta": { ... }
}
```

### GET /api/work-logs/{id}
作業ログ詳細取得

**レスポンス (200)**

### POST /api/work-logs
作業ログ記録

**リクエスト**
```json
{
  "task_id": 1,
  "work_date": "2024-01-05",
  "work_minutes": 240,
  "comment": "ER図作成中"
}
```

**レスポンス (201)**

### PUT /api/work-logs/{id}
作業ログ更新

**リクエスト**
```json
{
  "work_minutes": 300,
  "comment": "ER図作成完了"
}
```

**レスポンス (200)**

### DELETE /api/work-logs/{id}
作業ログ削除

**レスポンス (204)**

---

## ユーザー管理

### GET /api/users
ユーザー一覧取得（admin権限必須）

**レスポンス (200)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "山田太郎",
      "email": "yamada@example.com",
      "hourly_rate": 3000.00,
      "is_valid": true,
      "roles": ["admin"]
    }
  ],
  "meta": { ... }
}
```

### GET /api/users/{id}
ユーザー詳細取得

**レスポンス (200)**

### POST /api/users
ユーザー作成（admin権限必須）

**リクエスト**
```json
{
  "name": "山田太郎",
  "email": "yamada@example.com",
  "password": "password",
  "hourly_rate": 3000.00,
  "role_ids": [1]
}
```

**レスポンス (201)**

### PUT /api/users/{id}
ユーザー更新

**リクエスト**
```json
{
  "name": "山田太郎（更新）",
  "hourly_rate": 3500.00
}
```

**レスポンス (200)**

### DELETE /api/users/{id}
ユーザー削除（ソフトデリート、admin権限必須）

**レスポンス (204)**

---

## ロール管理

### GET /api/roles
ロール一覧取得（admin権限必須）

**レスポンス (200)**
```json
{
  "data": [
    {
      "id": 1,
      "name": "admin",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/roles
ロール作成（admin権限必須）

**リクエスト**
```json
{
  "name": "manager"
}
```

**レスポンス (201)**

### PUT /api/roles/{id}
ロール更新（admin権限必須）

**レスポンス (200)**

### DELETE /api/roles/{id}
ロール削除（admin権限必須）

**レスポンス (204)**

---

## レポート・集計

### GET /api/reports/projects
プロジェクト別工数集計

**クエリパラメータ**
- `date_from`: 集計期間開始日
- `date_to`: 集計期間終了日

**レスポンス (200)**
```json
{
  "data": [
    {
      "project_id": 1,
      "project_name": "案件A",
      "total_hours": 120.5,
      "total_cost": 361500.00,
      "user_breakdown": [
        {
          "user_id": 2,
          "user_name": "佐藤花子",
          "hours": 80.5,
          "cost": 241500.00
        }
      ]
    }
  ]
}
```

### GET /api/reports/users
ユーザー別工数集計

**クエリパラメータ**
- `date_from`: 集計期間開始日
- `date_to`: 集計期間終了日

**レスポンス (200)**
```json
{
  "data": [
    {
      "user_id": 2,
      "user_name": "佐藤花子",
      "total_hours": 160.0,
      "project_breakdown": [
        {
          "project_id": 1,
          "project_name": "案件A",
          "hours": 80.5
        }
      ]
    }
  ]
}
```

### GET /api/reports/categories
カテゴリ別工数集計

**クエリパラメータ**
- `project_id`: プロジェクトIDでフィルタ
- `date_from`: 集計期間開始日
- `date_to`: 集計期間終了日

**レスポンス (200)**
```json
{
  "data": [
    {
      "category_id": 1,
      "category_name": "要件定義",
      "total_hours": 40.0,
      "percentage": 33.2
    }
  ]
}
```

---

## 外部連携設定

### GET /api/settings/slack
Slack連携設定取得

**レスポンス (200)**
```json
{
  "id": 1,
  "user_id": 1,
  "slack_user_id": "U12345678",
  "slack_channel_id": "C12345678",
  "notification_interval_minutes": 60,
  "last_notified_at": "2024-01-05T12:00:00Z",
  "is_valid": true
}
```

### POST /api/settings/slack
Slack連携設定作成・更新

**リクエスト**
```json
{
  "slack_bot_token": "xoxb-...",
  "slack_channel_id": "C12345678",
  "notification_interval_minutes": 60
}
```

**レスポンス (201)**

### DELETE /api/settings/slack
Slack連携解除

**レスポンス (204)**

### GET /api/settings/backlog
Backlog連携設定取得

**レスポンス (200)**
```json
{
  "id": 1,
  "user_id": 1,
  "backlog_user_id": "user123",
  "backlog_space_key": "myspace",
  "backlog_project_key": "PROJ",
  "is_valid": true
}
```

### POST /api/settings/backlog
Backlog連携設定作成・更新

**リクエスト**
```json
{
  "api_key": "abc123...",
  "backlog_space_key": "myspace",
  "backlog_project_key": "PROJ"
}
```

**レスポンス (201)**

### DELETE /api/settings/backlog
Backlog連携解除

**レスポンス (204)**

---

## エンドポイント一覧（クイックリファレンス）

| メソッド | エンドポイント | 説明 | 認証 |
|----------|--------------|------|------|
| POST | /api/login | ログイン | - |
| POST | /api/logout | ログアウト | ✓ |
| GET | /api/user | ユーザー情報取得 | ✓ |
| GET | /api/projects | プロジェクト一覧 | ✓ |
| POST | /api/projects | プロジェクト作成 | ✓ |
| GET | /api/projects/{id} | プロジェクト詳細 | ✓ |
| PUT | /api/projects/{id} | プロジェクト更新 | ✓ |
| DELETE | /api/projects/{id} | プロジェクト削除 | ✓ |
| GET | /api/projects/{projectId}/categories | カテゴリ一覧 | ✓ |
| POST | /api/projects/{projectId}/categories | カテゴリ作成 | ✓ |
| PUT | /api/categories/{id} | カテゴリ更新 | ✓ |
| DELETE | /api/categories/{id} | カテゴリ削除 | ✓ |
| GET | /api/tasks | タスク一覧 | ✓ |
| POST | /api/tasks | タスク作成 | ✓ |
| GET | /api/tasks/{id} | タスク詳細 | ✓ |
| PUT | /api/tasks/{id} | タスク更新 | ✓ |
| DELETE | /api/tasks/{id} | タスク削除 | ✓ |
| PATCH | /api/tasks/{id}/archive | タスクアーカイブ | ✓ |
| GET | /api/work-logs | 作業ログ一覧 | ✓ |
| POST | /api/work-logs | 作業ログ作成 | ✓ |
| GET | /api/work-logs/{id} | 作業ログ詳細 | ✓ |
| PUT | /api/work-logs/{id} | 作業ログ更新 | ✓ |
| DELETE | /api/work-logs/{id} | 作業ログ削除 | ✓ |
| GET | /api/users | ユーザー一覧 | ✓ (admin) |
| POST | /api/users | ユーザー作成 | ✓ (admin) |
| GET | /api/users/{id} | ユーザー詳細 | ✓ |
| PUT | /api/users/{id} | ユーザー更新 | ✓ |
| DELETE | /api/users/{id} | ユーザー削除 | ✓ (admin) |
| GET | /api/roles | ロール一覧 | ✓ (admin) |
| POST | /api/roles | ロール作成 | ✓ (admin) |
| PUT | /api/roles/{id} | ロール更新 | ✓ (admin) |
| DELETE | /api/roles/{id} | ロール削除 | ✓ (admin) |
| GET | /api/reports/projects | プロジェクト別集計 | ✓ |
| GET | /api/reports/users | ユーザー別集計 | ✓ |
| GET | /api/reports/categories | カテゴリ別集計 | ✓ |
| GET | /api/settings/slack | Slack設定取得 | ✓ |
| POST | /api/settings/slack | Slack設定更新 | ✓ |
| DELETE | /api/settings/slack | Slack設定削除 | ✓ |
| GET | /api/settings/backlog | Backlog設定取得 | ✓ |
| POST | /api/settings/backlog | Backlog設定更新 | ✓ |
| DELETE | /api/settings/backlog | Backlog設定削除 | ✓ |

---

## 備考

- 全てのAPI呼び出しには`Accept: application/json`ヘッダーを含める
- 認証が必要なエンドポイントは`Authorization: Bearer {token}`ヘッダーを含める
- タイムゾーンはUTC、フロントエンドでローカルタイムゾーンに変換
- 日付フォーマット: ISO 8601形式（例: `2024-01-01T00:00:00Z`）
