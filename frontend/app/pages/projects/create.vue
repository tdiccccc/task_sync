<script setup lang="ts">
import type { CreateProjectRequest } from '~~/src/openapi/schemas/api/project/create'

const { createProject, loading } = useProject()

const serverError = ref('')

const handleSubmit = async (data: CreateProjectRequest) => {
  serverError.value = ''
  try {
    await createProject(data)
    await navigateTo('/projects')
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'data' in e) {
      const errData = (e as { data: { message?: string } }).data
      serverError.value = errData.message ?? '作成に失敗しました'
    } else {
      serverError.value = '作成に失敗しました'
    }
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <h1 class="mb-6 text-2xl font-bold text-gray-900">プロジェクト作成</h1>

    <p v-if="serverError" class="mb-4 text-sm text-red-600">{{ serverError }}</p>

    <ProjectForm mode="create" :loading="loading" @submit="handleSubmit" />
  </div>
</template>
