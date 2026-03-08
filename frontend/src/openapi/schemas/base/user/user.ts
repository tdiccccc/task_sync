import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

/**
 * ユーザー情報スキーマ
 */
export const UserSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: '山田太郎' }),
    email: z.string().email().openapi({ example: 'user@example.com' }),
    hourly_rate: z.number().nullable().describe('時給').openapi({ example: 3000 }),
    is_valid: z.boolean().describe('有効フラグ').openapi({ example: true }),
    roles: z
      .array(z.string())
      .describe('ロール一覧')
      .openapi({ example: ['admin'] }),
  })
  .openapi('User')

/** ユーザー情報の型 */
export type User = z.infer<typeof UserSchema>
