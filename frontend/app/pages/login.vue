<script setup lang="ts">
import { Label } from 'reka-ui'
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

const handleLogin = async () => {
  // クライアントバリデーション
  fieldErrors.value = {}
  generalError.value = ''

  const result = LoginRequestSchema.safeParse(form)
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

    <!-- ログインフォーム -->
    <form
      class="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6"
      @submit.prevent="handleLogin"
    >
      <!-- メールアドレス -->
      <div>
        <Label for="email" class="block text-sm font-medium text-gray-700"> メールアドレス </Label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          :class="{ 'border-red-500': fieldErrors.email }"
        />
        <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600">
          {{ fieldErrors.email[0] }}
        </p>
      </div>

      <!-- パスワード -->
      <div>
        <Label for="password" class="block text-sm font-medium text-gray-700"> パスワード </Label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          :class="{ 'border-red-500': fieldErrors.password }"
        />
        <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">
          {{ fieldErrors.password[0] }}
        </p>
      </div>

      <!-- エラーメッセージ -->
      <p v-if="generalError" class="text-sm text-red-600">
        {{ generalError }}
      </p>

      <!-- 送信ボタン -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'ログイン中...' : 'ログイン' }}
      </button>
    </form>
  </div>
</template>
