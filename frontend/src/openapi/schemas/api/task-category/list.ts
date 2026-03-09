import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { TaskCategorySchema } from '../../base/task-category/taskCategory'

extendZodWithOpenApi(z)

/**
 * タスクカテゴリ一覧レスポンスのスキーマ
 */
export const GetTaskCategoryListResponseSchema = z.object({
  data: z.array(TaskCategorySchema),
})

/**
 * タスクカテゴリ一覧取得エンドポイントをレジストリに登録する
 */
export function registerGetTaskCategoryListPath(registry: OpenAPIRegistry): void {
  registry.register('TaskCategory', TaskCategorySchema)

  registry.registerPath({
    method: 'get',
    path: '/api/projects/{projectId}/categories',
    summary: 'タスクカテゴリ一覧取得',
    description: '指定されたプロジェクトのタスクカテゴリ一覧を取得します',
    tags: ['TaskCategories'],
    request: {
      params: z.object({
        projectId: z.number().openapi({ example: 1 }),
      }),
    },
    responses: {
      200: {
        description: 'タスクカテゴリ一覧取得成功',
        content: {
          'application/json': {
            schema: GetTaskCategoryListResponseSchema,
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

/** タスクカテゴリ一覧レスポンスの型 */
export type GetTaskCategoryListResponse = z.infer<typeof GetTaskCategoryListResponseSchema>
