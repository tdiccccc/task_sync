# 学習プラン: プロジェクト管理のCRUD実装

このドキュメントでは、プロジェクト管理のCRUD機能を5つのセクションに分けて学びます。オニオンアーキテクチャの全レイヤーを初めて実践し、フロントエンドのAPI通信基盤を構築します。各セクションは「学習目標 → 解説 → 実装手順 → 確認ポイント」の流れで構成されています。

---

## セクション1: OpenAPI仕様の拡充とFormRequest生成

### 学習目標

- RESTful APIのエンドポイント設計を理解する
- OpenAPI Zodスキーマの追加・登録パターンを習得する
- `npm run generate:openapi` → `composer generate:requests` のパイプラインを体験する

### 解説

#### REST原則とHTTPメソッドの対応

プロジェクト管理のCRUD操作は、RESTful APIの基本原則に従って設計します。

| 操作 | HTTPメソッド | エンドポイント | 説明 |
|------|-------------|--------------|------|
| 一覧取得 | GET | `/api/projects` | ページネーション付きでプロジェクト一覧を返す |
| 詳細取得 | GET | `/api/projects/{id}` | 特定プロジェクトの詳細を返す |
| 作成 | POST | `/api/projects` | 新しいプロジェクトを作成する |
| 更新 | PUT | `/api/projects/{id}` | 既存プロジェクトを更新する |
| 削除 | DELETE | `/api/projects/{id}` | プロジェクトを削除する（ソフトデリート） |

**ポイント:**
- リソース名は複数形（`projects`）を使用
- 個別リソースにはIDパラメータ（`{id}`）を使用
- POST（作成）はコレクションに対して、PUT/DELETE（更新/削除）は個別リソースに対して実行

#### 既存 create.ts のコード解説

`frontend/src/openapi/schemas/api/project/create.ts`の構造を理解しましょう。OpenAPIスキーマ定義の基本パターンです。

```typescript
// ① スキーマ定義 — Zodでリクエストボディの形状を定義
export const CreateProjectRequestSchema = z
  .object({
    name: z.string().min(1, '案件名は必須です').max(50, '...').describe('案件名')
      .openapi({ example: '案件A' }),
    amount: z.number().min(0, '...').describe('金額')
      .openapi({ example: 1000000 }),
    // ...他のフィールド
  })
  .openapi('CreateProjectRequest')  // ← OpenAPIコンポーネント名を指定

// ② レスポンス定義 — サーバーから返るデータの形状
export const CreateProjectResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  // ...他のフィールド
  created_at: z.string(),
  updated_at: z.string(),
})

// ③ registerPath関数 — OpenAPIレジストリにエンドポイントを登録
export function registerCreateProjectPath(registry: OpenAPIRegistry): void {
  registry.register('CreateProjectRequest', CreateProjectRequestSchema)

  registry.registerPath({
    method: 'post',
    path: '/api/projects',
    summary: 'プロジェクト作成',
    tags: ['Projects'],
    request: { body: { content: { 'application/json': { schema: CreateProjectRequestSchema } } } },
    responses: {
      201: { description: '成功', content: { 'application/json': { schema: CreateProjectResponseSchema } } },
      // ...エラーレスポンス
    },
  })
}

// ④ 型export — TypeScriptの型として使えるようにする
export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>
```

このパターン（スキーマ定義 → レスポンス定義 → registerPath → 型export）は、全エンドポイントで共通です。

#### ページネーションレスポンスの設計

一覧取得APIではページネーション情報を返します。Laravelの`paginate()`が生成する構造に合わせます。

```typescript
// ページネーションメタ情報
{
  data: [...],        // プロジェクトの配列
  meta: {
    current_page: 1,  // 現在のページ番号
    last_page: 5,     // 最終ページ番号
    per_page: 15,     // 1ページあたりの件数
    total: 73,        // 全件数
  }
}
```

フロントエンドはこの`meta`情報を使ってページネーションUIを描画します。

#### base schemaの役割

`frontend/src/openapi/schemas/base/`にあるスキーマは、複数のエンドポイントで共有される「共通型」です。

```
base/
├── shared/
│   └── DateTimeSchema.ts  ← 日時フォーマットの共通定義
├── user/
│   └── user.ts            ← UserSchema（GET /api/user, 一覧レスポンス等で使用）
└── project/
    └── project.ts         ← ProjectSchema（一覧・詳細・作成・更新レスポンスで共有）★新規
```

`ProjectSchema`を`base/project/project.ts`に定義しておくと、一覧レスポンス（`z.array(ProjectSchema)`）、詳細レスポンス（`ProjectSchema`単体）、作成レスポンス・更新レスポンスで同じスキーマを再利用できます。

### 実装手順

#### 手順1: 共通Projectレスポンススキーマの作成

`frontend/src/openapi/schemas/base/project/project.ts`を新規作成します。

```typescript
import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

/**
 * プロジェクト情報スキーマ（共通レスポンス）
 */
export const ProjectSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: '案件A' }),
    amount: z.number().openapi({ example: 1000000 }),
    description: z.string().openapi({ example: '新規Webサイト開発プロジェクト' }),
    started_at: z.string().nullable().openapi({ example: '2024-01-01T00:00:00Z' }),
    ended_at: z.string().nullable().openapi({ example: '2024-12-31T23:59:59Z' }),
    is_active: z.boolean().openapi({ example: true }),
    created_at: z.string().openapi({ example: '2024-01-01T00:00:00Z' }),
    updated_at: z.string().openapi({ example: '2024-01-01T00:00:00Z' }),
  })
  .openapi('Project')

/** プロジェクト情報の型 */
export type Project = z.infer<typeof ProjectSchema>
```

**ポイント:**
- `UserSchema`（`base/user/user.ts`）と同じパターン
- レスポンスで使う全フィールドを含む
- `.openapi('Project')`でOpenAPIコンポーネント名を指定

#### 手順2: GET /api/projects — 一覧取得エンドポイント

`frontend/src/openapi/schemas/api/project/list.ts`を新規作成します。

```typescript
import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { ProjectSchema } from '../../base/project/project'

extendZodWithOpenApi(z)

/**
 * ページネーションメタ情報スキーマ
 */
export const PaginationMetaSchema = z.object({
  current_page: z.number().openapi({ example: 1 }),
  last_page: z.number().openapi({ example: 5 }),
  per_page: z.number().openapi({ example: 15 }),
  total: z.number().openapi({ example: 73 }),
})

/**
 * プロジェクト一覧レスポンスのスキーマ
 */
export const GetProjectListResponseSchema = z.object({
  data: z.array(ProjectSchema),
  meta: PaginationMetaSchema,
})

/**
 * プロジェクト一覧取得エンドポイントをレジストリに登録する
 */
export function registerGetProjectListPath(registry: OpenAPIRegistry): void {
  registry.register('Project', ProjectSchema)

  registry.registerPath({
    method: 'get',
    path: '/api/projects',
    summary: 'プロジェクト一覧取得',
    description: 'プロジェクト一覧をページネーション付きで取得します',
    tags: ['Projects'],
    request: {
      query: z.object({
        page: z.number().optional().openapi({ example: 1 }),
        per_page: z.number().optional().openapi({ example: 15 }),
        is_active: z.boolean().optional().openapi({ example: true }),
      }),
    },
    responses: {
      200: {
        description: 'プロジェクト一覧取得成功',
        content: {
          'application/json': {
            schema: GetProjectListResponseSchema,
          },
        },
      },
      401: {
        description: '認証エラー',
      },
    },
  })
}

/** ページネーションメタ情報の型 */
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>

/** プロジェクト一覧レスポンスの型 */
export type GetProjectListResponse = z.infer<typeof GetProjectListResponseSchema>
```

**ポイント:**
- `request.query`でクエリパラメータを定義（`?page=1&per_page=15&is_active=true`）
- `PaginationMetaSchema`はプロジェクト以外の一覧APIでも再利用可能
- `ProjectSchema`を`base/`から読み込んで`z.array()`で配列化

#### 手順3: GET /api/projects/{id} — 詳細取得エンドポイント

`frontend/src/openapi/schemas/api/project/detail.ts`を新規作成します。

```typescript
import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { ProjectSchema } from '../../base/project/project'

extendZodWithOpenApi(z)

/**
 * プロジェクト詳細レスポンスのスキーマ
 */
export const GetProjectDetailResponseSchema = z.object({
  data: ProjectSchema,
})

/**
 * プロジェクト詳細取得エンドポイントをレジストリに登録する
 */
export function registerGetProjectDetailPath(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: 'get',
    path: '/api/projects/{id}',
    summary: 'プロジェクト詳細取得',
    description: '指定されたプロジェクトの詳細情報を取得します',
    tags: ['Projects'],
    request: {
      params: z.object({
        id: z.number().openapi({ example: 1 }),
      }),
    },
    responses: {
      200: {
        description: 'プロジェクト詳細取得成功',
        content: {
          'application/json': {
            schema: GetProjectDetailResponseSchema,
          },
        },
      },
      401: {
        description: '認証エラー',
      },
      404: {
        description: 'プロジェクトが見つかりません',
      },
    },
  })
}

/** プロジェクト詳細レスポンスの型 */
export type GetProjectDetailResponse = z.infer<typeof GetProjectDetailResponseSchema>
```

