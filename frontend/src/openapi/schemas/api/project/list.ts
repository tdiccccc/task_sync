import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { ProjectSchema } from '../../base/project/project'
import { PaginationMetaSchema } from '../../base/shared/PaginationMetaSchema'

extendZodWithOpenApi(z)

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

/** PaginationMeta型をre-export */
export type { PaginationMeta } from '../../base/shared/PaginationMetaSchema'

/** プロジェクト一覧レスポンスの型 */
export type GetProjectListResponse = z.infer<typeof GetProjectListResponseSchema>
