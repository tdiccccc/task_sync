import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

import { DateTimeSchema } from '../base/shared/DateTimeSchema'
extendZodWithOpenApi(z)

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

export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>