**ポイント:**
- URLパラメータ（`{id}`）は`request.params`で定義
- レスポンスは`{ data: Project }`の形式（一覧と統一した構造）
- 404レスポンスを定義（存在しないIDへのアクセス）

#### 手順4: PUT /api/projects/{id} — 更新エンドポイント

`frontend/src/openapi/schemas/api/project/update.ts`を新規作成します。

```typescript
import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { DateTimeSchema } from '../../base/shared/DateTimeSchema'
import { ProjectSchema } from '../../base/project/project'

extendZodWithOpenApi(z)

/**
 * プロジェクト更新リクエストのスキーマ
 */
export const UpdateProjectRequestSchema = z
  .object({
    name: z
      .string()
      .min(1, '案件名は必須です')
      .max(50, '案件名は50文字以内で入力してください')
      .describe('案件名')
      .openapi({ example: '案件A（更新）' }),
    amount: z
      .number()
      .min(0, '金額は0円以上で入力してください')
      .describe('金額')
      .openapi({ example: 1500000 }),
    description: z
      .string()
      .max(500, '案件の概要は500文字以内で入力してください')
      .describe('案件の概要')
      .openapi({ example: 'Webサイト開発プロジェクト（スコープ変更）' }),
    started_at: DateTimeSchema.nullable()
      .optional()
      .describe('着手日')
      .openapi({ example: '2024-01-01T00:00:00Z' }),
    ended_at: DateTimeSchema.nullable()
      .optional()
      .describe('完了日')
      .openapi({ example: '2025-03-31T23:59:59Z' }),
    is_active: z.boolean().describe('進行中フラグ').openapi({ example: true }),
  })
  .openapi('UpdateProjectRequest')

/**
 * プロジェクト更新レスポンスのスキーマ
 */
export const UpdateProjectResponseSchema = z.object({
  data: ProjectSchema,
})

/**
 * プロジェクト更新エンドポイントをレジストリに登録する
 */
export function registerUpdateProjectPath(registry: OpenAPIRegistry): void {
  registry.register('UpdateProjectRequest', UpdateProjectRequestSchema)

  registry.registerPath({
    method: 'put',
    path: '/api/projects/{id}',
    summary: 'プロジェクト更新',
    description: '指定されたプロジェクトを更新します',
    tags: ['Projects'],
    request: {
      params: z.object({
        id: z.number().openapi({ example: 1 }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateProjectRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'プロジェクト更新成功',
        content: {
          'application/json': {
            schema: UpdateProjectResponseSchema,
          },
        },
      },
      400: {
        description: 'バリデーションエラー',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
              errors: z.record(z.string(), z.array(z.string())),
            }),
          },
        },
      },
      401: {
        description: '認証エラー',
      },
      404: {
        description: 'プロジェクトが見つかりません',
      },
    },
  })
}

/** プロジェクト更新リクエストの型 */
export type UpdateProjectRequest = z.infer<typeof UpdateProjectRequestSchema>

/** プロジェクト更新レスポンスの型 */
export type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>
```

**ポイント:**
- `CreateProjectRequestSchema`とフィールドはほぼ同一だが、更新用に別スキーマとして定義（将来的にpartial updateに対応しやすくなる）
- URLパラメータ（`{id}`）とリクエストボディの両方を`request`に定義
- レスポンスは更新後のプロジェクトデータを返す

#### 手順5: DELETE /api/projects/{id} — 削除エンドポイント

`frontend/src/openapi/schemas/api/project/delete.ts`を新規作成します。

```typescript
import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

/**
 * プロジェクト削除レスポンスのスキーマ
 */
export const DeleteProjectResponseSchema = z.object({
  message: z.string().openapi({ example: 'プロジェクトを削除しました' }),
})

/**
 * プロジェクト削除エンドポイントをレジストリに登録する
 */
export function registerDeleteProjectPath(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: 'delete',
    path: '/api/projects/{id}',
    summary: 'プロジェクト削除',
    description: '指定されたプロジェクトを削除します（ソフトデリート）',
    tags: ['Projects'],
    request: {
      params: z.object({
        id: z.number().openapi({ example: 1 }),
      }),
    },
    responses: {
      200: {
        description: 'プロジェクト削除成功',
        content: {
          'application/json': {
            schema: DeleteProjectResponseSchema,
          },
        },
      },
      401: {
        description: '認証エラー',
      },
      404: {
        description: 'プロジェクトが見つかりません',
      },
    },
  })
}

/** プロジェクト削除レスポンスの型 */
export type DeleteProjectResponse = z.infer<typeof DeleteProjectResponseSchema>
```

**ポイント:**
- DELETEリクエストにはリクエストボディがない（URLパラメータのみ）
- レスポンスはメッセージのみ（削除されたデータは返さない）
- Projectモデルは`SoftDeletes`トレイトを使用しているため、物理削除ではなくソフトデリート

#### 手順6: generate-openapi.ts に登録関数を追加

`frontend/src/openapi/generate-openapi.ts`に新しい4つのregister関数を追加します。

```typescript
import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import * as fs from 'node:fs'
import * as yaml from 'yaml'
import { registerLoginPath } from './schemas/api/auth/login'
import { registerCreateProjectPath } from './schemas/api/project/create'
import { registerGetProjectListPath } from './schemas/api/project/list'       // ← 追加
import { registerGetProjectDetailPath } from './schemas/api/project/detail'   // ← 追加
import { registerUpdateProjectPath } from './schemas/api/project/update'     // ← 追加
import { registerDeleteProjectPath } from './schemas/api/project/delete'     // ← 追加
import { registerGetUserPath } from './schemas/api/user/get'

// Zodを拡張
extendZodWithOpenApi(z)

// レジストリを作成
const registry = new OpenAPIRegistry()

// ===== スキーマ・エンドポイントを登録 =====
registerLoginPath(registry)
registerCreateProjectPath(registry)
registerGetProjectListPath(registry)       // ← 追加
registerGetProjectDetailPath(registry)     // ← 追加
registerUpdateProjectPath(registry)        // ← 追加
registerDeleteProjectPath(registry)        // ← 追加
registerGetUserPath(registry)

// ===== OpenAPI仕様を生成 =====
// ...（以降は既存のまま）
```

**変更点:**
- 4つのimport文を追加
- 4つのregister関数呼び出しを追加
- 生成コマンド実行後、`openapi.yaml`に新しいエンドポイントが追加される

#### 手順7: OpenAPI仕様の生成とFormRequest自動生成

```bash
# フロントエンドディレクトリで OpenAPI YAML を生成
cd /workspace/frontend
npm run generate:openapi

# バックエンドディレクトリで FormRequest を自動生成
cd /workspace/backend
composer generate:requests
```

実行後に確認する内容:
- `backend/openapi/openapi.yaml`に全6エンドポイントが定義されている
- `backend/app/Http/Requests/UpdateProjectRequest.php`が新規生成されている
- `CreateProjectRequest.php`は既存のまま（変更なし）

### 確認ポイント

- [ ] REST原則（リソース名は複数形、HTTPメソッドと操作の対応）を説明できる
- [ ] `create.ts`のパターン（スキーマ定義 → registerPath → 型export）を理解している
- [ ] `base/`スキーマと`api/`スキーマの役割の違いを説明できる
- [ ] ページネーションレスポンスの構造（`data` + `meta`）を説明できる
- [ ] `npm run generate:openapi` → `composer generate:requests`パイプラインを実行できる
- [ ] `UpdateProjectRequest.php`が自動生成されていることを確認

---

## セクション2: バックエンドCRUD実装（オニオンアーキテクチャ）

### 学習目標

- オニオンアーキテクチャの各レイヤーの責務と実装方法を理解する
- Domain Entity（イミュータブル）とRepository Interfaceの設計を学ぶ
- Application UseCase → Infrastructure Repository → Presentation Controllerの依存方向を理解する
- ServiceProviderでのDIバインディングを習得する

### 解説

#### Auth実装との違い — なぜCRUDではオニオンアーキテクチャが必要か

認証処理（LoginController等）ではController内に直接ロジックを書きました。

```php
// LoginController — Controllerに直接実装
public function __invoke(LoginRequest $request): JsonResponse
{
    if (! Auth::attempt($request->only('email', 'password'))) { ... }
    $request->session()->regenerate();
    return response()->json(['message' => 'ログインしました。']);
}
```

これはシンプルな処理では問題ありませんが、CRUD操作ではビジネスロジックが複雑になる可能性があるため、レイヤー分離が重要になります。

| 項目 | Auth（Controller直接） | CRUD（オニオンアーキテクチャ） |
|------|----------------------|---------------------------|
| ビジネスロジック | 単純（認証試行のみ） | 複雑化の可能性（バリデーション、権限チェック、関連データ処理等） |
| テスタビリティ | Controllerのテストのみ | UseCase単位でユニットテスト可能 |
| 再利用性 | 低い | UseCaseは他のUI（CLI等）からも呼べる |
| 依存方向 | Controller → Laravel Auth | Controller → UseCase → Repository Interface ← 実装 |

