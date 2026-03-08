import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'
import * as fs from 'node:fs'
import * as yaml from 'yaml'
import { registerLoginPath } from './schemas/api/auth/login'
import { registerCreateProjectPath } from './schemas/api/project/create'
import { registerGetProjectListPath } from './schemas/api/project/list'
import { registerGetProjectDetailPath } from './schemas/api/project/detail'
import { registerUpdateProjectPath } from './schemas/api/project/update'
import { registerDeleteProjectPath } from './schemas/api/project/delete'
import { registerGetUserPath } from './schemas/api/user/get'

// Zodを拡張
extendZodWithOpenApi(z)

// レジストリを作成
const registry = new OpenAPIRegistry()

// ===== スキーマ・エンドポイントを登録 =====
registerLoginPath(registry)
registerCreateProjectPath(registry)
registerGetUserPath(registry)
registerGetProjectListPath(registry)
registerGetProjectDetailPath(registry)
registerUpdateProjectPath(registry)
registerDeleteProjectPath(registry)

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
      name: 'Auth',
      description: '認証',
    },
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
