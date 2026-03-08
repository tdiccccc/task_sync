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
