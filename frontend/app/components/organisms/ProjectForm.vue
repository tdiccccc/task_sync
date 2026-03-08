<script setup lang="ts">
import {
  CreateProjectRequestSchema,
  type CreateProjectRequest,
} from '~~/src/openapi/schemas/api/project/create'

interface Props {
  mode: 'create' | 'edit'
  initialData?: Partial<CreateProjectRequest>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  initialData: () => ({}),
})

const emit = defineEmits<{
  submit: [data: CreateProjectRequest]
}>()

interface FormState {
  name: string
  amount: number
  description: string
  started_at: string
  ended_at: string
  is_active: boolean
}

const form = reactive<FormState>({
  name: props.initialData.name ?? '',
  amount: props.initialData.amount ?? 0,
  description: props.initialData.description ?? '',
  started_at: props.initialData.started_at ?? '',
  ended_at: props.initialData.ended_at ?? '',
  is_active: props.initialData.is_active ?? true,
})

const fieldErrors = ref<Record<string, string[]>>({})

const handleSubmit = () => {
  fieldErrors.value = {}

  const payload = {
    ...form,
    started_at: form.started_at || null,
    ended_at: form.ended_at || null,
  }

  const result = CreateProjectRequestSchema.safeParse(payload)
  if (!result.success) {
    fieldErrors.value = result.error.flatten().fieldErrors as Record<string, string[]>
    return
  }

  emit('submit', result.data)
}

const submitLabel = computed(() => {
  if (props.loading) return '処理中...'
  return props.mode === 'create' ? '作成' : '更新'
})
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- 案件名 -->
    <FormField
      v-model="form.name"
      label="案件名"
      field-id="name"
      :error="fieldErrors.name?.[0]"
      placeholder="案件名を入力"
    />

    <!-- 金額 -->
    <div>
      <AppLabel for="amount">金額</AppLabel>
      <input
        id="amount"
        v-model.number="form.amount"
        type="number"
        placeholder="0"
        class="mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1"
        :class="
          fieldErrors.amount
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        "
      />
      <p v-if="fieldErrors.amount" class="mt-1 text-sm text-red-600">
        {{ fieldErrors.amount[0] }}
      </p>
    </div>

    <!-- 概要 -->
    <div>
      <AppLabel for="description">概要</AppLabel>
      <TextArea
        id="description"
        v-model="form.description"
        :rows="4"
        :error="!!fieldErrors.description"
        placeholder="プロジェクトの概要を入力"
      />
      <p v-if="fieldErrors.description" class="mt-1 text-sm text-red-600">
        {{ fieldErrors.description[0] }}
      </p>
    </div>

    <!-- 着手日 -->
    <FormField
      v-model="form.started_at"
      label="着手日"
      field-id="started_at"
      type="datetime-local"
      :error="fieldErrors.started_at?.[0]"
    />

    <!-- 完了日 -->
    <FormField
      v-model="form.ended_at"
      label="完了日"
      field-id="ended_at"
      type="datetime-local"
      :error="fieldErrors.ended_at?.[0]"
    />

    <!-- 進行中フラグ -->
    <div class="flex items-center gap-2">
      <input
        id="is_active"
        v-model="form.is_active"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <AppLabel for="is_active">進行中</AppLabel>
    </div>

    <!-- 送信ボタン -->
    <div class="flex gap-3">
      <Button type="submit" :loading="loading" :disabled="loading">
        {{ submitLabel }}
      </Button>
      <Button variant="secondary" @click="navigateTo('/projects')"> キャンセル </Button>
    </div>
  </form>
</template>
