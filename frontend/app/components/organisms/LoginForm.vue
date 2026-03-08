<script setup lang="ts">
interface Props {
  fieldErrors: Record<string, string[]>
  generalError: string
  loading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  submit: [email: string, password: string]
}>()

const email = defineModel<string>('email', { default: '' })
const password = defineModel<string>('password', { default: '' })

const handleSubmit = () => {
  emit('submit', email.value, password.value)
}
</script>

<template>
  <form
    class="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6"
    @submit.prevent="handleSubmit"
  >
    <!-- メールアドレス -->
    <FormField
      v-model="email"
      label="メールアドレス"
      field-id="email"
      type="email"
      :error="fieldErrors.email?.[0]"
    />

    <!-- パスワード -->
    <FormField
      v-model="password"
      label="パスワード"
      field-id="password"
      type="password"
      :error="fieldErrors.password?.[0]"
    />

    <!-- エラーメッセージ -->
    <p v-if="generalError" class="text-sm text-red-600">
      {{ generalError }}
    </p>

    <!-- 送信ボタン -->
    <Button type="submit" :loading="loading" class="w-full">
      {{ loading ? 'ログイン中...' : 'ログイン' }}
    </Button>
  </form>
</template>
