import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import * as fs from 'fs'
import * as yaml from 'yaml'
import { CreateProjectRequestSchema } from './schemas/api/project.ts'

// Zodを拡張
extendZodWithOpenApi(z)

// レジストリを作成
const registry = new OpenAPIRegistry()

// ===== スキーマを登録 =====
registry.register('CreateProjectRequest', CreateProjectRequestSchema)

// ===== APIエンドポイントを登録 =====

// POST /api/projects - プロジェクト作成
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
          schema: z.object({
            id: z.number(),
            name: z.string(),
            amount: z.number(),
            description: z.string(),
            started_at: z.string().nullable(),
            ended_at: z.string().nullable(),
            is_active: z.boolean(),
            created_at: z.string(),
            updated_at: z.string(),
          }),
        },
      },
    },
    400: {
      description: 'バリデーションエラー',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            errors: z.record(z.array(z.string())),
          }),
        },
      },
    },
    401: {
      description: '認証エラー',
    },
  },
})

// ===== OpenAPI仕様を生成 =====
const generator = new OpenApiGeneratorV3(registry.definitions)

const document = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Task Management API',
    version: '1.0.0',
    description: 'タスク管理・工数管理システムのAPI仕様',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:8200',
      description: 'ローカル開発環境',
    },
  ],
  tags: [
    {
      name: 'Projects',
      description: 'プロジェクト管理',
    },
  ],
})

// ===== YAMLファイルとして出力 =====
const yamlContent = yaml.stringify(document)
const outputPath = '/workspace/backend/openapi/openapi.yaml'

fs.writeFileSync(outputPath, yamlContent, 'utf8')

console.log('✅ OpenAPI仕様を生成しました: backend/openapi/openapi.yaml')
console.log(`📄 ${Object.keys(document.paths || {}).length} エンドポイント`)
console.log(`📦 ${Object.keys(document.components?.schemas || {}).length} スキーマ`)
