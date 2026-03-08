import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { DateTimeSchema } from '../../base/shared/DateTimeSchema'
extendZodWithOpenApi(z)

/**
 * プロジェクト作成リクエストのスキーマ
 */
export const CreateProjectRequestSchema = z
  .object({
    name: z
      .string()
      .min(1, '案件名は必須です')
      .max(50, '案件名は50文字以内で入力してください')
      .describe('案件名')
      .openapi({ example: '案件A' }),
    amount: z
      .number()
      .min(0, '金額は0円以上で入力してください')
      .describe('金額')
      .openapi({ example: 1000000 }),
    description: z
      .string()
      .max(500, '案件の概要は500文字以内で入力してください')
      .describe('案件の概要')
      .openapi({ example: '新規Webサイト開発プロジェクト' }),
    started_at: DateTimeSchema.nullable()
      .optional()
      .describe('着手日')
      .openapi({ example: '2024-01-01T00:00:00Z' }),
    ended_at: DateTimeSchema.nullable()
      .optional()
      .describe('完了日')
      .openapi({ example: '2024-12-31T23:59:59Z' }),
    is_active: z.boolean().default(true).describe('進行中フラグ').openapi({ example: true }),
  })
  .openapi('CreateProjectRequest')

/**
 * プロジェクト作成レスポンスのスキーマ
 */
export const CreateProjectResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number(),
  description: z.string(),
  started_at: z.string().nullable(),
  ended_at: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

/**
 * プロジェクト作成エンドポイントをレジストリに登録する
 */
export function registerCreateProjectPath(registry: OpenAPIRegistry): void {
  registry.register('CreateProjectRequest', CreateProjectRequestSchema)

  registry.registerPath({
    method: 'post',
    path: '/api/projects',
    summary: 'プロジェクト作成',
    description: '新しいプロジェクトを作成します',
    tags: ['Projects'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateProjectRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'プロジェクト作成成功',
        content: {
          'application/json': {
            schema: CreateProjectResponseSchema,
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
    },
  })
}

/**
 * プロジェクト作成リクエストの型
 */
export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>

/**
 * プロジェクトレスポンスの型
 */
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>
