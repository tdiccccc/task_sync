import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { TaskCategorySchema } from '../../base/task-category/taskCategory'

extendZodWithOpenApi(z)

/**
 * タスクカテゴリ更新リクエストのスキーマ
 */
export const UpdateTaskCategoryRequestSchema = z
  .object({
    name: z
      .string()
      .min(1, 'カテゴリ名は必須です')
      .max(50, 'カテゴリ名は50文字以内で入力してください')
      .describe('カテゴリ名')
      .openapi({ example: '設計（更新）' }),
    description: z
      .string()
      .max(500, '説明は500文字以内で入力してください')
      .nullable()
      .optional()
      .describe('説明')
      .openapi({ example: 'UI/UX設計作業（スコープ変更）' }),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'カラーコードの形式が正しくありません')
      .nullable()
      .optional()
      .describe('カラーコード')
      .openapi({ example: '#EF4444' }),
    sort_order: z
      .number()
      .int()
      .min(0, '表示順は0以上で入力してください')
      .describe('表示順')
      .openapi({ example: 1 }),
  })
  .openapi('UpdateTaskCategoryRequest')

/**
 * タスクカテゴリ更新レスポンスのスキーマ
 */
export const UpdateTaskCategoryResponseSchema = z.object({
  data: TaskCategorySchema,
})

/**
 * タスクカテゴリ更新エンドポイントをレジストリに登録する
 */
export function registerUpdateTaskCategoryPath(registry: OpenAPIRegistry): void {
  registry.register('UpdateTaskCategoryRequest', UpdateTaskCategoryRequestSchema)

  registry.registerPath({
    method: 'put',
    path: '/api/categories/{id}',
    summary: 'タスクカテゴリ更新',
    description: '指定されたタスクカテゴリを更新します',
    tags: ['TaskCategories'],
    request: {
      params: z.object({
        id: z.number().openapi({ example: 1 }),
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateTaskCategoryRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'タスクカテゴリ更新成功',
        content: {
          'application/json': {
            schema: UpdateTaskCategoryResponseSchema,
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
        description: 'タスクカテゴリが見つかりません',
      },
    },
  })
}

/** タスクカテゴリ更新リクエストの型 */
export type UpdateTaskCategoryRequest = z.infer<typeof UpdateTaskCategoryRequestSchema>

/** タスクカテゴリ更新レスポンスの型 */
export type UpdateTaskCategoryResponse = z.infer<typeof UpdateTaskCategoryResponseSchema>
