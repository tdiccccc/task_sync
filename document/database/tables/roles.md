# roles テーブル定義書

## 概要

ユーザーの役割（ロール）を管理するテーブル

## テーブル情報

| 項目       | 値      |
| ---------- | ------- |
| テーブル名 | roles   |
| エンジン   | mysql   |
| 文字セット | utf8mb4 |

## カラム定義

| カラム名   | データ型        | NULL | デフォルト | キー   | 説明                           |
| ---------- | --------------- | ---- | ---------- | ------ | ------------------------------ |
| id         | bigint unsigned | NO   | -          | PK, AI | ロール ID                      |
| name       | varchar(255)    | NO   | -          | UNI    | ロール名（admin, member など） |
| created_at | datetime        | YES  | NULL       | -      | 作成日時                       |
| updated_at | datetime        | YES  | NULL       | -      | 更新日時                       |
| deleted_at | datetime        | YES  | NULL       | -      | 削除日時                       |

## インデックス

| インデックス名    | カラム | 種類        |
| ----------------- | ------ | ----------- |
| PRIMARY           | id     | PRIMARY KEY |
| roles_name_unique | name   | UNIQUE      |

## 備考

- admin: 管理者権限
- member: 一般メンバー権限
