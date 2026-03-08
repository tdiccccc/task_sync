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
