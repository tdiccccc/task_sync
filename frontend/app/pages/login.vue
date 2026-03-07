<script setup lang="ts">
const { user, login, logout } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message
    } else {
      error.value = 'ログインに失敗しました'
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
      error.value = e.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="max-width: 400px; margin: 80px auto; font-family: sans-serif">
    <h1>ログイン</h1>

    <div v-if="user" style="margin-top: 24px">
      <p>
        ログイン中: <strong>{{ user.name }}</strong> ({{ user.email }})
      </p>
      <button :disabled="loading" style="margin-top: 12px; padding: 8px 16px" @click="handleLogout">
        ログアウト
      </button>
    </div>

    <form
      v-else
      style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px"
      @submit.prevent="handleLogin"
    >
      <div>
        <label for="email">メールアドレス</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          style="display: block; width: 100%; padding: 8px; margin-top: 4px; box-sizing: border-box"
        />
      </div>
      <div>
        <label for="password">パスワード</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          style="display: block; width: 100%; padding: 8px; margin-top: 4px; box-sizing: border-box"
        />
      </div>
      <p v-if="error" style="color: red; margin: 0">
        {{ error }}
      </p>
      <button type="submit" :disabled="loading" style="padding: 8px 16px">ログイン</button>
    </form>
  </div>
</template>
