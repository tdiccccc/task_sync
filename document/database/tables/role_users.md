# role_users テーブル定義書

## 概要

ユーザーとロールの関連を管理する中間テーブル

## テーブル情報

| 項目       | 値         |
| ---------- | ---------- |
| テーブル名 | role_users |
| エンジン   | mysql      |
| 文字セット | utf8mb4    |

## カラム定義

| カラム名   | データ型        | NULL | デフォルト | キー   | 説明                    |
| ---------- | --------------- | ---- | ---------- | ------ | ----------------------- |
| id         | bigint unsigned | NO   | -          | PK, AI | ID                      |
| user_id    | bigint unsigned | NO   | -          | FK     | ユーザー ID（users.id） |
| role_id    | bigint unsigned | NO   | -          | FK     | ロール ID（roles.id）   |
| created_at | datetime        | YES  | NULL       | -      | 作成日時                |
| updated_at | datetime        | YES  | NULL       | -      | 更新日時                |
| deleted_at | datetime        | YES  | NULL       | -      | 削除日時                |

## インデックス

| インデックス名         | カラム  | 種類        |
| ---------------------- | ------- | ----------- |
| PRIMARY                | id      | PRIMARY KEY |
| role_users_user_id_idx | user_id | INDEX       |
| role_users_role_id_idx | role_id | INDEX       |

## 外部キー制約

| 制約名                     | カラム  | 参照テーブル | 参照カラム |
| -------------------------- | ------- | ------------ | ---------- |
| role_users_user_id_foreign | user_id | users        | id         |
| role_users_role_id_foreign | role_id | roles        | id         |

## 備考

- 1 ユーザーに対して複数のロールを割り当て可能
- user_id と role_id の組み合わせで一意性を担保する場合は複合ユニークインデックスを追加
