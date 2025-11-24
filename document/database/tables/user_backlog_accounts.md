# user_backlog_accounts テーブル定義書

## 概要

Backlog 連携情報を管理するテーブル（ユーザーごと）

## テーブル情報

| 項目       | 値                    |
| ---------- | --------------------- |
| テーブル名 | user_backlog_accounts |
| エンジン   | mysql                 |
| 文字セット | utf8mb4               |

## カラム定義

| カラム名            | データ型        | NULL | デフォルト | キー   | 説明                          |
| ------------------- | --------------- | ---- | ---------- | ------ | ----------------------------- |
| id                  | bigint unsigned | NO   | -          | PK, AI | ID                            |
| user_id             | bigint unsigned | NO   | -          | FK     | ユーザー ID（users.id）       |
| api_key             | text            | NO   | -          | -      | Backlog API キー（暗号化保存）|
| backlog_user_id     | varchar(100)    | YES  | NULL       | -      | Backlog ユーザー ID/name      |
| backlog_space_key   | varchar(100)    | NO   | -          | -      | スペースキー（xxx.backlog.jp）|
| backlog_project_key | varchar(100)    | YES  | NULL       | -      | プロジェクトキー              |
| is_valid            | boolean         | NO   | true       | -      | 接続有効フラグ                |
| created_at          | datetime        | YES  | NULL       | -      | 作成日時                      |
| updated_at          | datetime        | YES  | NULL       | -      | 更新日時                      |

## インデックス

| インデックス名                    | カラム  | 種類        |
| --------------------------------- | ------- | ----------- |
| PRIMARY                           | id      | PRIMARY KEY |
| user_backlog_accounts_user_id_idx | user_id | INDEX       |

## 外部キー制約

| 制約名                               | カラム  | 参照テーブル | 参照カラム |
| ------------------------------------ | ------- | ------------ | ---------- |
| user_backlog_accounts_user_id_foreign | user_id | users        | id         |

## 備考

- api_key は暗号化して保存すること
- backlog_space_key: https://xxx.backlog.jp の xxx 部分
