# フロントエンド画面ルート定義

## 概要

Nuxt 3のファイルベースルーティングに基づく画面構成

## ルート一覧

### 共通

| パス | ファイルパス | 画面名 | 説明 | 認証 |
|------|------------|--------|------|------|
| `/` | `pages/index.vue` | ダッシュボード | プロジェクト概要、作業時間サマリー | 必須 |
| `/login` | `pages/login.vue` | ログイン | ユーザー認証 | 不要 |

### プロジェクト管理

| パス | ファイルパス | 画面名 | 説明 | 認証 |
|------|------------|--------|------|------|
| `/projects` | `pages/projects/index.vue` | プロジェクト一覧 | 全プロジェクトの一覧表示 | 必須 |
| `/projects/create` | `pages/projects/create.vue` | プロジェクト新規作成 | 新規プロジェクト作成フォーム | 必須 |
| `/projects/:id` | `pages/projects/[id].vue` | プロジェクト詳細 | プロジェクト詳細情報、タスク一覧 | 必須 |
| `/projects/:id/edit` | `pages/projects/[id]/edit.vue` | プロジェクト編集 | プロジェクト情報編集フォーム | 必須 |

### タスクカテゴリ管理

| パス | ファイルパス | 画面名 | 説明 | 認証 |
|------|------------|--------|------|------|
| `/projects/:projectId/categories` | `pages/projects/[projectId]/categories/index.vue` | カテゴリ一覧 | プロジェクト内のカテゴリ管理 | 必須 |
| `/projects/:projectId/categories/create` | `pages/projects/[projectId]/categories/create.vue` | カテゴリ作成 | 新規カテゴリ作成 | 必須 |
| `/projects/:projectId/categories/:id/edit` | `pages/projects/[projectId]/categories/[id]/edit.vue` | カテゴリ編集 | カテゴリ情報編集 | 必須 |

### タスク管理

| パス | ファイルパス | 画面名 | 説明 | 認証 |
|------|------------|--------|------|------|
| `/tasks` | `pages/tasks/index.vue` | タスク一覧 | 全タスクの一覧（フィルタ可） | 必須 |
| `/tasks/create` | `pages/tasks/create.vue` | タスク新規作成 | 新規タスク作成フォーム | 必須 |
| `/tasks/:id` | `pages/tasks/[id].vue` | タスク詳細 | タスク詳細情報、作業ログ一覧 | 必須 |
| `/tasks/:id/edit` | `pages/tasks/[id]/edit.vue` | タスク編集 | タスク情報編集フォーム | 必須 |

### 作業ログ管理

| パス | ファイルパス | 画面名 | 説明 | 認証 |
|------|------------|--------|------|------|
| `/work-logs` | `pages/work-logs/index.vue` | 作業ログ一覧 | 自分の作業ログ一覧 | 必須 |
| `/work-logs/create` | `pages/work-logs/create.vue` | 作業ログ記録 | 作業時間記録フォーム | 必須 |
| `/work-logs/:id/edit` | `pages/work-logs/[id]/edit.vue` | 作業ログ編集 | 作業ログ編集フォーム | 必須 |

### ユーザー管理

| パス | ファイルパス | 画面名 | 説明 | 認証 |
|------|------------|--------|------|------|
| `/users` | `pages/users/index.vue` | ユーザー一覧 | ユーザー管理画面 | 必須（admin） |
| `/users/create` | `pages/users/create.vue` | ユーザー作成 | 新規ユーザー作成 | 必須（admin） |
| `/users/:id` | `pages/users/[id].vue` | ユーザー詳細 | ユーザー情報詳細 | 必須 |
| `/users/:id/edit` | `pages/users/[id]/edit.vue` | ユーザー編集 | ユーザー情報編集 | 必須 |

### ロール管理

| パス | ファイルパス | 画面名 | 説明 | 認証 |
|------|------------|--------|------|------|
| `/roles` | `pages/roles/index.vue` | ロール一覧 | ロール管理画面 | 必須（admin） |
| `/roles/create` | `pages/roles/create.vue` | ロール作成 | 新規ロール作成 | 必須（admin） |
| `/roles/:id/edit` | `pages/roles/[id]/edit.vue` | ロール編集 | ロール編集 | 必須（admin） |

### レポート・集計

| パス | ファイルパス | 画面名 | 説明 | 認証 |
|------|------------|--------|------|------|
| `/reports/projects` | `pages/reports/projects.vue` | プロジェクト別集計 | プロジェクトごとの工数集計 | 必須 |
| `/reports/users` | `pages/reports/users.vue` | ユーザー別集計 | ユーザーごとの工数集計 | 必須 |
| `/reports/categories` | `pages/reports/categories.vue` | カテゴリ別集計 | カテゴリごとの工数集計 | 必須 |

### 設定

| パス | ファイルパス | 画面名 | 説明 | 認証 |
|------|------------|--------|------|------|
| `/settings` | `pages/settings/index.vue` | 設定トップ | 設定画面メニュー | 必須 |
| `/settings/profile` | `pages/settings/profile.vue` | プロフィール設定 | ユーザー情報編集 | 必須 |
| `/settings/slack` | `pages/settings/slack.vue` | Slack連携設定 | Slack連携情報設定 | 必須 |
| `/settings/backlog` | `pages/settings/backlog.vue` | Backlog連携設定 | Backlog連携情報設定 | 必須 |

## ナビゲーション構造

```
/ (ダッシュボード)
├── /projects (プロジェクト管理)
│   ├── /projects/:id (詳細)
│   │   └── /projects/:id/categories (カテゴリ管理)
│   └── /projects/create (新規作成)
├── /tasks (タスク管理)
│   ├── /tasks/:id (詳細)
│   └── /tasks/create (新規作成)
├── /work-logs (作業ログ)
│   ├── /work-logs/create (記録)
│   └── /work-logs/:id/edit (編集)
├── /reports (レポート)
│   ├── /reports/projects
│   ├── /reports/users
│   └── /reports/categories
├── /users (ユーザー管理) ※admin
├── /roles (ロール管理) ※admin
└── /settings (設定)
    ├── /settings/profile
    ├── /settings/slack
    └── /settings/backlog
```

## 権限要件

| 権限 | 説明 | アクセス可能な画面 |
|------|------|------------------|
| **未認証** | ログインしていない | `/login` のみ |
| **member** | 一般メンバー | `/users`, `/roles` 以外の全画面 |
| **admin** | 管理者 | 全画面 |

## 画面遷移パターン

### パターン1: プロジェクト → タスク → 作業ログ
```
/projects → /projects/:id → /tasks/:id → /work-logs/create
```

### パターン2: 作業ログ記録
```
/ (ダッシュボード) → /work-logs/create
```

### パターン3: レポート確認
```
/ (ダッシュボード) → /reports/projects
```

## 備考

- Nuxt 3のファイルベースルーティングを使用
- 動的ルートは`[id]`形式で表記
- 認証が必要な画面はミドルウェアで保護
- admin権限が必要な画面は追加のミドルウェアで保護
