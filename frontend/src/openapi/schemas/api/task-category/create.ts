import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { TaskCategorySchema } from '../../base/task-category/taskCategory'

extendZodWithOpenApi(z)

/**
 * タスクカテゴリ作成リクエストのスキーマ
 */
export const CreateTaskCategoryRequestSchema = z
  .object({
    name: z
      .string()
      .min(1, 'カテゴリ名は必須です')
      .max(50, 'カテゴリ名は50文字以内で入力してください')
      .describe('カテゴリ名')
      .openapi({ example: '設計' }),
    description: z
      .string()
      .max(500, '説明は500文字以内で入力してください')
      .nullable()
      .optional()
      .describe('説明')
      .openapi({ example: 'UI/UX設計作業' }),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'カラーコードの形式が正しくありません')
      .nullable()
      .optional()
      .describe('カラーコード')
      .openapi({ example: '#3B82F6' }),
    sort_order: z
      .number()
      .int()
      .min(0, '表示順は0以上で入力してください')
      .default(0)
      .describe('表示順')
      .openapi({ example: 0 }),
  })
  .openapi('CreateTaskCategoryRequest')

/**
 * タスクカテゴリ作成レスポンスのスキーマ
 */
export const CreateTaskCategoryResponseSchema = z.object({
  data: TaskCategorySchema,
})

/**
 * タスクカテゴリ作成エンドポイントをレジストリに登録する
 */
export function registerCreateTaskCategoryPath(registry: OpenAPIRegistry): void {
  registry.register('CreateTaskCategoryRequest', CreateTaskCategoryRequestSchema)

  registry.registerPath({
    method: 'post',
    path: '/api/projects/{projectId}/categories',
    summary: 'タスクカテゴリ作成',
    description: '指定されたプロジェクトに新しいタスクカテゴリを作成します',
    tags: ['TaskCategories'],
    request: {
      params: z.object({
        projectId: z.number().openapi({ example: 1 }),
      }),
      body: {
        content: {
          'application/json': {
            schema: CreateTaskCategoryRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'タスクカテゴリ作成成功',
        content: {
          'application/json': {
            schema: CreateTaskCategoryResponseSchema,
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

/** タスクカテゴリ作成リクエストの型 */
export type CreateTaskCategoryRequest = z.infer<typeof CreateTaskCategoryRequestSchema>

/** タスクカテゴリ作成レスポンスの型 */
export type CreateTaskCategoryResponse = z.infer<typeof CreateTaskCategoryResponseSchema>