#### データフロー図

```
リクエスト                                                    レスポンス
  │                                                            ↑
  ▼                                                            │
┌──────────────────────────────────────────────────────────────────────┐
│ Presentation層 (Controller)                                         │
│ - HTTPリクエストを受け取る                                              │
│ - FormRequestでバリデーション                                          │
│ - UseCaseを呼び出す                                                  │
│ - レスポンスJSONを返す                                                │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ UseCaseを呼ぶ
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Application層 (UseCase)                                              │
│ - ビジネスロジックのオーケストレーション                                    │
│ - Repository Interfaceを使ってデータアクセス                              │
│ - トランザクション管理                                                  │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ Repository Interfaceを呼ぶ
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│ Domain層 (Entity + Repository Interface)                             │
│ - ProjectEntity: ビジネスデータの構造を定義                               │
│ - ProjectRepositoryInterface: データアクセスの契約を定義                   │
│ ※ 実装は持たない（インターフェースのみ）                                    │
└──────────────────────────────────────────────────────────────────────┘
                           ↑ 実装する（依存性逆転）
┌──────────────────────────────────────────────────────────────────────┐
│ Infrastructure層 (EloquentProjectRepository)                         │
│ - Repository Interfaceの具体的な実装                                   │
│ - Eloquent ORMを使ってDBアクセス                                       │
│ - Entity ↔ Eloquent Model の変換                                     │
└──────────────────────────────────────────────────────────────────────┘
```

**重要: 依存性逆転の原則（DIP）**

通常、上位レイヤーは下位レイヤーに依存しますが、オニオンアーキテクチャでは**Domain層がRepository Interfaceを定義**し、Infrastructure層がそれを実装します。これにより:
- Domain層は外部技術（Eloquent, MySQL等）に依存しない
- Repository実装を差し替え可能（テスト時にインメモリ実装に置換等）
- ビジネスロジックが技術的詳細から独立する

### 実装手順

#### 手順1: Domain層 — ProjectEntity

`backend/app/Domains/Project/Entities/ProjectEntity.php`を新規作成します。

```php
<?php

declare(strict_types=1);

namespace Domains\Project\Entities;

/**
 * プロジェクトエンティティ
 *
 * イミュータブル（不変）なドメインオブジェクト。
 * ビジネスデータの構造を定義し、外部依存を持たない。
 */
readonly class ProjectEntity
{
    public function __construct(
        public int $id,
        public string $name,
        public float $amount,
        public string $description,
        public ?string $startedAt,
        public ?string $endedAt,
        public bool $isActive,
        public string $createdAt,
        public string $updatedAt,
    ) {}
}
```

**ポイント:**
- `readonly class`で宣言 — インスタンス作成後にプロパティを変更できない（イミュータブル）
- 名前空間は`Domains\Project\Entities`（`composer.json`のPSR-4オートロード設定に従う）
- Laravel（Eloquent, Carbon等）に依存しない — 純粋なPHPクラス
- プロパティ名はキャメルケース（PHPのコーディング規約）

#### 手順2: Domain層 — ProjectRepositoryInterface

`backend/app/Domains/Project/Repositories/ProjectRepositoryInterface.php`を新規作成します。

```php
<?php

declare(strict_types=1);

namespace Domains\Project\Repositories;

use Domains\Project\Entities\ProjectEntity;

/**
 * プロジェクトリポジトリインターフェース
 *
 * Domain層が定義するデータアクセスの契約。
 * 実装はInfrastructure層に委ねる。
 */
interface ProjectRepositoryInterface
{
    /**
     * ページネーション付きで一覧を取得
     *
     * @return array{data: ProjectEntity[], meta: array{current_page: int, last_page: int, per_page: int, total: int}}
     */
    public function paginate(int $perPage = 15, ?bool $isActive = null): array;

    /**
     * IDで1件取得
     */
    public function findById(int $id): ?ProjectEntity;

    /**
     * 新規作成
     */
    public function create(
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity;

    /**
     * 更新
     */
    public function update(
        int $id,
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity;

    /**
     * 削除（ソフトデリート）
     */
    public function delete(int $id): void;
}
```

**ポイント:**
- インターフェースなので実装コードは持たない
- 戻り値は`ProjectEntity`（Eloquent Modelではない）
- `paginate`の戻り値はPHPDocで配列の形状を明示
- Domain層の中で完結（外部依存なし）

#### 手順3: Application層 — UseCases

5つのUseCaseクラスを作成します。各UseCaseは1つの操作に対応します。

**`backend/app/Application/Project/UseCases/GetProjectListUseCase.php`**

```php
<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Repositories\ProjectRepositoryInterface;

class GetProjectListUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    /**
     * @return array{data: \Domains\Project\Entities\ProjectEntity[], meta: array{current_page: int, last_page: int, per_page: int, total: int}}
     */
    public function execute(int $perPage = 15, ?bool $isActive = null): array
    {
        return $this->repository->paginate($perPage, $isActive);
    }
}
```

**`backend/app/Application/Project/UseCases/GetProjectDetailUseCase.php`**

```php
<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Entities\ProjectEntity;
use Domains\Project\Repositories\ProjectRepositoryInterface;

class GetProjectDetailUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    public function execute(int $id): ?ProjectEntity
    {
        return $this->repository->findById($id);
    }
}
```

**`backend/app/Application/Project/UseCases/CreateProjectUseCase.php`**

```php
<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Entities\ProjectEntity;
use Domains\Project\Repositories\ProjectRepositoryInterface;

class CreateProjectUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    public function execute(
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity {
        return $this->repository->create(
            $name,
            $amount,
            $description,
            $startedAt,
            $endedAt,
            $isActive,
        );
    }
}
```

**`backend/app/Application/Project/UseCases/UpdateProjectUseCase.php`**

```php
<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Entities\ProjectEntity;
use Domains\Project\Repositories\ProjectRepositoryInterface;

class UpdateProjectUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    public function execute(
        int $id,
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity {
        return $this->repository->update(
            $id,
            $name,
            $amount,
            $description,
            $startedAt,
            $endedAt,
            $isActive,
        );
    }
}
```

**`backend/app/Application/Project/UseCases/DeleteProjectUseCase.php`**

```php
<?php

declare(strict_types=1);

namespace Application\Project\UseCases;

use Domains\Project\Repositories\ProjectRepositoryInterface;

class DeleteProjectUseCase
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $this->repository->delete($id);
    }
}
```

**UseCaseのポイント:**
- コンストラクタインジェクションでRepositoryInterfaceを受け取る（具体実装には依存しない）
- `execute()`メソッドで処理を実行（命名規則を統一）
- 現時点ではRepositoryの呼び出しのみだが、将来的にはここにビジネスロジック（権限チェック、入力値の追加検証、通知送信等）を追加する
- Application層はDomain層のみに依存する

#### 手順4: Infrastructure層 — EloquentProjectRepository

`backend/app/Infrastructure/Project/Repositories/EloquentProjectRepository.php`を新規作成します。

```php
<?php

declare(strict_types=1);

namespace Infrastructure\Project\Repositories;

use App\Models\Project;
use Domains\Project\Entities\ProjectEntity;
use Domains\Project\Repositories\ProjectRepositoryInterface;

class EloquentProjectRepository implements ProjectRepositoryInterface
{
    /**
     * {@inheritdoc}
     */
    public function paginate(int $perPage = 15, ?bool $isActive = null): array
    {
        $query = Project::query();

        if ($isActive !== null) {
            $query->where('is_active', $isActive);
        }

        $paginator = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return [
            'data' => collect($paginator->items())->map(
                fn (Project $model) => $this->toEntity($model)
            )->all(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function findById(int $id): ?ProjectEntity
    {
        $model = Project::find($id);

        if ($model === null) {
            return null;
        }

        return $this->toEntity($model);
    }

    /**
     * {@inheritdoc}
     */
    public function create(
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity {
        $model = Project::create([
            'name' => $name,
            'amount' => $amount,
            'description' => $description,
            'started_at' => $startedAt,
            'ended_at' => $endedAt,
            'is_active' => $isActive,
        ]);

        return $this->toEntity($model);
    }

    /**
     * {@inheritdoc}
     */
    public function update(
        int $id,
        string $name,
        float $amount,
        string $description,
        ?string $startedAt,
        ?string $endedAt,
        bool $isActive,
    ): ProjectEntity {
        $model = Project::findOrFail($id);

        $model->update([
            'name' => $name,
            'amount' => $amount,
            'description' => $description,
            'started_at' => $startedAt,
            'ended_at' => $endedAt,
            'is_active' => $isActive,
        ]);

        return $this->toEntity($model->fresh());
    }

    /**
     * {@inheritdoc}
     */
    public function delete(int $id): void
    {
        $model = Project::findOrFail($id);
        $model->delete(); // SoftDeletesにより論理削除
    }

    /**
     * Eloquent Model → Domain Entity に変換
     */
    private function toEntity(Project $model): ProjectEntity
    {
        return new ProjectEntity(
            id: $model->id,
            name: $model->name,
            amount: (float) $model->amount,
            description: $model->description,
            startedAt: $model->started_at?->toISOString(),
            endedAt: $model->ended_at?->toISOString(),
            isActive: $model->is_active,
            createdAt: $model->created_at->toISOString(),
            updatedAt: $model->updated_at->toISOString(),
        );
    }
}
```

