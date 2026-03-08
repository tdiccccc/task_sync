import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { UserSchema } from '../../base/user'

extendZodWithOpenApi(z)

/**
 * GET /api/user レスポンススキーマ
 */
export const GetUserResponseSchema = z
  .object({
    user: UserSchema,
  })
  .openapi('GetUserResponse')

/**
 * ユーザー情報取得エンドポイントをレジストリに登録する
 */
export function registerGetUserPath(registry: OpenAPIRegistry): void {
  registry.register('User', UserSchema)
  registry.register('GetUserResponse', GetUserResponseSchema)

  registry.registerPath({
    method: 'get',
    path: '/api/user',
    summary: '認証ユーザー取得',
    description: '現在ログイン中のユーザー情報を返します',
    tags: ['Auth'],
    responses: {
      200: {
        description: '成功',
        content: { 'application/json': { schema: GetUserResponseSchema } },
      },
      401: { description: '未認証' },
    },
  })
}

/** GET /api/user レスポンスの型 */
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>
