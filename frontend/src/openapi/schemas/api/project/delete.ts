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
