import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

/**
 * ページネーションメタ情報スキーマ
 *
 * Laravelのpaginate()が返すメタ情報に対応する共通スキーマ。
 * 全リソースの一覧APIレスポンスで使用する。
 */
export const PaginationMetaSchema = z.object({
  current_page: z.number().openapi({ example: 1 }),
  last_page: z.number().openapi({ example: 5 }),
  per_page: z.number().openapi({ example: 15 }),
  total: z.number().openapi({ example: 73 }),
})

/** ページネーションメタ情報の型 */
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
