import { z } from 'zod'
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

/**
 * ログインリクエストのスキーマ
 */
export const LoginRequestSchema = z
  .object({
    email: z
      .string()
      .email('有効なメールアドレスを入力してください')
      .describe('メールアドレス')
      .openapi({ example: 'user@example.com' }),
    password: z
      .string()
      .min(1, 'パスワードを入力してください')
      .describe('パスワード')
      .openapi({ example: 'password' }),
  })
  .openapi('LoginRequest')

/**
 * ログインレスポンスのユーザースキーマ
 */
export const LoginUserSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: '山田太郎' }),
  email: z.string().email().openapi({ example: 'user@example.com' }),
})

/**
 * ログインレスポンスのスキーマ
 */
export const LoginResponseSchema = z
  .object({
    token: z.string().describe('認証トークン').openapi({ example: '1|abcdef...' }),
    user: LoginUserSchema,
  })
  .openapi('LoginResponse')

/**
 * ログインエンドポイントをレジストリに登録する
 */
export function registerLoginPath(registry: OpenAPIRegistry): void {
  registry.register('LoginRequest', LoginRequestSchema)
  registry.register('LoginResponse', LoginResponseSchema)

  registry.registerPath({
    method: 'post',
    path: '/api/login',
    summary: 'ログイン',
    description: 'メールアドレスとパスワードで認証します',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: LoginRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'ログイン成功',
        content: {
          'application/json': {
            schema: LoginResponseSchema,
          },
        },
      },
      422: {
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
    },
  })
}

/**
 * ログインリクエストの型
 */
export type LoginRequest = z.infer<typeof LoginRequestSchema>

/**
 * ログインレスポンスの型
 */
export type LoginResponse = z.infer<typeof LoginResponseSchema>
