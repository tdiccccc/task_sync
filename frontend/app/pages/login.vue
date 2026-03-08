<script setup lang="ts">
import { LoginRequestSchema, type LoginRequest } from '~~/src/openapi/schemas/api/auth/login'

definePageMeta({
  layout: 'auth',
})

const { login } = useAuth()

const form = reactive<LoginRequest>({
  email: '',
  password: '',
})

const fieldErrors = ref<Record<string, string[]>>({})
const generalError = ref('')
const loading = ref(false)

const handleSubmit = async (email: string, password: string) => {
  // クライアントバリデーション
  fieldErrors.value = {}
  generalError.value = ''

  const result = LoginRequestSchema.safeParse({ email, password })
  if (!result.success) {
    fieldErrors.value = result.error.flatten().fieldErrors as Record<string, string[]>
    return
  }

  // サーバーリクエスト
  loading.value = true
  try {
    await login(result.data.email, result.data.password)
    await navigateTo('/')
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'data' in e) {
      const data = (e as { data: { message?: string; errors?: Record<string, string[]> } }).data
      if (data.errors) {
        fieldErrors.value = data.errors
      } else {
        generalError.value = data.message ?? 'ログインに失敗しました'
      }
    } else if (e instanceof Error) {
      generalError.value = e.message
    } else {
      generalError.value = 'ログインに失敗しました'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md px-4">
    <h1 class="text-2xl font-bold text-gray-900">ログイン</h1>

    <LoginForm
      v-model:email="form.email"
      v-model:password="form.password"
      :field-errors="fieldErrors"
      :general-error="generalError"
      :loading="loading"
      @submit="handleSubmit"
    />
  </div>
</template>
