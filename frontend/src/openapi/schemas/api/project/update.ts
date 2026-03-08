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
