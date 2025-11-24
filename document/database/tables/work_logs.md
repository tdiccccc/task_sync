# work_logs テーブル定義書

## 概要

作業実績のログを管理するテーブル（最重要テーブル）

## テーブル情報

| 項目       | 値        |
| ---------- | --------- |
| テーブル名 | work_logs |
| エンジン   | mysql     |
| 文字セット | utf8mb4   |

## カラム定義

| カラム名         | データ型        | NULL | デフォルト | キー   | 説明                              |
| ---------------- | --------------- | ---- | ---------- | ------ | --------------------------------- |
| id               | bigint unsigned | NO   | -          | PK, AI | 実績 ID                           |
| user_id          | bigint unsigned | NO   | -          | FK     | ユーザー ID（users.id）           |
| project_id       | bigint unsigned | NO   | -          | FK     | プロジェクト ID（projects.id）    |
| task_category_id | bigint unsigned | YES  | NULL       | FK     | カテゴリ ID（task_categories.id） |
| task_id          | bigint unsigned | NO   | -          | FK     | タスク ID（tasks.id）             |
| work_date        | date            | NO   | -          | -      | 実績日（集計に必須）              |
| work_minutes     | int             | NO   | -          | -      | 作業時間（分単位）                |
| comment          | text            | YES  | NULL       | -      | 作業メモ                          |
| created_at       | datetime        | YES  | NULL       | -      | 作成日時                          |
| updated_at       | datetime        | YES  | NULL       | -      | 更新日時                          |

## インデックス

| インデックス名                | カラム           | 種類        |
| ----------------------------- | ---------------- | ----------- |
| PRIMARY                       | id               | PRIMARY KEY |
| work_logs_user_id_idx         | user_id          | INDEX       |
| work_logs_project_id_idx      | project_id       | INDEX       |
| work_logs_task_category_id_idx | task_category_id | INDEX       |
| work_logs_task_id_idx         | task_id          | INDEX       |
| work_logs_work_date_idx       | work_date        | INDEX       |

## 外部キー制約

| 制約名                            | カラム           | 参照テーブル    | 参照カラム |
| --------------------------------- | ---------------- | --------------- | ---------- |
| work_logs_user_id_foreign         | user_id          | users           | id         |
| work_logs_project_id_foreign      | project_id       | projects        | id         |
| work_logs_task_category_id_foreign | task_category_id | task_categories | id         |
| work_logs_task_id_foreign         | task_id          | tasks           | id         |

## 備考

- work_minutes: 分単位で記録（例：90 = 1.5 時間）
- 集計クエリ例：
  - 案件別時間：SUM(work_minutes) WHERE project_id = ?
  - タスク別時間：SUM(work_minutes) WHERE task_id = ?
  - カテゴリ別時間：SUM(work_minutes) WHERE task_category_id = ?
  - ユーザー別月次：WHERE user_id = ? AND work_date BETWEEN ...
