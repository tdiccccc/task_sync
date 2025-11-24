# users テーブル定義書

## 概要

ユーザー情報を管理するテーブル

## テーブル情報

| 項目       | 値      |
| ---------- | ------- |
| テーブル名 | users   |
| エンジン   | mysql   |
| 文字セット | utf8mb4 |

## カラム定義

| カラム名          | データ型        | NULL | デフォルト | キー   | 説明                     |
| ----------------- | --------------- | ---- | ---------- | ------ | ------------------------ |
| id                | bigint unsigned | NO   | -          | PK, AI | ユーザー ID              |
| name              | varchar(255)    | NO   | -          | -      | ユーザー名               |
| email             | varchar(255)    | NO   | -          | UNI    | メールアドレス           |
| email_verified_at | datetime        | YES  | NULL       | -      | メール認証日時           |
| password          | varchar(255)    | NO   | -          | -      | パスワード（ハッシュ化） |
| remember_token    | varchar(100)    | YES  | NULL       | -      | ログイン保持トークン     |
| hourly_rate       | int/decimal     | YES  | NULL       | -      | 人件費単価（円/時間）    |
| is_valid          | boolean         | NO   | true       | -      | 有効・無効               |
| created_at        | datetime        | YES  | NULL       | -      | 作成日時                 |
| updated_at        | datetime        | YES  | NULL       | -      | 更新日時                 |
| deleted_at        | datetime        | YES  | NULL       | -      | 削除日時                 |

## インデックス

| インデックス名     | カラム | 種類        |
| ------------------ | ------ | ----------- |
| PRIMARY            | id     | PRIMARY KEY |
| users_email_unique | email  | UNIQUE      |

## 備考

- Laravel のデフォルトユーザーテーブル構造に基づく
- `remember_token`は Remember Me 機能で使用