**ポイント:**
- `implements ProjectRepositoryInterface` — Domain層が定義したインターフェースを実装
- `toEntity()`メソッドでEloquent Model → Domain Entityに変換（レイヤー間の境界）
- `$model->started_at?->toISOString()` — CarbonインスタンスをISO 8601文字列に変換
- `Project::findOrFail()` — 存在しない場合にModelNotFoundExceptionを投げる
- `$model->delete()` — SoftDeletesトレイトにより`deleted_at`に値がセットされる（物理削除ではない）
- Infrastructure層はDomain層のみに依存する（Application層には依存しない）

#### 手順5: Presentation層 — Controllers

5つのControllerを作成します。各Controllerは`__invoke()`メソッドを持つ単一責務クラスです。

**`backend/app/Http/Controllers/Project/GetListController.php`**

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Application\Project\UseCases\GetProjectListUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetListController extends Controller
{
    public function __construct(
        private readonly GetProjectListUseCase $useCase
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $isActive = $request->query('is_active');

        // クエリパラメータの型変換（"true"/"false" → bool）
        $isActiveBool = null;
        if ($isActive !== null) {
            $isActiveBool = filter_var($isActive, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        }

        $result = $this->useCase->execute($perPage, $isActiveBool);

        return response()->json([
            'data' => collect($result['data'])->map(fn ($entity) => $this->toArray($entity)),
            'meta' => $result['meta'],
        ]);
    }

    private function toArray(object $entity): array
    {
        return [
            'id' => $entity->id,
            'name' => $entity->name,
            'amount' => $entity->amount,
            'description' => $entity->description,
            'started_at' => $entity->startedAt,
            'ended_at' => $entity->endedAt,
            'is_active' => $entity->isActive,
            'created_at' => $entity->createdAt,
            'updated_at' => $entity->updatedAt,
        ];
    }
}
```

**`backend/app/Http/Controllers/Project/GetDetailController.php`**

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Application\Project\UseCases\GetProjectDetailUseCase;
use Illuminate\Http\JsonResponse;

class GetDetailController extends Controller
{
    public function __construct(
        private readonly GetProjectDetailUseCase $useCase
    ) {}

    public function __invoke(int $id): JsonResponse
    {
        $entity = $this->useCase->execute($id);

        if ($entity === null) {
            return response()->json(['message' => 'プロジェクトが見つかりません'], 404);
        }

        return response()->json([
            'data' => [
                'id' => $entity->id,
                'name' => $entity->name,
                'amount' => $entity->amount,
                'description' => $entity->description,
                'started_at' => $entity->startedAt,
                'ended_at' => $entity->endedAt,
                'is_active' => $entity->isActive,
                'created_at' => $entity->createdAt,
                'updated_at' => $entity->updatedAt,
            ],
        ]);
    }
}
```

**`backend/app/Http/Controllers/Project/CreateController.php`**

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProjectRequest;
use Application\Project\UseCases\CreateProjectUseCase;
use Illuminate\Http\JsonResponse;

class CreateController extends Controller
{
    public function __construct(
        private readonly CreateProjectUseCase $useCase
    ) {}

    public function __invoke(CreateProjectRequest $request): JsonResponse
    {
        $entity = $this->useCase->execute(
            name: $request->getName(),
            amount: $request->getAmount(),
            description: $request->getDescription(),
            startedAt: $request->getStartedAt(),
            endedAt: $request->getEndedAt(),
            isActive: $request->getIsActive() ?? true,
        );

        return response()->json([
            'id' => $entity->id,
            'name' => $entity->name,
            'amount' => $entity->amount,
            'description' => $entity->description,
            'started_at' => $entity->startedAt,
            'ended_at' => $entity->endedAt,
            'is_active' => $entity->isActive,
            'created_at' => $entity->createdAt,
            'updated_at' => $entity->updatedAt,
        ], 201);
    }
}
```

**`backend/app/Http/Controllers/Project/UpdateController.php`**

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProjectRequest;
use Application\Project\UseCases\UpdateProjectUseCase;
use Illuminate\Http\JsonResponse;

class UpdateController extends Controller
{
    public function __construct(
        private readonly UpdateProjectUseCase $useCase
    ) {}

    public function __invoke(UpdateProjectRequest $request, int $id): JsonResponse
    {
        $entity = $this->useCase->execute(
            id: $id,
            name: $request->getName(),
            amount: $request->getAmount(),
            description: $request->getDescription(),
            startedAt: $request->getStartedAt(),
            endedAt: $request->getEndedAt(),
            isActive: $request->getIsActive() ?? true,
        );

        return response()->json([
            'data' => [
                'id' => $entity->id,
                'name' => $entity->name,
                'amount' => $entity->amount,
                'description' => $entity->description,
                'started_at' => $entity->startedAt,
                'ended_at' => $entity->endedAt,
                'is_active' => $entity->isActive,
                'created_at' => $entity->createdAt,
                'updated_at' => $entity->updatedAt,
            ],
        ]);
    }
}
```

**`backend/app/Http/Controllers/Project/DeleteController.php`**

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use Application\Project\UseCases\DeleteProjectUseCase;
use Illuminate\Http\JsonResponse;

class DeleteController extends Controller
{
    public function __construct(
        private readonly DeleteProjectUseCase $useCase
    ) {}

    public function __invoke(int $id): JsonResponse
    {
        $this->useCase->execute($id);

        return response()->json([
            'message' => 'プロジェクトを削除しました',
        ]);
    }
}
```

**Controllerのポイント:**
- 各Controllerは`__invoke()`メソッドのみ持つ（単一責務、Laravelの**Single Action Controller**パターン）
- コンストラクタインジェクションでUseCaseを受け取る
- FormRequest（`CreateProjectRequest`, `UpdateProjectRequest`）がバリデーションを担当
- Entity → JSONレスポンスの変換をControllerが行う（キャメルケース → スネークケース）
- `LoginController`と同じ`__invoke`パターンだが、UseCaseを介してビジネスロジックを呼び出す点が異なる

#### 手順6: ルート定義

**`backend/routes/api/endpoints/projects.php`を新規作成:**

```php
<?php

declare(strict_types=1);

use App\Http\Controllers\Project\CreateController;
use App\Http\Controllers\Project\DeleteController;
use App\Http\Controllers\Project\GetDetailController;
use App\Http\Controllers\Project\GetListController;
use App\Http\Controllers\Project\UpdateController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', GetListController::class);
    Route::post('/projects', CreateController::class);
    Route::get('/projects/{id}', GetDetailController::class);
    Route::put('/projects/{id}', UpdateController::class);
    Route::delete('/projects/{id}', DeleteController::class);
});
```

**`backend/routes/index.php`を変更:**

```php
<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

require __DIR__.'/api/endpoints/auths.php';
require __DIR__.'/api/endpoints/projects.php';  // ← 追加
```

**ポイント:**
- 全プロジェクトエンドポイントは`auth:sanctum`ミドルウェアで保護（認証必須）
- `auths.php`と同じパターンでルートファイルを分離
- Single Action Controllerなので`Route::get('/projects', GetListController::class)`のように直接クラスを指定

#### 手順7: DIバインディング

**`backend/app/Providers/AppServiceProvider.php`を変更:**

```php
<?php

namespace App\Providers;

use Domains\Project\Repositories\ProjectRepositoryInterface;
use Infrastructure\Project\Repositories\EloquentProjectRepository;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository バインディング
        $this->app->bind(
            ProjectRepositoryInterface::class,
            EloquentProjectRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->defineGates();
    }

    /**
     * Gate（認可ルール）を定義
     */
    private function defineGates(): void
    {
        // 管理者権限
        Gate::define('admin', function ($user) {
            return $user->hasRole('admin');
        });

        // メンバー権限（admin も含む）
        Gate::define('member', function ($user) {
            return $user->hasRole('admin') || $user->hasRole('member');
        });
    }
}
```

**DIバインディングとは:**

```
$this->app->bind(
    ProjectRepositoryInterface::class,    // ← インターフェース（抽象）
    EloquentProjectRepository::class      // ← 実装（具象）
);
```

この一行で「`ProjectRepositoryInterface`を要求されたら`EloquentProjectRepository`を渡す」とLaravelのサービスコンテナに登録します。UseCaseのコンストラクタで`ProjectRepositoryInterface`を型指定すると、自動的に`EloquentProjectRepository`がインジェクトされます。

```
Controller
  └─→ UseCase(ProjectRepositoryInterface $repository)
                      ↑
       LaravelのDIコンテナが EloquentProjectRepository を注入
