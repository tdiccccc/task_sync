import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

/**
 * タスクカテゴリ削除レスポンスのスキーマ
 */
export const DeleteTaskCategoryResponseSchema = z.object({
  message: z.string().openapi({ example: 'タスクカテゴリを削除しました' }),
})

/**
 * タスクカテゴリ削除エンドポイントをレジストリに登録する
 */
export function registerDeleteTaskCategoryPath(registry: OpenAPIRegistry): void {
  registry.registerPath({
    method: 'delete',
    path: '/api/categories/{id}',
    summary: 'タスクカテゴリ削除',
    description: '指定されたタスクカテゴリを削除します',
    tags: ['TaskCategories'],
    request: {
      params: z.object({
        id: z.number().openapi({ example: 1 }),
      }),
    },
    responses: {
      200: {
        description: 'タスクカテゴリ削除成功',
        content: {
          'application/json': {
            schema: DeleteTaskCategoryResponseSchema,
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

/** タスクカテゴリ削除レスポンスの型 */
export type DeleteTaskCategoryResponse = z.infer<typeof DeleteTaskCategoryResponseSchema>
