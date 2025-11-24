# projects テーブル定義書

## 概要

案件の基本情報を管理するテーブル

## テーブル情報

| 項目       | 値       |
| ---------- | -------- |
| テーブル名 | projects |
| エンジン   | mysql    |
| 文字セット | utf8mb4  |

## カラム定義

| カラム名    | データ型        | NULL | デフォルト | キー   | 説明                           |
| ----------- | --------------- | ---- | ---------- | ------ | ------------------------------ |
| id          | bigint unsigned | NO   | -          | PK, AI | プロジェクト ID                |
| name        | varchar(255)    | NO   | -          | -      | 案件名                         |
| amount      | decimal(12,2)   | YES  | NULL       | -      | 受注金額（税抜 or 税込は運用）  |
| description | text            | YES  | NULL       | -      | 案件の概要                     |
| started_at  | datetime        | YES  | NULL       | -      | 着手日                         |
| ended_at    | datetime        | YES  | NULL       | -      | 完了日                         |
| is_active   | boolean         | NO   | true       | -      | 進行中フラグ                   |
| created_at  | datetime        | YES  | NULL       | -      | 作成日時                       |
| updated_at  | datetime        | YES  | NULL       | -      | 更新日時                       |
| deleted_at  | datetime        | YES  | NULL       | -      | 削除日時（ソフトデリート）     |

## インデックス

| インデックス名 | カラム | 種類        |
| -------------- | ------ | ----------- |
| PRIMARY        | id     | PRIMARY KEY |

## 備考

- ソフトデリート対応（deleted_at）
- is_active で進行中/完了を管理
