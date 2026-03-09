import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

/**
 * タスクカテゴリ情報スキーマ（共通レスポンス）
 */
export const TaskCategorySchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    project_id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: '設計' }),
    description: z.string().nullable().openapi({ example: 'UI/UX設計作業' }),
    color: z.string().nullable().openapi({ example: '#3B82F6' }),
    sort_order: z.number().openapi({ example: 0 }),
    created_at: z.string().openapi({ example: '2024-01-01T00:00:00Z' }),
    updated_at: z.string().openapi({ example: '2024-01-01T00:00:00Z' }),
  })
  .openapi('TaskCategory')

/** タスクカテゴリ情報の型 */
export type TaskCategory = z.infer<typeof TaskCategorySchema>