```

これが**依存性逆転**の実現方法です。UseCase（Application層）はInterface（Domain層）に依存し、具体的な実装（Infrastructure層）には依存しません。

### 確認ポイント

- [ ] Domain層のEntityが`readonly class`でイミュータブルであることを理解している
- [ ] Repository InterfaceがDomain層に配置される理由（依存性逆転）を説明できる
- [ ] UseCaseがRepository Interfaceに依存し、具体実装には依存しないことを確認
- [ ] `toEntity()`メソッドの役割（Eloquent Model → Domain Entity変換）を理解している
- [ ] `AppServiceProvider::register()`でのDIバインディングの仕組みを説明できる
- [ ] ルートファイルが`auth:sanctum`ミドルウェアで保護されていることを確認

---

## セクション3: フロントエンドAPI通信基盤の構築

### 学習目標

- `useAuth`から`apiFetch`を抽出して共有composable（`useApi`）を作成する
- プロジェクトCRUD用composable（`useProject`）を構築する
- ページネーションの型定義と状態管理を学ぶ

### 解説

#### composableの責務分離

現在の`useAuth.ts`には認証ロジックとAPI通信の基盤コード（`apiFetch`, `getCsrfToken`, `initCsrf`）が混在しています。

```
【現在の構造】
useAuth.ts
  ├── getCsrfToken()   ← API通信の共通処理
  ├── apiFetch()       ← API通信の共通処理
  ├── initCsrf()       ← API通信の共通処理
  ├── fetchUser()      ← 認証固有の処理
  ├── init()           ← 認証固有の処理
  ├── login()          ← 認証固有の処理
  └── logout()         ← 認証固有の処理

【改善後の構造】
useApi.ts              ← API通信の共通基盤（新規）
  ├── getCsrfToken()
  ├── apiFetch()
  └── initCsrf()

useAuth.ts             ← 認証状態管理（useApiを内部使用）
  ├── fetchUser()
  ├── init()
  ├── login()
  └── logout()

useProject.ts          ← プロジェクトCRUD（useApiを使用、新規）
  ├── fetchProjects()
  ├── fetchProject()
  ├── createProject()
  ├── updateProject()
  └── deleteProject()
```

この分離により:
- **DRY原則**: `apiFetch`を複数のcomposableで共有できる
- **単一責務**: 各composableが1つの関心事に集中
- **拡張性**: 新しいリソース（タスク、作業ログ等）のcomposable追加が容易

#### ページネーション型の定義

フロントエンドでページネーション情報を扱うための型を定義します。

```typescript
// OpenAPIスキーマで定義した型を再利用
import type { PaginationMeta } from '~~/src/openapi/schemas/api/project/list'

// PaginationMeta = {
//   current_page: number
//   last_page: number
//   per_page: number
//   total: number
// }
```

### 実装手順

#### 手順1: useApi.ts の作成

`frontend/app/composables/useApi.ts`を新規作成します。`useAuth.ts`から`getCsrfToken`, `apiFetch`, `initCsrf`を抽出します。

```typescript
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

/**
 * API通信の共通基盤composable
 *
 * CSRF トークン管理と認証Cookie付きのfetch関数を提供する。
 * useAuth, useProject 等の各composableから内部的に使用される。
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  /**
   * CookieからCSRFトークンを取得
   */
  const getCsrfToken = (): string | undefined => {
    return useCookie('XSRF-TOKEN').value ?? undefined
  }

  /**
   * 認証Cookie付きAPIリクエスト
   */
  const apiFetch = async <T>(
    path: string,
    options: NitroFetchOptions<NitroFetchRequest> = {}
  ): Promise<T> => {
    const csrfToken = getCsrfToken()

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) } : {}),
    }

    return await $fetch<T>(path, {
      baseURL: apiBase,
      credentials: 'include',
      headers,
      ...options,
    })
  }

  /**
   * CSRF Cookie の初期化
   */
  const initCsrf = async (): Promise<void> => {
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: apiBase,
      credentials: 'include',
    })
  }

  return {
    apiFetch,
    initCsrf,
  }
}
```

**ポイント:**
- `useAuth.ts`にあった3つの関数をそのまま移動
- `getCsrfToken`は内部でのみ使用するためexportしない
- 戻り値は`apiFetch`と`initCsrf`のみ（外部に必要な最小限のAPI）

#### 手順2: useAuth.ts の書き換え

`frontend/app/composables/useAuth.ts`を`useApi`を内部使用するように変更します。

```typescript
import type { User } from '~~/src/openapi/schemas/base/user'
import type { GetUserResponse } from '~~/src/openapi/schemas/api/user/get'

export const useAuth = () => {
  const { apiFetch, initCsrf } = useApi()  // ← useApiから取得

  const user = useState<User | null>('auth-user', () => null)
  const isInitialized = useState<boolean>('auth-initialized', () => false)

  const isAuthenticated = computed(() => user.value !== null)

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await apiFetch<GetUserResponse>('/api/user')
      user.value = response.user
    } catch {
      user.value = null
    }
  }

  const init = async (): Promise<void> => {
    if (isInitialized.value) return

    await initCsrf()
    await fetchUser()
    isInitialized.value = true
  }

  const login = async (email: string, password: string): Promise<void> => {
    await initCsrf()
    await apiFetch('/api/login', {
      method: 'POST',
      body: { email, password },
    })
    await fetchUser()
  }

  const logout = async (): Promise<void> => {
    await apiFetch('/api/logout', {
      method: 'POST',
    })
    user.value = null
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isInitialized: readonly(isInitialized),
    init,
    login,
    logout,
    fetchUser,
  }
}
```

**変更点のまとめ:**

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| `getCsrfToken` | `useAuth`内で定義 | `useApi`に移動（内部関数） |
| `apiFetch` | `useAuth`内で定義 | `useApi`から取得 |
| `initCsrf` | `useAuth`内で定義 | `useApi`から取得 |
| import | `NitroFetchOptions`等 | 不要に（`useApi`が内部管理） |
| `config`, `apiBase` | `useAuth`内で定義 | 不要に（`useApi`が内部管理） |

#### 手順3: useProject.ts の作成

`frontend/app/composables/useProject.ts`を新規作成します。

```typescript
import type { Project } from '~~/src/openapi/schemas/base/project/project'
import type { GetProjectListResponse, PaginationMeta } from '~~/src/openapi/schemas/api/project/list'
import type { GetProjectDetailResponse } from '~~/src/openapi/schemas/api/project/detail'
import type { CreateProjectRequest, CreateProjectResponse } from '~~/src/openapi/schemas/api/project/create'
import type { UpdateProjectRequest, UpdateProjectResponse } from '~~/src/openapi/schemas/api/project/update'
import type { DeleteProjectResponse } from '~~/src/openapi/schemas/api/project/delete'

export const useProject = () => {
  const { apiFetch } = useApi()

  const projects = ref<Project[]>([])
  const project = ref<Project | null>(null)
  const meta = ref<PaginationMeta | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * プロジェクト一覧を取得
   */
  const fetchProjects = async (params: {
    page?: number
    per_page?: number
    is_active?: boolean
  } = {}): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const query = new URLSearchParams()
      if (params.page) query.set('page', String(params.page))
      if (params.per_page) query.set('per_page', String(params.per_page))
      if (params.is_active !== undefined) query.set('is_active', String(params.is_active))

      const queryString = query.toString()
      const path = `/api/projects${queryString ? `?${queryString}` : ''}`

      const response = await apiFetch<GetProjectListResponse>(path)
      projects.value = response.data
      meta.value = response.meta
    } catch {
      error.value = 'プロジェクト一覧の取得に失敗しました'
    } finally {
      loading.value = false
    }
  }

  /**
   * プロジェクト詳細を取得
   */
  const fetchProject = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiFetch<GetProjectDetailResponse>(`/api/projects/${id}`)
      project.value = response.data
    } catch {
      error.value = 'プロジェクトの取得に失敗しました'
    } finally {
      loading.value = false
    }
  }

  /**
   * プロジェクトを作成
   */
  const createProject = async (data: CreateProjectRequest): Promise<CreateProjectResponse> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiFetch<CreateProjectResponse>('/api/projects', {
        method: 'POST',
        body: data,
      })
      return response
    } finally {
      loading.value = false
    }
  }

  /**
   * プロジェクトを更新
   */
  const updateProject = async (id: number, data: UpdateProjectRequest): Promise<UpdateProjectResponse> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiFetch<UpdateProjectResponse>(`/api/projects/${id}`, {
        method: 'PUT',
        body: data,
      })
      return response
    } finally {
      loading.value = false
    }
  }

  /**
   * プロジェクトを削除
   */
  const deleteProject = async (id: number): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      await apiFetch<DeleteProjectResponse>(`/api/projects/${id}`, {
        method: 'DELETE',
      })
    } finally {
      loading.value = false
    }
  }

  return {
    projects: readonly(projects),
    project: readonly(project),
    meta: readonly(meta),
    loading: readonly(loading),
    error: readonly(error),
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
  }
}
```

**ポイント:**
- `useApi()`から`apiFetch`を取得して使用（認証Cookie付きリクエストが自動適用）
- 状態（`projects`, `project`, `meta`, `loading`, `error`）をcomposable内で管理
- `readonly()`で外部からの直接変更を防止
- `createProject`と`updateProject`はレスポンスを返す（呼び出し元でリダイレクト判断等に使う）
- `deleteProject`はレスポンスを返さない（成功したら完了）
- エラーハンドリング: `fetchProjects`/`fetchProject`は内部でcatch、`createProject`/`updateProject`は呼び出し元にthrow（フォームエラー表示のため）

### 確認ポイント

- [ ] `useApi`が`useAuth`から正しく抽出されていることを確認
- [ ] `useAuth`を書き換えた後、既存の認証機能（ログイン・ログアウト）が壊れていないことを確認
- [ ] `useProject`の各メソッドが正しいHTTPメソッドとパスを使用していることを確認
- [ ] `readonly()`で返される状態が外部から直接変更できないことを理解している
- [ ] ページネーション型（`PaginationMeta`）がOpenAPIスキーマから導出されていることを確認

---

## セクション4: フロントエンドプロジェクト画面の実装

### 学習目標

- 一覧画面（テーブル表示+ページネーション+フィルタ）を実装する
- 作成・編集画面の共通フォームパターン（mode prop）を学ぶ
- 詳細画面と削除確認フローを実装する
- 新しいAtomic Designコンポーネント（TextArea, Pagination, ProjectForm）を作成する

### 解説

#### Nuxt 3の動的ルーティング

ファイル名に`[id]`を使うと、その部分がURLパラメータになります。

```
pages/
├── projects/
│   ├── index.vue        → /projects          （一覧）
│   ├── create.vue       → /projects/create   （作成）
│   ├── [id].vue         → /projects/1        （詳細、idは動的）
│   └── [id]/
│       └── edit.vue     → /projects/1/edit   （編集、idは動的）
```

ページコンポーネント内で`useRoute()`を使ってパラメータを取得します。

```typescript
const route = useRoute()
const id = Number(route.params.id)  // URLの[id]部分を取得
```

#### フォーム共通化パターン

作成フォームと編集フォームはフィールドが同じです。`ProjectForm`コンポーネントを作成し、`mode` propで挙動を切り替えます。

```
ProjectForm（Organism）
  ├── mode: 'create' → 送信ボタン「作成」、初期値は空
  └── mode: 'edit'   → 送信ボタン「更新」、初期値はAPIから取得したデータ
