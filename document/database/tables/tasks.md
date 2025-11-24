# tasks テーブル定義書

## 概要

実際にユーザーが紐づけるタスクを管理するテーブル

## テーブル情報

| 項目       | 値      |
| ---------- | ------- |
| テーブル名 | tasks   |
| エンジン   | mysql   |
| 文字セット | utf8mb4 |

## カラム定義

| カラム名         | データ型        | NULL | デフォルト | キー   | 説明                              |
| ---------------- | --------------- | ---- | ---------- | ------ | --------------------------------- |
| id               | bigint unsigned | NO   | -          | PK, AI | タスク ID                         |
| project_id       | bigint unsigned | NO   | -          | FK     | プロジェクト ID（projects.id）    |
| task_category_id | bigint unsigned | YES  | NULL       | FK     | カテゴリ ID（task_categories.id） |
| name             | varchar(255)    | NO   | -          | -      | タスク名                          |
| description      | text            | YES  | NULL       | -      | 詳細内容                          |
| status           | varchar(50)     | NO   | open       | -      | ステータス                        |
| estimated_hours  | decimal(5,2)    | YES  | NULL       | -      | 見積もり時間                      |
| created_by       | bigint unsigned | NO   | -          | FK     | 作成者（users.id）                |
| assigned_to      | bigint unsigned | YES  | NULL       | FK     | 担当者（users.id）                |
| due_date         | date            | YES  | NULL       | -      | 期限                              |
| archived_at      | datetime        | YES  | NULL       | -      | アーカイブ日時                    |
| created_at       | datetime        | YES  | NULL       | -      | 作成日時                          |
| updated_at       | datetime        | YES  | NULL       | -      | 更新日時                          |

## インデックス

| インデックス名              | カラム           | 種類        |
| --------------------------- | ---------------- | ----------- |
| PRIMARY                     | id               | PRIMARY KEY |
| tasks_project_id_idx        | project_id       | INDEX       |
| tasks_task_category_id_idx  | task_category_id | INDEX       |
| tasks_created_by_idx        | created_by       | INDEX       |
| tasks_assigned_to_idx       | assigned_to      | INDEX       |

## 外部キー制約

| 制約名                        | カラム           | 参照テーブル    | 参照カラム |
| ----------------------------- | ---------------- | --------------- | ---------- |
| tasks_project_id_foreign      | project_id       | projects        | id         |
| tasks_task_category_id_foreign | task_category_id | task_categories | id         |
| tasks_created_by_foreign      | created_by       | users           | id         |
| tasks_assigned_to_foreign     | assigned_to      | users           | id         |

## 備考

- status: open, in_progress, blocked, done
- task_category_id は NULL 許容（カテゴリ未分類）
- archived_at で完了後のタスクを非表示に
