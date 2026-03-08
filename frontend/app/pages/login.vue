<script setup lang="ts">
import { Label } from 'reka-ui'
//frontend/src/openapi/schemas/api/auth/login.ts
import { LoginRequestSchema, type LoginRequest } from '~~/src/openapi/schemas/api/auth/login'

const { user, login, logout } = useAuth()

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

const handleLogout = async () => {
  loading.value = true
  try {
    await logout()
  } catch (e: unknown) {
    if (e instanceof Error) {
      generalError.value = e.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="mx-auto mt-20 max-w-md px-4">
    <h1 class="text-2xl font-bold text-gray-900">ログイン</h1>

    <!-- ログイン済み表示 -->
    <div v-if="user" class="mt-6 rounded-lg border border-gray-200 bg-white p-6">
      <p class="text-gray-700">
        ログイン中:
        <strong class="text-gray-900">{{ user.name }}</strong>
        ({{ user.email }})
      </p>
      <button
        :disabled="loading"
        class="mt-4 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        @click="handleLogout"
      >
        ログアウト
      </button>
    </div>

    <!-- ログインフォーム -->
    <form
      v-else
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