```

#### useRoute / useRouter / navigateTo の使い分け

| API | 用途 | 例 |
|-----|------|-----|
| `useRoute()` | 現在のルート情報を**読み取る** | `route.params.id`, `route.path` |
| `useRouter()` | ルーターインスタンスを取得（`back()`等） | `router.back()` |
| `navigateTo()` | プログラム的に画面遷移する | `navigateTo('/projects')` |

### 実装手順

#### 手順1: Atoms — TextArea.vue

`frontend/app/components/atoms/TextArea.vue`を新規作成します。

```vue
<script setup lang="ts">
interface Props {
  id?: string
  placeholder?: string
  rows?: number
  error?: boolean
  disabled?: boolean
}

const { rows = 3, error = false, disabled = false } = defineProps<Props>()

const model = defineModel<string>()
</script>

<template>
  <textarea
    :id="id"
    v-model="model"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    class="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1"
    :class="
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    "
  />
</template>
```

**ポイント:**
- `Input.vue`と同じパターン（`defineModel`, `error` prop, 同じスタイルクラス）
- `rows` propでテキストエリアの行数を指定（デフォルト3行）
- Atomic Design: 最小単位のUI部品（Atom）

#### 手順2: Molecules — Pagination.vue

`frontend/app/components/molecules/Pagination.vue`を新規作成します。

```vue
<script setup lang="ts">
interface Props {
  currentPage: number
  lastPage: number
  total: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const hasPrev = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.lastPage)

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.lastPage) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-between border-t border-gray-200 pt-4">
    <!-- 件数表示 -->
    <p class="text-sm text-gray-500">
      全 {{ total }} 件中 {{ currentPage }} / {{ lastPage }} ページ
    </p>

    <!-- ページ切り替えボタン -->
    <div class="flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        :disabled="!hasPrev"
        @click="goToPage(currentPage - 1)"
      >
        前へ
      </Button>
      <Button
        variant="secondary"
        size="sm"
        :disabled="!hasNext"
        @click="goToPage(currentPage + 1)"
      >
        次へ
      </Button>
    </div>
  </div>
</template>
```

**ポイント:**
- `Button`（Atom）を使用 — Molecules層はAtomsのみに依存
- `emit('update:currentPage', page)`でページ変更を親に通知
- `hasPrev`/`hasNext`はcomputedで自動計算

#### 手順3: Organisms — ProjectForm.vue

`frontend/app/components/organisms/ProjectForm.vue`を新規作成します。

```vue
<script setup lang="ts">
import { CreateProjectRequestSchema, type CreateProjectRequest } from '~~/src/openapi/schemas/api/project/create'

interface Props {
  mode: 'create' | 'edit'
  initialData?: Partial<CreateProjectRequest>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  initialData: () => ({}),
})

const emit = defineEmits<{
  submit: [data: CreateProjectRequest]
}>()

const form = reactive<CreateProjectRequest>({
  name: props.initialData.name ?? '',
  amount: props.initialData.amount ?? 0,
  description: props.initialData.description ?? '',
  started_at: props.initialData.started_at ?? null,
  ended_at: props.initialData.ended_at ?? null,
  is_active: props.initialData.is_active ?? true,
})

const fieldErrors = ref<Record<string, string[]>>({})

const handleSubmit = () => {
  fieldErrors.value = {}

  const result = CreateProjectRequestSchema.safeParse(form)
  if (!result.success) {
    fieldErrors.value = result.error.flatten().fieldErrors as Record<string, string[]>
    return
  }

  emit('submit', result.data)
}

const submitLabel = computed(() => {
  if (props.loading) return '処理中...'
  return props.mode === 'create' ? '作成' : '更新'
})
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- 案件名 -->
    <FormField
      v-model="form.name"
      label="案件名"
      field-id="name"
      :error="fieldErrors.name?.[0]"
      placeholder="案件名を入力"
    />

    <!-- 金額 -->
    <div>
      <AppLabel for="amount">金額</AppLabel>
      <Input
        id="amount"
        v-model="form.amount"
        type="number"
        :error="!!fieldErrors.amount"
        placeholder="0"
      />
      <p v-if="fieldErrors.amount" class="mt-1 text-sm text-red-600">
        {{ fieldErrors.amount[0] }}
      </p>
    </div>

    <!-- 概要 -->
    <div>
      <AppLabel for="description">概要</AppLabel>
      <TextArea
        id="description"
        v-model="form.description"
        :rows="4"
        :error="!!fieldErrors.description"
        placeholder="プロジェクトの概要を入力"
      />
      <p v-if="fieldErrors.description" class="mt-1 text-sm text-red-600">
        {{ fieldErrors.description[0] }}
      </p>
    </div>

    <!-- 着手日 -->
    <FormField
      v-model="form.started_at"
      label="着手日"
      field-id="started_at"
      type="datetime-local"
      :error="fieldErrors.started_at?.[0]"
    />

    <!-- 完了日 -->
    <FormField
      v-model="form.ended_at"
      label="完了日"
      field-id="ended_at"
      type="datetime-local"
      :error="fieldErrors.ended_at?.[0]"
    />

    <!-- 進行中フラグ -->
    <div class="flex items-center gap-2">
      <input
        id="is_active"
        v-model="form.is_active"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <AppLabel for="is_active">進行中</AppLabel>
    </div>

    <!-- 送信ボタン -->
    <div class="flex gap-3">
      <Button
        type="submit"
        :loading="loading"
        :disabled="loading"
      >
        {{ submitLabel }}
      </Button>
      <Button
        variant="secondary"
        @click="navigateTo('/projects')"
      >
        キャンセル
      </Button>
    </div>
  </form>
</template>
```

**ポイント:**
- `mode` prop で作成/編集を切り替え（ボタンラベル変更）
- `initialData` prop で編集時の初期値を受け取る
- Zodスキーマ（`CreateProjectRequestSchema`）でクライアントバリデーション
- `emit('submit', data)` — バリデーション通過後のデータを親コンポーネントに渡す
- Atomic Design: FormField（Molecule）、TextArea/Button/Input（Atom）を組み合わせたOrganism

#### 手順4: Pages — プロジェクト一覧

`frontend/app/pages/projects/index.vue`を新規作成します。

```vue
<script setup lang="ts">
const { projects, meta, loading, error, fetchProjects } = useProject()

const currentPage = ref(1)
const isActiveFilter = ref<boolean | undefined>(undefined)

const loadProjects = async () => {
  await fetchProjects({
    page: currentPage.value,
    is_active: isActiveFilter.value,
  })
}

// 初回ロード
await loadProjects()

// ページ変更時に再取得
watch(currentPage, () => loadProjects())

