# task_categories テーブル定義書

## 概要

案件内作業分類を管理するテーブル（要件定義 / 設計 / 開発 / テスト / 打ち合わせ など）

## テーブル情報

| 項目       | 値              |
| ---------- | --------------- |
| テーブル名 | task_categories |
| エンジン   | mysql           |
| 文字セット | utf8mb4         |

## カラム定義

| カラム名    | データ型        | NULL | デフォルト | キー   | 説明                         |
| ----------- | --------------- | ---- | ---------- | ------ | ---------------------------- |
| id          | bigint unsigned | NO   | -          | PK, AI | カテゴリ ID                  |
| project_id  | bigint unsigned | NO   | -          | FK     | プロジェクト ID（projects.id） |
| name        | varchar(255)    | NO   | -          | -      | カテゴリ名（要件定義など）   |
| description | text            | YES  | NULL       | -      | 説明                         |
| color       | varchar(20)     | YES  | NULL       | -      | ラベル色（UI 用）            |
| sort_order  | int             | NO   | 0          | -      | 表示順                       |
| created_at  | datetime        | YES  | NULL       | -      | 作成日時                     |
| updated_at  | datetime        | YES  | NULL       | -      | 更新日時                     |

## インデックス

| インデックス名                | カラム     | 種類        |
| ----------------------------- | ---------- | ----------- |
| PRIMARY                       | id         | PRIMARY KEY |
| task_categories_project_id_idx | project_id | INDEX       |

## 外部キー制約

| 制約名                            | カラム     | 参照テーブル | 参照カラム |
| --------------------------------- | ---------- | ------------ | ---------- |
| task_categories_project_id_foreign | project_id | projects     | id         |

## 備考

- 案件ごとに作業分類を定義可能
- sort_order で表示順を制御
