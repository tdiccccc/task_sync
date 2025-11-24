# user_slack_accounts テーブル定義書

## 概要

Slack 連携情報を管理するテーブル（ユーザーごと）

## テーブル情報

| 項目       | 値                  |
| ---------- | ------------------- |
| テーブル名 | user_slack_accounts |
| エンジン   | mysql               |
| 文字セット | utf8mb4             |

## カラム定義

| カラム名                      | データ型        | NULL | デフォルト | キー   | 説明                           |
| ----------------------------- | --------------- | ---- | ---------- | ------ | ------------------------------ |
| id                            | bigint unsigned | NO   | -          | PK, AI | ID                             |
| user_id                       | bigint unsigned | NO   | -          | FK     | ユーザー ID（users.id）        |
| slack_user_id                 | varchar(100)    | YES  | NULL       | -      | Slack ユーザー ID（U***）      |
| slack_bot_token               | text            | NO   | -          | -      | Bot 用トークン（暗号化保存）   |
| slack_channel_id              | varchar(100)    | NO   | -          | -      | 投稿先チャンネル/DM ID         |
| notification_interval_minutes | int             | NO   | 0          | -      | 通知間隔（分）                 |
| last_notified_at              | datetime        | YES  | NULL       | -      | 最終通知日時                   |
| is_valid                      | boolean         | NO   | true       | -      | 接続有効フラグ                 |
| created_at                    | datetime        | YES  | NULL       | -      | 作成日時                       |
| updated_at                    | datetime        | YES  | NULL       | -      | 更新日時                       |

## インデックス

| インデックス名                  | カラム  | 種類        |
| ------------------------------- | ------- | ----------- |
| PRIMARY                         | id      | PRIMARY KEY |
| user_slack_accounts_user_id_idx | user_id | INDEX       |

## 外部キー制約

| 制約名                             | カラム  | 参照テーブル | 参照カラム |
| ---------------------------------- | ------- | ------------ | ---------- |
| user_slack_accounts_user_id_foreign | user_id | users        | id         |

## 備考

- notification_interval_minutes: 0 = 通知なし、30 = 30分ごと、60 = 1時間ごと
- slack_bot_token は暗号化して保存すること