// フィルタ変更時に1ページ目から再取得
watch(isActiveFilter, () => {
  currentPage.value = 1
  loadProjects()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">プロジェクト一覧</h1>
      <Button @click="navigateTo('/projects/create')">
        新規作成
      </Button>
    </div>

    <!-- フィルタ -->
    <div class="mb-4">
      <select
        v-model="isActiveFilter"
        class="rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option :value="undefined">すべて</option>
        <option :value="true">進行中</option>
        <option :value="false">完了</option>
      </select>
    </div>

    <!-- エラー表示 -->
    <p v-if="error" class="mb-4 text-sm text-red-600">{{ error }}</p>

    <!-- ローディング -->
    <p v-if="loading" class="text-gray-500">読み込み中...</p>

    <!-- テーブル -->
    <div v-else-if="projects.length > 0" class="overflow-hidden rounded-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">案件名</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">金額</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ステータス</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="p in projects" :key="p.id">
            <td class="px-6 py-4">
              <NuxtLink
                :to="`/projects/${p.id}`"
                class="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {{ p.name }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">
              {{ p.amount.toLocaleString() }}円
            </td>
            <td class="px-6 py-4">
              <Badge :variant="p.is_active ? 'success' : 'default'">
                {{ p.is_active ? '進行中' : '完了' }}
              </Badge>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <Button size="sm" variant="secondary" @click="navigateTo(`/projects/${p.id}/edit`)">
                  編集
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 空状態 -->
    <p v-else class="text-gray-500">プロジェクトがありません。</p>

    <!-- ページネーション -->
    <Pagination
      v-if="meta && meta.last_page > 1"
      :current-page="meta.current_page"
      :last-page="meta.last_page"
      :total="meta.total"
      @update:current-page="currentPage = $event"
    />
  </div>
</template>
```

**ポイント:**
- `useProject()`のcomposableで状態管理とAPI通信を行う
- `watch`でページ変更・フィルタ変更時に自動再取得
- `Badge`コンポーネントでステータスを視覚的に表示
- `Pagination`コンポーネントは`meta.last_page > 1`の時のみ表示

#### 手順5: Pages — プロジェクト作成

`frontend/app/pages/projects/create.vue`を新規作成します。

```vue
<script setup lang="ts">
import type { CreateProjectRequest } from '~~/src/openapi/schemas/api/project/create'

const { createProject, loading } = useProject()

const serverError = ref('')

const handleSubmit = async (data: CreateProjectRequest) => {
  serverError.value = ''
  try {
    await createProject(data)
    await navigateTo('/projects')
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'data' in e) {
      const errData = (e as { data: { message?: string } }).data
      serverError.value = errData.message ?? '作成に失敗しました'
    } else {
      serverError.value = '作成に失敗しました'
    }
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h1 class="mb-6 text-2xl font-bold text-gray-900">プロジェクト作成</h1>

    <p v-if="serverError" class="mb-4 text-sm text-red-600">{{ serverError }}</p>

    <ProjectForm
      mode="create"
      :loading="loading"
      @submit="handleSubmit"
    />
  </div>
</template>
```

**ポイント:**
- `ProjectForm`（Organism）に処理を委譲 — ページはシンプルに保つ
- 作成成功後に`navigateTo('/projects')`で一覧に戻る
- サーバーエラーはページ側で表示（フォームバリデーションはOrganismが担当）

#### 手順6: Pages — プロジェクト詳細

`frontend/app/pages/projects/[id].vue`を新規作成します。

```vue
<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)

const { project, loading, error, fetchProject, deleteProject } = useProject()

const showDeleteConfirm = ref(false)

await fetchProject(id)

const handleDelete = async () => {
  try {
    await deleteProject(id)
    await navigateTo('/projects')
  } catch {
    // エラーはuseProject内で処理
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <p v-if="loading" class="text-gray-500">読み込み中...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <template v-else-if="project">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">{{ project.name }}</h1>
        <div class="flex gap-2">
          <Button variant="secondary" @click="navigateTo(`/projects/${id}/edit`)">
            編集
          </Button>
          <Button variant="danger" @click="showDeleteConfirm = true">
            削除
          </Button>
        </div>
      </div>

      <!-- 詳細情報 -->
      <div class="rounded-lg border border-gray-200 bg-white p-6">
        <dl class="space-y-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">金額</dt>
            <dd class="mt-1 text-gray-900">{{ project.amount.toLocaleString() }}円</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">概要</dt>
            <dd class="mt-1 whitespace-pre-wrap text-gray-900">{{ project.description }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">ステータス</dt>
            <dd class="mt-1">
              <Badge :variant="project.is_active ? 'success' : 'default'">
                {{ project.is_active ? '進行中' : '完了' }}
              </Badge>
            </dd>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">着手日</dt>
              <dd class="mt-1 text-gray-900">{{ project.started_at ?? '未設定' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">完了日</dt>
              <dd class="mt-1 text-gray-900">{{ project.ended_at ?? '未設定' }}</dd>
            </div>
          </div>
        </dl>
      </div>

      <!-- 削除確認 -->
      <div
        v-if="showDeleteConfirm"
        class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4"
      >
        <p class="text-sm text-red-800">
          「{{ project.name }}」を削除しますか？この操作は取り消せません。
        </p>
        <div class="mt-3 flex gap-2">
          <Button variant="danger" size="sm" @click="handleDelete">
            削除する
          </Button>
          <Button variant="secondary" size="sm" @click="showDeleteConfirm = false">
            キャンセル
          </Button>
        </div>
      </div>
    </template>

    <div class="mt-6">
      <Button variant="secondary" @click="navigateTo('/projects')">
        一覧に戻る
      </Button>
    </div>
  </div>
</template>
```

**ポイント:**
- `useRoute().params.id`でURLパラメータを取得
- 削除は2段階確認（`showDeleteConfirm`フラグ）
- 削除成功後に一覧ページへ遷移
- `<dl>`（定義リスト）で詳細情報を構造化

#### 手順7: Pages — プロジェクト編集

`frontend/app/pages/projects/[id]/edit.vue`を新規作成します。

```vue
<script setup lang="ts">
import type { CreateProjectRequest } from '~~/src/openapi/schemas/api/project/create'

const route = useRoute()
const id = Number(route.params.id)

const { project, loading, fetchProject, updateProject } = useProject()

const serverError = ref('')

await fetchProject(id)

const handleSubmit = async (data: CreateProjectRequest) => {
  serverError.value = ''
  try {
    await updateProject(id, data)
    await navigateTo(`/projects/${id}`)
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'data' in e) {
      const errData = (e as { data: { message?: string } }).data
      serverError.value = errData.message ?? '更新に失敗しました'
    } else {
      serverError.value = '更新に失敗しました'
    }
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h1 class="mb-6 text-2xl font-bold text-gray-900">プロジェクト編集</h1>

    <p v-if="loading && !project" class="text-gray-500">読み込み中...</p>

    <template v-else-if="project">
      <p v-if="serverError" class="mb-4 text-sm text-red-600">{{ serverError }}</p>

      <ProjectForm
        mode="edit"
        :initial-data="{
          name: project.name,
          amount: project.amount,
          description: project.description,
          started_at: project.started_at,
          ended_at: project.ended_at,
          is_active: project.is_active,
        }"
        :loading="loading"
        @submit="handleSubmit"
      />
    </template>
  </div>
</template>
```

**ポイント:**
- `fetchProject(id)`でデータを取得し、`ProjectForm`の`:initial-data`に渡す
- `mode="edit"`で更新モードに切り替え（ボタンラベルが「更新」になる）
- 更新成功後は詳細ページ（`/projects/${id}`）にリダイレクト
- 作成ページ（`create.vue`）とほぼ同じ構造 — `ProjectForm`による共通化の効果

### 確認ポイント

- [ ] `TextArea.vue`が`Input.vue`と同じパターン（`defineModel`, `error` prop）で実装されていることを確認
- [ ] `Pagination.vue`が`emit`でページ変更を通知することを理解している
- [ ] `ProjectForm.vue`が`mode` propで作成/編集を切り替えることを理解している
- [ ] 動的ルーティング（`[id].vue`）でURLパラメータを取得する方法を理解している
- [ ] 削除確認フロー（2段階確認）が実装されていることを確認
- [ ] 各ページがAtomic Designの階層に従ってコンポーネントを使い分けていることを確認

---

## セクション5: 動作確認とトラブルシューティング

### 学習目標

- CRUD操作の一連のフロー（一覧→作成→詳細→編集→削除）を確認する
- バリデーションエラー（クライアント/サーバー）を検証する
- オニオンアーキテクチャ各レイヤーの問題を切り分けられる

### 解説

プロジェクト管理のCRUD実装では、フロントエンド（Vue/Nuxt）とバックエンド（Laravel/オニオンアーキテクチャ）の両方が正しく連携する必要があります。問題発生時にどのレイヤーに原因があるかを特定するスキルが重要です。

### 実装手順

#### 手順1: 環境準備

```bash
# 1. バックエンドの起動
cd /workspace/backend
php artisan migrate       # テーブルが最新か確認
composer dev              # Laravel + Queue + Vite起動

# 2. フロントエンドの起動
cd /workspace/frontend
npm run dev               # 開発サーバー起動（http://localhost:5173）
```

#### 手順2: テストデータの準備

初期状態ではプロジェクトが存在しないため、シーダーでテストデータを作成します。

`backend/database/seeders/ProjectSeeder.php`を使うか、最初のテストとして手動でプロジェクトを作成します。

#### 手順3: CRUDフローの確認

**テスト1: プロジェクト作成**

1. ログイン後、サイドバーの「プロジェクト」をクリック
2. 一覧ページで「新規作成」ボタンをクリック
3. フォームに以下を入力:
   - 案件名: `テストプロジェクト`
   - 金額: `1000000`
   - 概要: `テスト用のプロジェクトです`
   - 進行中: チェック
4. 「作成」ボタンをクリック
5. 確認: 一覧ページにリダイレクトされ、作成したプロジェクトが表示される

**テスト2: プロジェクト一覧確認**

1. 一覧ページでプロジェクトが表示されていることを確認
2. 案件名、金額、ステータスが正しく表示されていることを確認
3. DevTools > Network で`GET /api/projects` → 200を確認

**テスト3: プロジェクト詳細確認**

1. 一覧ページでプロジェクト名をクリック
2. 詳細ページで全フィールドが正しく表示されることを確認
3. DevTools > Network で`GET /api/projects/{id}` → 200を確認

**テスト4: プロジェクト編集**

1. 詳細ページで「編集」ボタンをクリック
2. フォームに既存データが入力されていることを確認
3. 案件名を変更して「更新」ボタンをクリック
4. 確認: 詳細ページにリダイレクトされ、更新内容が反映されている

**テスト5: プロジェクト削除**

1. 詳細ページで「削除」ボタンをクリック
2. 削除確認メッセージが表示されることを確認
3. 「削除する」ボタンをクリック
4. 確認: 一覧ページにリダイレクトされ、削除したプロジェクトが表示されない

#### 手順4: ページネーションテスト

テストデータが少ない場合は、複数のプロジェクトを作成してからテストします。

1. 16件以上のプロジェクトを作成（デフォルトの`per_page`は15）
2. 一覧ページでページネーションが表示されることを確認
3. 「次へ」ボタンをクリックして2ページ目が表示されることを確認
4. 「前へ」ボタンをクリックして1ページ目に戻ることを確認

#### 手順5: フィルタテスト

1. 一覧ページのセレクトボックスで「進行中」を選択
2. 進行中のプロジェクトのみ表示されることを確認
3. 「完了」を選択して、完了プロジェクトのみ表示されることを確認
4. 「すべて」に戻して全プロジェクトが表示されることを確認

#### 手順6: バリデーションテスト

**クライアントバリデーション（Zod）:**

1. 作成フォームで案件名を空にして送信 → 「案件名は必須です」と表示
2. 案件名を51文字以上にして送信 → 「案件名は50文字以内で入力してください」と表示
3. 概要を501文字以上にして送信 → 「案件の概要は500文字以内で入力してください」と表示
4. NetworkタブでAPIリクエストが送信されていないことを確認（クライアント側で止まっている）

**サーバーバリデーション（FormRequest）:**

1. Zodバリデーションを通過するが、サーバー側で拒否されるケースがあれば確認
2. DevTools > Networkで422レスポンスのbodyを確認

#### 手順7: トラブルシューティング

| 症状 | 原因のレイヤー | 確認方法 | 解決方法 |
|------|-------------|---------|---------|
| 一覧が空（データはあるはず） | Infrastructure | `php artisan tinker`で`Project::all()`を実行 | EloquentProjectRepositoryの`paginate()`を確認 |
| 404エラー（API） | Presentation | `php artisan route:list`でルートを確認 | `routes/api/endpoints/projects.php`とindex.phpのrequireを確認 |
| 500エラー（API） | Infrastructure/Application | `storage/logs/laravel.log`でエラー詳細を確認 | DIバインディング（AppServiceProvider）を確認 |
| クラスが見つからない | 全レイヤー | エラーメッセージの名前空間を確認 | `composer.json`のPSR-4オートロード設定と名前空間の一致を確認 |
| 「Target [Interface] is not instantiable」 | DIバインディング | AppServiceProviderのregisterメソッドを確認 | `$this->app->bind(Interface, Implementation)`を追加 |
| フロントエンドでCORSエラー | Presentation | DevTools > Networkのレスポンスヘッダーを確認 | `config/cors.php`のパスに`api/*`が含まれているか確認 |
| フォームの初期値が空（編集画面） | Frontend | `useProject`の`fetchProject`レスポンスを確認 | `ProjectForm`の`:initial-data`にproject dataが渡されているか確認 |
| ページネーションが表示されない | Frontend/Backend | APIレスポンスのmeta情報を確認 | `last_page`が1より大きいか確認。データ件数が`per_page`を超えているか確認 |
| 削除しても一覧に表示される | Infrastructure | DBの`deleted_at`カラムを確認 | `SoftDeletes`トレイトが正しく適用されているか確認 |

**レイヤー別デバッグの優先順位:**

```
① Presentation層 — ルートが正しいか？（php artisan route:list）
② Infrastructure層 — DIバインディングは設定済みか？（AppServiceProvider）
③ Application層 — UseCaseのロジックにエラーはないか？（ログ確認）
④ Domain層 — Entity/Interfaceの型は正しいか？（名前空間確認）
⑤ Frontend — APIレスポンスのパースは正しいか？（DevTools > Network）
```

### 確認ポイント

- [ ] CRUD一連のフロー（作成→一覧→詳細→編集→削除）が全て動作する
- [ ] ページネーションが正しく動作する（複数ページへの遷移）
- [ ] is_activeフィルタが正しく動作する
- [ ] クライアントバリデーション（Zod）がフォーム送信前にエラーを表示する
- [ ] サーバーバリデーション（FormRequest）のエラーがフロントエンドに表示される
- [ ] トラブルシューティング表を使ってレイヤー別に問題を切り分けられる
- [ ] `php artisan route:list`でプロジェクトの全ルートが表示されることを確認

---

## 作成・変更ファイル一覧

| ファイル | 操作 | セクション |
|---------|------|-----------|
| `frontend/src/openapi/schemas/base/project/project.ts` | 新規 | セクション1 |
| `frontend/src/openapi/schemas/api/project/list.ts` | 新規 | セクション1 |
| `frontend/src/openapi/schemas/api/project/detail.ts` | 新規 | セクション1 |
| `frontend/src/openapi/schemas/api/project/update.ts` | 新規 | セクション1 |
| `frontend/src/openapi/schemas/api/project/delete.ts` | 新規 | セクション1 |
| `frontend/src/openapi/generate-openapi.ts` | 変更 | セクション1 |
| `backend/openapi/openapi.yaml` | 自動生成 | セクション1 |
| `backend/app/Http/Requests/UpdateProjectRequest.php` | 自動生成 | セクション1 |
| `backend/app/Domains/Project/Entities/ProjectEntity.php` | 新規 | セクション2 |
| `backend/app/Domains/Project/Repositories/ProjectRepositoryInterface.php` | 新規 | セクション2 |
| `backend/app/Application/Project/UseCases/GetProjectListUseCase.php` | 新規 | セクション2 |
| `backend/app/Application/Project/UseCases/GetProjectDetailUseCase.php` | 新規 | セクション2 |
| `backend/app/Application/Project/UseCases/CreateProjectUseCase.php` | 新規 | セクション2 |
| `backend/app/Application/Project/UseCases/UpdateProjectUseCase.php` | 新規 | セクション2 |
| `backend/app/Application/Project/UseCases/DeleteProjectUseCase.php` | 新規 | セクション2 |
| `backend/app/Infrastructure/Project/Repositories/EloquentProjectRepository.php` | 新規 | セクション2 |
| `backend/app/Http/Controllers/Project/GetListController.php` | 新規 | セクション2 |
| `backend/app/Http/Controllers/Project/GetDetailController.php` | 新規 | セクション2 |
| `backend/app/Http/Controllers/Project/CreateController.php` | 新規 | セクション2 |
| `backend/app/Http/Controllers/Project/UpdateController.php` | 新規 | セクション2 |
| `backend/app/Http/Controllers/Project/DeleteController.php` | 新規 | セクション2 |
| `backend/routes/api/endpoints/projects.php` | 新規 | セクション2 |
| `backend/routes/index.php` | 変更 | セクション2 |
| `backend/app/Providers/AppServiceProvider.php` | 変更 | セクション2 |
| `frontend/app/composables/useApi.ts` | 新規 | セクション3 |
| `frontend/app/composables/useAuth.ts` | 変更 | セクション3 |
| `frontend/app/composables/useProject.ts` | 新規 | セクション3 |
| `frontend/app/components/atoms/TextArea.vue` | 新規 | セクション4 |
| `frontend/app/components/molecules/Pagination.vue` | 新規 | セクション4 |
| `frontend/app/components/organisms/ProjectForm.vue` | 新規 | セクション4 |
| `frontend/app/pages/projects/index.vue` | 新規 | セクション4 |
| `frontend/app/pages/projects/create.vue` | 新規 | セクション4 |
| `frontend/app/pages/projects/[id].vue` | 新規 | セクション4 |
| `frontend/app/pages/projects/[id]/edit.vue` | 新規 | セクション4 |
